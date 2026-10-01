import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {setsLogicCrossDomainReviews,setsLogicGraph,setsLogicSeed,setsLogicSystem,setsLogicValidation} from '../../content/fixtures/sets-logic-system';

describe('PEP-A sets and logic curriculum system',()=>{
 it('has unique textbook-located concepts for set theory and elementary logic',()=>{
  expect(setsLogicSystem.concepts).toHaveLength(34);
  expect(new Set(setsLogicSystem.concepts.map(node=>node.id)).size).toBe(34);
  expect(new Set(setsLogicSystem.concepts.map(node=>node.canonicalName)).size).toBe(34);
  expect(setsLogicSystem.concepts.every(node=>node.domainId==='sets-logic'&&node.sources.length>0)).toBe(true);
  expect(setsLogicSystem.concepts.filter(node=>node.isKeyAchievement)).toHaveLength(4);
  for(const node of setsLogicSystem.concepts)for(const source of node.sources){
   expect(source.sourceRef).toMatch(/^PEP-A:B1:C1:S1\.[1-5]$/);
   expect(source.pdfPage).toBe(source.printedPage+7);
   expect(source.evidence.evidenceStatus).toBe('DIRECT');
  }
 });
 it('passes cycle, duplicate, prerequisite-root, transitive-reduction, orphan and overconnection gates',()=>{
  const report=analyzeStrongGraph(setsLogicGraph);
  expect(setsLogicValidation).toEqual([]);
  expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});
  expect(setsLogicSeed.publicationEligible).toBe(true);
  expect(setsLogicGraph.edges.every(edge=>edge.enabled&&edge.reviewStatus==='APPROVED'&&edge.canonicalTextbookEvidence.length>0)).toBe(true);
  expect(setsLogicGraph.edges.filter(edge=>edge.dependencyType==='weak')).toHaveLength(3);
 });
 it('reviews the set-language bridge to functions without turning it into an unlock prerequisite',()=>{
  expect(setsLogicCrossDomainReviews).toHaveLength(1);
  expect(setsLogicCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-SET-CONCEPT-001',targetNodeId:'HS-FUNC-CONCEPT-001',sourceDomainId:'sets-logic',targetDomainId:'functions',dependencyType:'weak',reviewStatus:'APPROVED'});
  expect(setsLogicCrossDomainReviews[0].canonicalTextbookEvidence).toHaveLength(2);
  expect(setsLogicCrossDomainReviews[0].outcome.publicationEligible).toBe(true);
 });
});
