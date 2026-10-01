import type {KnowledgeNode, KnowledgeEdge, PathQuery, PathResult} from '../../domain/src/index';
import type {Graph} from './index';

/** Build once per immutable release. Traversals cost O(V + E), not O(VE). */
export function indexGraph(graph: Graph) {
 const nodesById = new Map(graph.nodes.filter(n => !n.retired).map(n => [n.id, n]));
 const incomingStrong = new Map<string, string[]>(), outgoingStrong = new Map<string, string[]>();
 const directConnections = new Map<string, Set<string>>(), domainIndex = new Map<string, string[]>();
 for (const n of nodesById.values()) {
  incomingStrong.set(n.id, []); outgoingStrong.set(n.id, []); directConnections.set(n.id, new Set());
  if(!domainIndex.has(n.domainId))domainIndex.set(n.domainId,[]);
  domainIndex.get(n.domainId)!.push(n.id);
 }
 const edges: KnowledgeEdge[] = [];
 for (const e of graph.edges) {
  if (!e.enabled || !nodesById.has(e.sourceNodeId) || !nodesById.has(e.targetNodeId)) continue;
  directConnections.get(e.sourceNodeId)!.add(e.targetNodeId); directConnections.get(e.targetNodeId)!.add(e.sourceNodeId);
  if (e.dependencyType !== 'strong') continue;
  edges.push(e); incomingStrong.get(e.targetNodeId)!.push(e.sourceNodeId); outgoingStrong.get(e.sourceNodeId)!.push(e.targetNodeId);
 }
 return {nodesById, incomingStrong, outgoingStrong, directConnections, domainIndex, edges};
}
export type GraphIndex = ReturnType<typeof indexGraph>;
export function walk(index: GraphIndex, targets: readonly string[], direction: 'incomingStrong' | 'outgoingStrong') {
 const seen = new Set<string>(), stack = [...targets];
 while (stack.length) {
  const id = stack.pop()!;
  if (!index.nodesById.has(id)) throw new Error('UNKNOWN_NODE');
  if (seen.has(id)) continue;
  seen.add(id); stack.push(...index[direction].get(id)!);
 }
 return seen;
}
export function projectStatuses(index: GraphIndex, unlocked: ReadonlySet<string>) {
 return Object.fromEntries([...index.nodesById.keys()].map(id => [id, unlocked.has(id) ? 'unlocked' as const :
  index.incomingStrong.get(id)!.every(parent => unlocked.has(parent)) ? 'available' as const : 'locked' as const]));
}
export function findPath(index: GraphIndex, query: PathQuery): PathResult {
 let ids: Set<string>;
 if (query.mode === 'between') {
  const from = walk(index, [query.source], 'outgoingStrong');
  const to = walk(index, [query.target], 'incomingStrong');
  ids = new Set([...from].filter(id => to.has(id)));
 } else ids = walk(index, [query.nodeId], query.mode === 'to' ? 'incomingStrong' : 'outgoingStrong');
 return {nodeIds: [...ids], edgeIds: index.edges.filter(e => ids.has(e.sourceNodeId) && ids.has(e.targetNodeId)).map(e => e.id), reachable: ids.size > 0};
}
/** Separate relation traversal: Weak inclusion never mutates the unlock index. O(V+E). */
export function findKnowledgePath(graph: Graph, query: PathQuery, includeWeak = false): PathResult {
 const ids=new Set(graph.nodes.filter(n=>!n.retired).map(n=>n.id));
 const edges=graph.edges.filter(e=>e.enabled&&ids.has(e.sourceNodeId)&&ids.has(e.targetNodeId)&&(includeWeak||e.dependencyType==='strong'));
 const incoming=new Map<string,string[]>(),outgoing=new Map<string,string[]>();
 for(const id of ids){incoming.set(id,[]);outgoing.set(id,[]);}
 for(const e of edges){incoming.get(e.targetNodeId)!.push(e.sourceNodeId);outgoing.get(e.sourceNodeId)!.push(e.targetNodeId);}
 const traverse=(start:string,map:Map<string,string[]>)=>{
  if(!ids.has(start))throw new Error('UNKNOWN_NODE');
  const seen=new Set<string>(),stack=[start];
  while(stack.length){const id=stack.pop()!;if(seen.has(id))continue;seen.add(id);stack.push(...map.get(id)!);}
  return seen;
 };
 let selected:Set<string>;
 if(query.mode==='between'){
  const from=traverse(query.source,outgoing),to=traverse(query.target,incoming);
  selected=new Set([...from].filter(id=>to.has(id)));
 }else selected=traverse(query.nodeId,query.mode==='to'?incoming:outgoing);
 return {nodeIds:[...selected],edgeIds:edges.filter(e=>selected.has(e.sourceNodeId)&&selected.has(e.targetNodeId)).map(e=>e.id),reachable:selected.size>0};
}
export function normalizeSearch(value: string) {
 return value.replace(/[²³]/g, x => x === '²' ? '^2' : '^3').normalize('NFKC').toLowerCase()
  .replace(/[′’]/g, "'").replace(/_\{([^{}]+)\}/g, '_$1').replace(/\s+/g, '');
}
function distance(a: string, b: string): number {
 if (Math.abs(a.length - b.length) > 1) return 2;
 let previous = Array.from({length: b.length + 1}, (_, i) => i);
 for (let i = 1; i <= a.length; i++) {
  const row = [i];
  for (let j = 1; j <= b.length; j++) row[j] = Math.min(row[j-1] + 1, previous[j] + 1, previous[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  previous = row;
 }
 return previous[b.length];
}
export function searchNodes(nodes: readonly KnowledgeNode[], input: string): KnowledgeNode[] {
 const q = normalizeSearch(input).slice(0, 100); if (!q) return [];
 return nodes.filter(n => !n.retired).map(node => {
  const fields = [node.nameZh, node.nameEn ?? '', node.namePinyin, node.pinyinInitials, ...node.aliases, ...node.studentAliases, ...node.mathNotationAliases];
  const score = (value: string) => {const v = normalizeSearch(value); return v === q ? 0 : v.startsWith(q) ? 1 : v.includes(q) ? 2 : q.length >= 3 && distance(v, q) <= 1 ? 4 : 99;};
  return {node, rank: Math.min(...fields.map(score), score(node.achievementName) + 0.5)};
 }).filter(x => x.rank < 99).sort((a,b) => a.rank - b.rank || a.node.id.localeCompare(b.node.id)).map(x => x.node);
}
/** Portal IDs belong only to the view; commands must use targetNodeId. */
export function domainPortals(index: GraphIndex, domainId: string) {
 const local = new Set(index.domainIndex.get(domainId) ?? []);
 return index.edges.filter(e => local.has(e.sourceNodeId) !== local.has(e.targetNodeId)).map(e => {
  const targetNodeId = local.has(e.sourceNodeId) ? e.targetNodeId : e.sourceNodeId;
  return {id: `view:portal:${domainId}:${e.id}`, targetNodeId, edgeId: e.id, targetDomainId: index.nodesById.get(targetNodeId)!.domainId};
 });
}
