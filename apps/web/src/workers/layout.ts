import ELK from 'elkjs/lib/elk-api';
import ElkWorker from 'elkjs/lib/elk-worker.min.js?worker';
import type { Graph } from '../../../../packages/graph-core/src/index';
const cache=new Map<string,Record<string,{x:number;y:number}>>();

/** One real Worker; elk.bundled must not be nested inside another Worker. */
export function startLayout(graph: Graph, options:{direction?:'RIGHT'|'DOWN';nodeWidth?:number;nodeHeight?:number;nodeSpacing?:number;layerSpacing?:number}={}) {
  const started = performance.now();
  const direction=options.direction??'RIGHT';
  const nodeWidth=options.nodeWidth??210,nodeHeight=options.nodeHeight??100,nodeSpacing=options.nodeSpacing??42,layerSpacing=options.layerSpacing??105;
  const key=JSON.stringify({releaseId:(graph as Graph&{releaseId?:string}).releaseId,version:'v2',direction,size:[nodeWidth,nodeHeight],spacing:[nodeSpacing,layerSpacing],nodes:graph.nodes.map(n=>[n.id,n.domainId]),edges:graph.edges.filter(e=>e.enabled&&e.dependencyType==='strong').map(e=>[e.sourceNodeId,e.targetNodeId])});
  const cached=cache.get(key);if(cached)return {result:Promise.resolve(cached),cancel:()=>{}};
  const worker = new ElkWorker();
  const elk = new ELK({ workerFactory: () => worker });
  let timer: ReturnType<typeof setTimeout>;
  const failure = new Promise<never>((_, reject) => {
    worker.addEventListener('error', event => reject(new Error(event.message || 'Layout worker failed')));
    timer = setTimeout(() => reject(new Error('Layout timed out')), 15000);
  });
  const result = Promise.race([
    elk.layout({
      id: 'root',
      layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': direction, 'elk.spacing.nodeNode': String(nodeSpacing), 'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing) },
      children: graph.nodes.map(n => ({ id: n.id, width: nodeWidth, height: nodeHeight })),
      edges: graph.edges.filter(e => e.enabled && e.dependencyType === 'strong')
        .map(e => ({ id: e.id, sources: [e.sourceNodeId], targets: [e.targetNodeId] })),
    }),
    failure,
  ]).then(layout => { performance.measure('knowledge-layout', {start: started, end: performance.now()}); const positions=Object.fromEntries((layout.children ?? []).map(n => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])); if(cache.size>=8)cache.delete(cache.keys().next().value!);cache.set(key,positions);return positions; })
    .finally(() => { clearTimeout(timer); worker.terminate(); });
  return { result, cancel: () => { clearTimeout(timer); worker.terminate(); } };
}
