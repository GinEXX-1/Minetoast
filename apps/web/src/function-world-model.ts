import {functionCandidateGraph,functionDependencySeed} from '../../../content/fixtures/function-dependencies';
import {functionOntologySeed} from '../../../content/fixtures/function-ontology';
import {functionDetailById,functionNodeDetails,searchFunctionDetails} from '../../../content/fixtures/function-details';
import {keyAchievementDecisions} from '../../../content/fixtures/function-dependency-reviews';
import {findKnowledgePath,indexGraph,normalizeSearch,projectStatuses,strongAncestors,statusOf,type Graph} from '../../../packages/graph-core/src/index';
import type {PathQuery} from '../../../packages/domain/src/index';

export const worldGraph=functionCandidateGraph;
export const worldIndex=indexGraph(worldGraph);
export const worldNodes=new Map(functionOntologySeed.nodes.filter(n=>worldIndex.nodesById.has(n.id)).map(n=>[n.id,n]));
export const worldKeys=new Set<string>(keyAchievementDecisions.filter(d=>d.decision==='CONFIRM_KEY').map(d=>d.nodeId));
export const worldGraphVersion=functionDependencySeed.fixtureVersion;
export const worldProgressStorageKey='kw:function-world:phase2d-v1';

export const worldModuleOrder=['foundation','concepts','representations','properties','types','graphs','applications'] as const;
export const worldModuleLabels:Record<string,string>={foundation:'基础',concepts:'函数概念',representations:'表示与基本能力',properties:'函数性质',types:'典型函数',graphs:'函数图象',applications:'零点与应用'};
export const worldModuleIds=new Map<string,string[]>();
for(const id of worldIndex.nodesById.keys()){
 const module=worldNodes.get(id)?.module;if(!module)throw new Error(`WORLD_MODULE_MISSING:${id}`);
 if(!worldModuleIds.has(module))worldModuleIds.set(module,[]);
 worldModuleIds.get(module)!.push(id);
}
export interface WorldProgress{schemaVersion:1;graphVersion:string;initialized:boolean;unlockedNodeIds:string[];}
export const emptyWorldProgress=():WorldProgress=>({schemaVersion:1,graphVersion:worldGraphVersion,initialized:false,unlockedNodeIds:[]});
export function parseWorldProgress(raw:string|null):WorldProgress{
 if(!raw)return emptyWorldProgress();
 try{
  const value:unknown=JSON.parse(raw);
  if(!value||typeof value!=='object')return emptyWorldProgress();
  const record=value as Record<string,unknown>;
  if(record.schemaVersion!==1||record.graphVersion!==worldGraphVersion||typeof record.initialized!=='boolean'||!Array.isArray(record.unlockedNodeIds))return emptyWorldProgress();
  const ids=[...new Set(record.unlockedNodeIds.filter((id):id is string=>typeof id==='string'&&worldIndex.nodesById.has(id)))];
  return {schemaVersion:1,graphVersion:worldGraphVersion,initialized:record.initialized,unlockedNodeIds:ids};
 }catch{return emptyWorldProgress();}
}
function withUnlocked(previous:WorldProgress,ids:ReadonlySet<string>):WorldProgress{return {...previous,unlockedNodeIds:[...ids]};}
export function initializeWorldTarget(previous:WorldProgress,targetId:string){
 return initializeGraphTarget(worldGraph,previous,targetId);
}
export function initializeGraphTarget(graph:Graph,previous:WorldProgress,targetId:string){
 if(previous.initialized)throw new Error('INITIALIZATION_FINISHED');
 const closure=strongAncestors(graph,[targetId]);
 const before=new Set(previous.unlockedNodeIds),added=[...closure].filter(id=>!before.has(id));
 return {next:withUnlocked(previous,new Set([...before,...closure])),addedAncestorIds:added.filter(id=>id!==targetId),addedTargetId:added.includes(targetId)?targetId:null};
}
export function summarizeInitializationFeedback(targetId:string|null,ancestorIds:readonly string[],maxAnimatedAncestors=8){
 const addedCount=ancestorIds.length+(targetId?1:0);
 return {ancestorPulseIds:ancestorIds.slice(0,Math.max(0,maxAnimatedAncestors)),toastText:addedCount>1?`已自动点亮 ${addedCount} 个知识节点`:null};
}
export function unlockWorldNode(previous:WorldProgress,nodeId:string){
 if(!previous.initialized)throw new Error('INITIALIZATION_ACTIVE');
 const before=new Set(previous.unlockedNodeIds),status=statusOf(worldGraph,before,nodeId);
 if(status!=='available')return {next:previous,unlocked:false,status};
 before.add(nodeId);return {next:withUnlocked(previous,before),unlocked:true,status};
}
export function finishWorldInitialization(previous:WorldProgress):WorldProgress{return {...previous,initialized:true};}
export function worldStatuses(progress:WorldProgress){return projectStatuses(worldIndex,new Set(progress.unlockedNodeIds));}
export function worldProgressCounts(progress:WorldProgress){
 const unlocked=new Set(progress.unlockedNodeIds),modules=worldModuleOrder.map(id=>({id,label:worldModuleLabels[id],total:worldModuleIds.get(id)?.length??0,unlocked:(worldModuleIds.get(id)??[]).filter(n=>unlocked.has(n)).length}));
 return {unlocked:unlocked.size,total:worldGraph.nodes.length,percentage:Math.round(unlocked.size/worldGraph.nodes.length*100),modules};
}
export function worldPath(query:PathQuery,includeWeak=false){return findKnowledgePath(worldGraph,query,includeWeak);}

