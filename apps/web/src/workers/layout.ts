import ELK from 'elkjs/lib/elk-api';
import ElkWorker from 'elkjs/lib/elk-worker.min.js?worker';
import type { Graph } from '../../../../packages/graph-core/src/index';

/** One real Worker; elk.bundled must not be nested inside another Worker. */
export function startLayout(graph: Graph) {
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
      layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT', 'elk.spacing.nodeNode': '42', 'elk.layered.spacing.nodeNodeBetweenLayers': '105' },
      children: graph.nodes.map(n => ({ id: n.id, width: 210, height: 100 })),
      edges: graph.edges.filter(e => e.enabled && e.dependencyType === 'strong')
        .map(e => ({ id: e.id, sources: [e.sourceNodeId], targets: [e.targetNodeId] })),
    }),
    failure,
  ]).then(layout => Object.fromEntries((layout.children ?? []).map(n => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])))
    .finally(() => { clearTimeout(timer); worker.terminate(); });
  return { result, cancel: () => { clearTimeout(timer); worker.terminate(); } };
}
