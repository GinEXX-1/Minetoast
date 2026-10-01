import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {validateGraph} from '../../packages/graph-core/src/index';
import {worldGraph} from '../../apps/web/src/function-world-model';
import {setsLogicSeed} from '../../content/fixtures/sets-logic-system';
import {algebraSeed} from '../../content/fixtures/algebra-system';
import {trigonometrySeed} from '../../content/fixtures/trigonometry-system';
import {sequencesSeed} from '../../content/fixtures/sequences-system';
import {vectorsSeed} from '../../content/fixtures/vectors-system';
import {geometrySeed} from '../../content/fixtures/geometry-system';
import {probabilitySeed} from '../../content/fixtures/probability-system';
import {calculusSeed} from '../../content/fixtures/calculus-system';

const systems=[setsLogicSeed,algebraSeed,trigonometrySeed,sequencesSeed,vectorsSeed,geometrySeed,probabilitySeed,calculusSeed];

describe('the complete high-school mathematics catalog',()=>{
 it('contains 350 unique canonical node IDs across nine independently audited graphs',()=>{
  const formalNames=new Map(worldGraph.nodes.map(node=>[node.id,node.nameZh]));
  const occurrences=new Map<string,string[]>();
  for(const [id,name] of formalNames)occurrences.set(id,[name]);
 for(const system of systems)for(const concept of system.concepts)occurrences.set(concept.id,[...(occurrences.get(concept.id)??[]),concept.canonicalName]);
  const shared=[...occurrences].filter(([,names])=>names.length>1);
  expect([...occurrences]).toHaveLength(350);
  expect(shared).toEqual([['HS-SET-CONCEPT-001',['集合的概念','集合的概念']]]);
  expect(worldGraph.nodes).toHaveLength(32);
  expect(systems.reduce((total,system)=>total+system.concepts.length,0)).toBe(319);
  expect(systems.reduce((total,system)=>total+new Set(system.concepts.filter(concept=>!formalNames.has(concept.id)).map(concept=>concept.id)).size,0)).toBe(318);
  for(const system of systems)expect(system.graph.nodes,system.id).toHaveLength(system.concepts.length);
 });

 it('passes cycle, prerequisite, reduction, orphan, overconnection and cross-domain review gates in every graph',()=>{
  expect(systems).toHaveLength(8);
  for(const system of systems){
   const report=analyzeStrongGraph(system.graph);
   expect(system.publicationEligible,system.id).toBe(true);
   expect(report.isDag,system.id).toBe(true);
   expect(report.undeclaredRoots,system.id).toEqual([]);
   expect(report.redundantEdgeIds,system.id).toEqual([]);
   expect(report.isolatedNodes,system.id).toEqual([]);
   expect(report.overconnected,system.id).toEqual([]);
   expect(report.crossDomainReviewRequired,system.id).toEqual([]);
   expect(system.graph.edges.every(edge=>edge.enabled&&edge.canonicalTextbookEvidence.length>0),system.id).toBe(true);
   expect(system.crossDomainReviews.length,system.id).toBeGreaterThan(0);
   expect(system.crossDomainReviews.every(review=>review.reviewStatus==='APPROVED'&&review.outcome.publicationEligible&&review.canonicalTextbookEvidence.length>0),system.id).toBe(true);
  }
 });

 it('applies the same strong-graph gates to the formal function system',()=>{
  expect(worldGraph.nodes).toHaveLength(32);
  expect(validateGraph(worldGraph)).toEqual([]);
  const report=analyzeStrongGraph(worldGraph);
  expect(report.isDag).toBe(true);
  expect(report.undeclaredRoots).toEqual([]);
  expect(report.redundantEdgeIds).toEqual([]);
  expect(report.isolatedNodes).toEqual([]);
  expect(report.overconnected).toEqual([]);
  expect(report.crossDomainReviewRequired).toEqual([]);
  expect(report.crossDomainEdges).toEqual([]);
 });
});
