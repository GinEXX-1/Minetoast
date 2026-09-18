import type {KnowledgeNode,KnowledgeEdge,NodeStatus} from '../../domain/src/index';
export interface Graph {nodes:readonly KnowledgeNode[];edges:readonly KnowledgeEdge[];}
export function strongParents(graph:Graph,id:string):string[]{return graph.edges.filter(e=>e.enabled&&e.dependencyType==='strong'&&e.targetNodeId===id).map(e=>e.sourceNodeId);}
export function statusOf(graph:Graph,unlocked:ReadonlySet<string>,id:string):NodeStatus {
 if(!graph.nodes.some(n=>n.id===id)) throw new Error('UNKNOWN_NODE');
 if(unlocked.has(id)) return 'unlocked';
 return strongParents(graph,id).every(p=>unlocked.has(p))?'available':'locked';
}
export function strongAncestors(graph:Graph,targets:readonly string[]):Set<string>{
 const result=new Set<string>(); const stack=[...targets];
 const ids=new Set(graph.nodes.map(n=>n.id));
 while(stack.length){const id=stack.pop()!;if(!ids.has(id))throw new Error('UNKNOWN_NODE');if(result.has(id))continue;result.add(id);stack.push(...strongParents(graph,id));}
 return result;
}
export function validateGraph(graph:Graph):string[]{
 const issues:string[]=[]; const ids=new Set(graph.nodes.map(n=>n.id));
 if(ids.size!==graph.nodes.length)issues.push('DUPLICATE_NODE');
 const active=graph.edges.filter(e=>e.enabled);const pairs=new Set<string>();
 for(const e of active){const key=e.sourceNodeId+'>'+e.targetNodeId;if(pairs.has(key))issues.push('DUPLICATE_EDGE:'+key);pairs.add(key);if(!ids.has(e.sourceNodeId)||!ids.has(e.targetNodeId))issues.push('UNKNOWN_ENDPOINT');if(!e.rationale.trim())issues.push('MISSING_RATIONALE');}
 const visiting=new Set<string>(),visited=new Set<string>();
 function walk(id:string){if(visiting.has(id)){issues.push('CYCLE:'+id);return;}if(visited.has(id))return;visiting.add(id);for(const e of active.filter(e=>e.sourceNodeId===id))walk(e.targetNodeId);visiting.delete(id);visited.add(id);}
 for(const id of ids)walk(id);
 for(const n of graph.nodes){const count=strongParents(graph,n.id).length;if(count>n.maxStrongPrerequisites)issues.push('OVERCONNECTED:'+n.id);if(count===0&&!n.isRoot)issues.push('ORPHAN:'+n.id);}
 for(const edge of active.filter(e=>e.dependencyType==='strong')){
  const seen=new Set<string>(),stack=[edge.sourceNodeId];
  while(stack.length){const id=stack.pop()!;if(seen.has(id))continue;seen.add(id);for(const e of active.filter(e=>e.id!==edge.id&&e.dependencyType==='strong'&&e.sourceNodeId===id))stack.push(e.targetNodeId);}
  if(seen.has(edge.targetNodeId))issues.push('TRANSITIVE_REDUNDANCY:'+edge.id);
 }
 return [...new Set(issues)];
}
