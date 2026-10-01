import type {Graph} from './index';

/** Kahn topology plus longest-chain DP: O(V+E), auxiliary space O(V+E).
 * Alternate-path checks for transitive edges: O(E*(V+E)). Weak never participates.
 */
export function analyzeStrongGraph(graph:Graph){
 const ids=graph.nodes.filter(n=>!n.retired).map(n=>n.id),known=new Set(ids);
 const edges=graph.edges.filter(e=>e.enabled&&e.dependencyType==='strong');
 const invalidEndpoints=edges.filter(e=>!known.has(e.sourceNodeId)||!known.has(e.targetNodeId)).map(e=>e.id);
 if(invalidEndpoints.length)throw new Error('UNKNOWN_ENDPOINT:'+invalidEndpoints.join(','));
 const incoming=new Map(ids.map(id=>[id,[] as string[]])),outgoing=new Map(ids.map(id=>[id,[] as string[]]));
 for(const e of edges){incoming.get(e.targetNodeId)!.push(e.sourceNodeId);outgoing.get(e.sourceNodeId)!.push(e.targetNodeId);}
 const degree=new Map(ids.map(id=>[id,incoming.get(id)!.length]));
 const roots=ids.filter(id=>degree.get(id)===0),queue=[...roots],order:string[]=[];
 const depth=new Map(ids.map(id=>[id,0])),previous=new Map<string,string>();
 for(let head=0;head<queue.length;head++){
  const id=queue[head];order.push(id);
  for(const target of outgoing.get(id)!){
   if(depth.get(target)!<depth.get(id)!+1){depth.set(target,depth.get(id)!+1);previous.set(target,id);}
   degree.set(target,degree.get(target)!-1);if(degree.get(target)===0)queue.push(target);
  }
 }
 const isDag=order.length===ids.length;
 const outgoingEdges=new Map(ids.map(id=>[id,edges.filter(e=>e.sourceNodeId===id)]));
 const redundantEdgeIds=edges.filter(edge=>{
  const seen=new Set<string>(),stack=[edge.sourceNodeId];
  while(stack.length){const id=stack.pop()!;if(seen.has(id))continue;seen.add(id);
   for(const e of outgoingEdges.get(id)!)if(e.id!==edge.id)stack.push(e.targetNodeId);
  }
  return seen.has(edge.targetNodeId);
 }).map(e=>e.id);
 let tip=order.reduce<string|undefined>((best,id)=>best===undefined||depth.get(id)!>depth.get(best)!?id:best,undefined);
 const longestPath:string[]=[];
 if(isDag)while(tip!==undefined){longestPath.unshift(tip);tip=previous.get(tip);}
 const domainById=new Map(graph.nodes.map(n=>[n.id,n.domainId]));
 const crossDomainEdges=graph.edges.filter(e=>e.enabled&&domainById.has(e.sourceNodeId)&&domainById.has(e.targetNodeId)&&domainById.get(e.sourceNodeId)!==domainById.get(e.targetNodeId)).map(e=>({edgeId:e.id,sourceNodeId:e.sourceNodeId,targetNodeId:e.targetNodeId,reviewed:e.reviewStatus==='APPROVED'&&e.canonicalTextbookEvidence.length>0}));
 return {isDag,cycleDetected:!isDag,roots,leaves:ids.filter(id=>outgoing.get(id)!.length===0),crossDomainEdges,crossDomainReviewRequired:crossDomainEdges.filter(e=>!e.reviewed).map(e=>e.edgeId),
  isolatedNodes:ids.filter(id=>incoming.get(id)!.length===0&&outgoing.get(id)!.length===0),
  undeclaredRoots:roots.filter(id=>!graph.nodes.find(n=>n.id===id)!.isRoot),
  gatewayNodes:ids.filter(id=>outgoing.get(id)!.length>=3),
  convergenceNodes:ids.filter(id=>incoming.get(id)!.length>=2),
  longestPath,longestPathEdges:Math.max(0,longestPath.length-1),maximumDirectPrerequisites:Math.max(0,...[...incoming.values()].map(x=>x.length)),
  overconnected:graph.nodes.filter(n=>(incoming.get(n.id)?.length??0)>n.maxStrongPrerequisites).map(n=>n.id),
  redundantEdgeIds,topologicalOrder:order,
 };
}

/** Use only after mathematical review. Preserves all Weak and disabled audit edges. */
export function reduceStrongGraph(graph:Graph){
 const analysis=analyzeStrongGraph(graph);
 if(!analysis.isDag)throw new Error('TRANSITIVE_REDUCTION_REQUIRES_DAG');
 const removed=new Set(analysis.redundantEdgeIds);
 return {graph:{...graph,edges:graph.edges.filter(e=>!removed.has(e.id))},removedEdgeIds:[...removed]};
}