/** Deterministic DAG fallback if the layout worker is unavailable. O(V+E). */
export function fallbackWorldPositions(){
 const indegree=new Map(worldGraph.nodes.map(n=>[n.id,0])),level=new Map(worldGraph.nodes.map(n=>[n.id,0]));
 const outgoing=new Map(worldGraph.nodes.map(n=>[n.id,[] as string[]]));
 for(const edge of worldGraph.edges)if(edge.dependencyType==='strong'){
  indegree.set(edge.targetNodeId,(indegree.get(edge.targetNodeId)??0)+1);
  outgoing.get(edge.sourceNodeId)!.push(edge.targetNodeId);
 }
 const queue=[...indegree].filter(([,count])=>count===0).map(([id])=>id);
 for(let index=0;index<queue.length;index++){
  const id=queue[index];
  for(const child of outgoing.get(id)??[]){
   level.set(child,Math.max(level.get(child)??0,(level.get(id)??0)+1));
   indegree.set(child,indegree.get(child)!-1);
   if(indegree.get(child)===0)queue.push(child);
  }
 }
 if(queue.length!==worldGraph.nodes.length)throw new Error('WORLD_GRAPH_NOT_DAG');
 const byLevel=new Map<number,string[]>();
 for(const {id} of worldGraph.nodes){const rank=level.get(id)!;if(!byLevel.has(rank))byLevel.set(rank,[]);byLevel.get(rank)!.push(id);}
 return Object.fromEntries([...byLevel].flatMap(([rank,ids])=>ids.map((id,index)=>[id,{x:index*270,y:rank*210}])));
}

const searchExtras:Record<string,string[]>={
 'HS-FUNC-MONO-001':['函数单调性','单调','hsdtx','monotonicity','增函数','减函数'],
 'HS-FUNC-PARITY-001':['f(-x)=f(x)','f(-x)=-f(x)','奇偶'],
 'HS-FUNC-SYMMETRY-001':['函数对称','关于y轴对称'],
 'HS-FUNC-ZERO-001':['f(x)=0','函数根'],
 'HS-FUNC-QUAD-001':['x^2','x²','抛物线'],
 'HS-FUNC-RECIPROCAL-001':['k/x','双曲线'],
};
const normalizedExtras=new Map(Object.entries(searchExtras).map(([id,terms])=>[id,terms.map(normalizeSearch)]));
export function searchWorld(input:string){
 const q=normalizeSearch(input).slice(0,100);if(!q)return {nodes:[],pendingScope:false};
 const matches=new Map(searchFunctionDetails(input).map((d,i)=>[d.identity.nodeId,i+1]));
 for(const [id,terms] of normalizedExtras)if(terms.some(term=>term===q||term.startsWith(q)||term.includes(q)))matches.set(id,Math.min(matches.get(id)??99,0));
 const nodes=[...matches].sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0])).map(([id])=>functionDetailById.get(id)!).filter(Boolean);
 const pendingScope=['左右平移','函数图像平移','函数图象平移','horizontal shift','vertical shift','函数图像伸缩'].some(term=>normalizeSearch(term).includes(q)||q.includes(normalizeSearch(term)));
 return {nodes,pendingScope};
}
export const worldDetails=functionNodeDetails;
export const worldDetailById=functionDetailById;
