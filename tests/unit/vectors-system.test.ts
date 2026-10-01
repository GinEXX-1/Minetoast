import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {vectorsCrossDomainReviews,vectorsGraph,vectorsSeed,vectorsSystem,vectorsValidation} from '../../content/fixtures/vectors-system';

describe('PEP-A plane vectors curriculum system',()=>{
 it('has unique concepts with verified chapter locations',()=>{
  expect(vectorsSystem.concepts).toHaveLength(30);
  expect(new Set(vectorsSystem.concepts.map(node=>node.id)).size).toBe(30);
  expect(new Set(vectorsSystem.concepts.map(node=>node.canonicalName)).size).toBe(30);
  expect(vectorsSystem.concepts.every(node=>node.domainId==='vectors'&&node.sources.length>0)).toBe(true);
  for(const node of vectorsSystem.concepts)for(const source of node.sources){expect(source.sourceRef).toMatch(/^PEP-A:B2:C6:S6\.[1-4]$/);expect(source.pdfPage).toBe(source.printedPage+7);}
 });
 it('passes core dependency graph publication checks',()=>{
  const report=analyzeStrongGraph(vectorsGraph);
  expect(vectorsValidation).toEqual([]);expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});
  expect(vectorsSeed.publicationEligible).toBe(true);
 });
 it('keeps the coordinate and function graph relationship weak',()=>{
  expect(vectorsCrossDomainReviews).toHaveLength(1);expect(vectorsCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-VECTOR-COORDINATES-001',targetNodeId:'HS-FUNC-GRAPH-001',dependencyType:'weak',reviewStatus:'APPROVED'});expect(vectorsCrossDomainReviews[0].outcome.publicationEligible).toBe(true);
 });
});
