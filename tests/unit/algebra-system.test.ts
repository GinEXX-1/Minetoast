import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {algebraCrossDomainReviews,algebraGraph,algebraSeed,algebraSystem,algebraValidation} from '../../content/fixtures/algebra-system';

describe('PEP-A algebra and inequalities curriculum system',()=>{
 it('has unique textbook-located concepts across the indexed chapter sections',()=>{
  expect(algebraSystem.concepts).toHaveLength(30);
  expect(new Set(algebraSystem.concepts.map(node=>node.id)).size).toBe(30);
  expect(new Set(algebraSystem.concepts.map(node=>node.canonicalName)).size).toBe(30);
  expect(algebraSystem.concepts.every(node=>node.domainId==='algebra'&&node.sources.length>0)).toBe(true);
  expect(algebraSystem.concepts.filter(node=>node.isKeyAchievement)).toHaveLength(4);
  for(const node of algebraSystem.concepts)for(const source of node.sources){
   expect(source.sourceRef).toMatch(/^PEP-A:B1:C2:S2\.[1-3]$/);
   expect(source.pdfPage).toBe(source.printedPage+7);
   expect(source.evidence.evidenceStatus).toBe('DIRECT');
  }
 });
 it('passes cycle, duplicate, prerequisite-root, transitive-reduction, orphan and overconnection gates',()=>{
  const report=analyzeStrongGraph(algebraGraph);
  expect(algebraValidation).toEqual([]);
  expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});
  expect(algebraSeed.publicationEligible).toBe(true);
  expect(algebraGraph.edges.every(edge=>edge.enabled&&edge.reviewStatus==='APPROVED'&&edge.canonicalTextbookEvidence.length>0)).toBe(true);
  expect(algebraGraph.edges.filter(edge=>edge.dependencyType==='weak')).toHaveLength(2);
 });
 it('reviews the inequality-to-function-properties bridge without coupling unlock progress',()=>{
  expect(algebraCrossDomainReviews).toHaveLength(1);
  expect(algebraCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-INEQUALITY-PROPERTIES-001',targetNodeId:'HS-FUNC-MONO-001',sourceDomainId:'algebra',targetDomainId:'functions',dependencyType:'weak',reviewStatus:'APPROVED'});
  expect(algebraCrossDomainReviews[0].canonicalTextbookEvidence).toHaveLength(2);
  expect(algebraCrossDomainReviews[0].outcome.publicationEligible).toBe(true);
 });
});
