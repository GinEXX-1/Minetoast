import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {functionCandidateGraph as graph,functionDependencyAssessments as assessments,functionEdgeSeed as auditEdges,functionDependencySeed} from '../../content/fixtures/function-dependencies';
import {prerequisiteDecisions,keyAchievementDecisions} from '../../content/fixtures/function-dependency-reviews';
import {unlockScenarios,pathScenarios} from '../../content/fixtures/function-graph-scenarios';
import {analyzeStrongGraph,reduceStrongGraph} from '../../packages/graph-core/src/analysis';
import {validateGraph,statusOf,strongParents,strongAncestors,indexGraph,findPath,findKnowledgePath,projectStatuses} from '../../packages/graph-core/src/index';
import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';

describe('Phase 2B independent candidate graph',()=>{
 it('preserves the frozen 2A registry while explicitly separating external and pending nodes',()=>{
  expect(functionDependencySeed.nodeRegistry).toHaveLength(36);expect(graph.nodes).toHaveLength(32);
  expect(prerequisiteDecisions).toHaveLength(6);expect(prerequisiteDecisions.filter(n=>n.visible)).toHaveLength(4);
  expect(keyAchievementDecisions).toHaveLength(5);expect(new Set(keyAchievementDecisions.map(n=>n.nodeId)).size).toBe(5);
  expect(functionDependencySeed.publicationEligible).toBe(false);
  for(const [file,hash] of [
   ['content/fixtures/function-ontology.ts','0c9a8f321028503046b2d79fa0c02cc24bb38b3f16be8d19d14055ceae06a236'],
   ['docs/phase-2/FUNCTION-ONTOLOGY.md','a42a00b1e41578a0ceece5bf5b7774411a0019df691eb784bf9b21e1b35f689a'],
   ['docs/phase-2/FUNCTION-TEXTBOOK-MAPPING.md','42965ec802bb2b7e17abf8e3ca77d4e3582307bedbab5e7009810b119ed198ea'],
  ])expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(hash);
 });
 it('passes structural checks, including reduction, without using them as quality judgments',()=>{
  expect(validateGraph(graph)).toEqual([]);
  expect(analyzeStrongGraph(graph)).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],maximumDirectPrerequisites:3,crossDomainEdges:[],crossDomainReviewRequired:[]});
  const redundant=assessments.filter(a=>a.stage==='removed').map(a=>({...auditEdges.find(e=>e.id===a.id)!,enabled:true,dependencyType:'strong' as const}));
  const reduced=reduceStrongGraph({...graph,edges:[...graph.edges,...redundant]});
  expect(new Set(reduced.removedEdgeIds)).toEqual(new Set(redundant.map(e=>e.id)));
  expect(new Set(reduced.graph.edges.map(e=>e.id))).toEqual(new Set(graph.edges.map(e=>e.id)));
  const reverse={...graph.edges[0],id:'test-cycle',sourceNodeId:graph.edges[0].targetNodeId,targetNodeId:graph.edges[0].sourceNodeId};
  expect(()=>reduceStrongGraph({...graph,edges:[...graph.edges,reverse]})).toThrow('REQUIRES_DAG');
 });
 it('materializes only passed decisions and isolates conflicts regardless of a HIGH label',()=>{
  for(const e of graph.edges){
   const a=assessments.find(a=>a.id===e.id)!;
   expect(e.rationale.length).toBeGreaterThan(10);expect(a.outcome.publicationEligible).toBe(true);
   expect(e.qualityDecision).toBe(e.dependencyType==='strong'?'KEEP_STRONG':'DOWNGRADE_TO_WEAK');
   if(a.record.confidence==='MEDIUM'){
    expect(a.record.aiReviews).toHaveLength(2);expect(new Set(a.record.aiReviews.map(r=>r.reviewerRunId)).size).toBe(2);
    expect(a.outcome.state).toBe('AI_REVIEW_2_PASSED');
   }
  }
  for(const e of auditEdges.filter(e=>['REVIEW_REQUIRED','REMOVE'].includes(e.qualityDecision)))expect(e.enabled).toBe(false);
  const conflict=assessments.find(a=>a.firstReviewCode==='PARITY>SYMMETRY')!;
  expect(conflict.outcome.decision).toBe('REVIEW_REQUIRED');
  expect(evaluateDependencyQuality({...conflict.record,confidence:'HIGH'}).publicationEligible).toBe(false);
  const agree=assessments.find(a=>a.firstReviewCode==='GRAPH>ZERO')!;
  expect(agree.record.aiReviews.map(r=>r.confidence)).toEqual(['MEDIUM','HIGH']);
  expect(agree.outcome.state).toBe('AI_REVIEW_2_PASSED');
 });
 for(const s of unlockScenarios)it(`simulates ${s.kind} ${s.target}: locked → available → unlocked and exact initialization`,()=>{
  expect(statusOf(graph,new Set(),s.target)).toBe('locked');
  const expected=new Set<string>(s.expected),before=new Set(expected);before.delete(s.target);
  for(const parent of strongParents(graph,s.target)){
   const missing=new Set(before);missing.delete(parent);expect(statusOf(graph,missing,s.target)).toBe('locked');
  }
  expect(statusOf(graph,before,s.target)).toBe('available');
  expect(statusOf(graph,expected,s.target)).toBe('unlocked');
  expect(strongAncestors(graph,[s.target])).toEqual(expected);
  expect(strongAncestors(graph,[s.target,s.target])).toEqual(expected);
  const withoutWeak={...graph,edges:graph.edges.filter(e=>e.dependencyType==='strong')};
  expect(strongAncestors(withoutWeak,[s.target])).toEqual(expected);
  expect(projectStatuses(indexGraph(graph),before)).toEqual(projectStatuses(indexGraph(withoutWeak),before));
  // Expected closure equality rules out Weak-only nodes, siblings, and unrelated roots.
  expect(expected.has('HS-ALG-INEQUALITY-001')).toBe(false);
 });
 for(const p of pathScenarios)it(`simulates to/from/between ${p.source} → ${p.target}`,()=>{
  const ix=indexGraph(graph),between={mode:'between' as const,source:p.source,target:p.target};
  const result=findKnowledgePath(graph,between);
  expect(result.reachable).toBe(true);expect(result.nodeIds).toContain(p.source);expect(result.nodeIds).toContain(p.target);
  expect(new Set(result.nodeIds)).toEqual(new Set(findPath(ix,between).nodeIds));
  expect(findKnowledgePath(graph,{mode:'to',nodeId:p.target}).nodeIds).toContain(p.source);
  expect(findKnowledgePath(graph,{mode:'from',nodeId:p.source}).nodeIds).toContain(p.target);
  for(const edgeId of result.edgeIds)expect(graph.edges.find(e=>e.id===edgeId)!.dependencyType).toBe('strong');
  const before=strongAncestors(graph,[p.target]);
  const full=findKnowledgePath(graph,between,true);
  for(const id of result.nodeIds)expect(full.nodeIds).toContain(id);
  expect(strongAncestors(graph,[p.target])).toEqual(before);
 });
 it('adds Weak-only paths without changing unlock or initialization, and rejects unknown IDs',()=>{
  for(const [source,target] of [['HS-FUNC-LINEAR-001','HS-FUNC-APPLY-001'],['HS-FUNC-INTERVAL-001','HS-FUNC-MONO-001'],['HS-FUNC-GRAPH-001','HS-FUNC-PARITY-001']]){
   const q={mode:'between' as const,source,target};
   expect(findKnowledgePath(graph,q).reachable).toBe(false);expect(findKnowledgePath(graph,q,true).reachable).toBe(true);
   expect(strongAncestors(graph,[target]).has(source)).toBe(false);
  }
  expect(()=>findKnowledgePath(graph,{mode:'to',nodeId:'missing'})).toThrow('UNKNOWN_NODE');
 });
});
