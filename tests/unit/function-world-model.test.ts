import {describe,it,expect} from 'vitest';
import {emptyWorldProgress,finishWorldInitialization,initializeGraphTarget,initializeWorldTarget,parseWorldProgress,searchWorld,summarizeInitializationFeedback,unlockWorldNode,worldGraph,worldGraphVersion,worldKeys,worldPath,worldProgressCounts,worldStatuses} from '../../apps/web/src/function-world-model';
import {strongAncestors} from '../../packages/graph-core/src/index';

describe('Phase 2D Function World interaction model',()=>{
 it('projects all three states from Strong edges and preserves the frozen graph',()=>{
  const progress=finishWorldInitialization(emptyWorldProgress()),statuses=worldStatuses(progress);
  expect(worldGraph.nodes).toHaveLength(32);
  expect(worldGraph.edges.filter(e=>e.dependencyType==='strong')).toHaveLength(40);
  expect(worldGraph.edges.filter(e=>e.dependencyType==='weak')).toHaveLength(11);
  expect(statuses['HS-SET-CONCEPT-001']).toBe('available');
  expect(statuses['HS-FUNC-CONCEPT-001']).toBe('locked');
  const root=unlockWorldNode(progress,'HS-SET-CONCEPT-001');
  expect(root.unlocked).toBe(true);expect(worldStatuses(root.next)['HS-SET-CONCEPT-001']).toBe('unlocked');
  expect(unlockWorldNode(progress,'HS-FUNC-CONCEPT-001').unlocked).toBe(false);
 });
 it('initializes Strong ancestors plus target, with no Weak sibling or unrelated nodes',()=>{
  const target='HS-FUNC-APPLY-001',result=initializeWorldTarget(emptyWorldProgress(),target),closure=strongAncestors(worldGraph,[target]);
  expect(new Set(result.next.unlockedNodeIds)).toEqual(closure);
  expect(result.addedTargetId).toBe(target);
  expect(result.addedAncestorIds).not.toContain(target);
  expect(result.next.unlockedNodeIds).not.toContain('HS-FUNC-LINEAR-001');
  expect(result.next.unlockedNodeIds).not.toContain('HS-FUNC-QUAD-001');
 expect(initializeWorldTarget(result.next,target).addedTargetId).toBeNull();
 });
 it('batch initializes a 350-node prerequisite chain and bounds feedback to one toast and eight ancestor pulses',()=>{
  const nodes=Array.from({length:350},(_,i)=>({...worldGraph.nodes[0],id:`HS-TEST-${String(i).padStart(3,'0')}`,isRoot:i===0,maxStrongPrerequisites:3 as const}));
  const edges=nodes.slice(1).map((node,i)=>({...worldGraph.edges[0],id:`edge-${i}`,sourceNodeId:nodes[i].id,targetNodeId:node.id,dependencyType:'strong' as const,enabled:true}));
  const graph={nodes,edges};
  const targetId=nodes[nodes.length-1].id;
  const result=initializeGraphTarget(graph,emptyWorldProgress(),targetId);
  expect(result.next.unlockedNodeIds).toHaveLength(350);
  expect(result.addedAncestorIds).toHaveLength(349);
  expect(result.addedTargetId).toBe(targetId);
  const feedback=summarizeInitializationFeedback(result.addedTargetId,result.addedAncestorIds);
  expect(feedback.ancestorPulseIds).toHaveLength(8);
  expect(feedback.toastText).toBe('已自动点亮 350 个知识节点');
 });
 it('never uses Weak edges for paths or unlock state unless path display requests them',()=>{
  const query={mode:'between' as const,source:'HS-FUNC-LINEAR-001',target:'HS-FUNC-APPLY-001'};
  expect(worldPath(query).reachable).toBe(false);
  expect(worldPath(query,true).reachable).toBe(true);
  const before=worldStatuses(finishWorldInitialization(emptyWorldProgress()));
  worldPath(query,true);
  expect(worldStatuses(finishWorldInitialization(emptyWorldProgress()))).toEqual(before);
 });
 it('normalizes versioned local progress and reports actual unlocked counts',()=>{
  const parsed=parseWorldProgress(JSON.stringify({schemaVersion:1,graphVersion:worldGraphVersion,initialized:true,unlockedNodeIds:['HS-SET-CONCEPT-001','HS-SET-CONCEPT-001','unknown']}));
  expect(parsed.unlockedNodeIds).toEqual(['HS-SET-CONCEPT-001']);
  expect(worldProgressCounts(parsed)).toMatchObject({unlocked:1,total:32,percentage:3});
  expect(parseWorldProgress('{')).toEqual(emptyWorldProgress());
  expect(parseWorldProgress(JSON.stringify({...parsed,graphVersion:'old'}))).toEqual(emptyWorldProgress());
 });
 it('covers real graph search aliases and identifies frozen pending scope without fabricating a node',()=>{
  for(const term of ['函数单调性','单调','hsdtx','monotonicity','增函数'])expect(searchWorld(term).nodes.some(d=>d.identity.nodeId==='HS-FUNC-MONO-001')).toBe(true);
  expect(searchWorld('f(-x)=f(x)').nodes.some(d=>d.identity.nodeId==='HS-FUNC-PARITY-001')).toBe(true);
  expect(searchWorld('左右平移')).toEqual({nodes:[],pendingScope:true});
  expect(worldKeys.size).toBe(5);
 });
});
