import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {sequencesCrossDomainReviews,sequencesGraph,sequencesSeed,sequencesSystem,sequencesValidation} from '../../content/fixtures/sequences-system';

describe('PEP-A sequences curriculum system',()=>{
 it('has unique textbook-located concepts spanning the indexed chapter topics',()=>{
  expect(sequencesSystem.concepts).toHaveLength(37);
  expect(new Set(sequencesSystem.concepts.map(node=>node.id)).size).toBe(37);
  expect(new Set(sequencesSystem.concepts.map(node=>node.canonicalName)).size).toBe(37);
  expect(sequencesSystem.concepts.every(node=>node.domainId==='sequences'&&node.sources.length>0)).toBe(true);
  expect(sequencesSystem.concepts.filter(node=>node.isKeyAchievement)).toHaveLength(4);
  for(const node of sequencesSystem.concepts)for(const source of node.sources){
   expect(source.sourceRef).toMatch(/^PEP-A:X2:C4:S4\.[1-4]$/);
   expect(source.pdfPage).toBe(source.printedPage+5);
   expect(source.evidence.evidenceStatus).toBe('DIRECT');
  }
 });
 it('passes cycle, duplicate, prerequisite-root, transitive-reduction, orphan and overconnection gates',()=>{
  const report=analyzeStrongGraph(sequencesGraph);
  expect(sequencesValidation).toEqual([]);
  expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});
  expect(sequencesSeed.publicationEligible).toBe(true);
  expect(sequencesGraph.edges.every(edge=>edge.enabled&&edge.reviewStatus==='APPROVED'&&edge.canonicalTextbookEvidence.length>0)).toBe(true);
  expect(sequencesGraph.edges.filter(edge=>edge.dependencyType==='weak')).toHaveLength(2);
 });
 it('reviews the function-to-sequence concept bridge and excludes it from unlock prerequisites',()=>{
  expect(sequencesCrossDomainReviews).toHaveLength(1);
  expect(sequencesCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-FUNC-CONCEPT-001',targetNodeId:'HS-SEQ-DISCRETE-FUNCTION-001',sourceDomainId:'functions',targetDomainId:'sequences',dependencyType:'weak',reviewStatus:'APPROVED'});
  expect(sequencesCrossDomainReviews[0].canonicalTextbookEvidence).toHaveLength(2);
  expect(sequencesCrossDomainReviews[0].outcome.publicationEligible).toBe(true);
 });
});
