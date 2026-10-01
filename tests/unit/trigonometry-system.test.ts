import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {trigonometryCrossDomainReviews,trigonometryGraph,trigonometrySeed,trigonometrySystem,trigonometryValidation} from '../../content/fixtures/trigonometry-system';

describe('PEP-A trigonometry curriculum system',()=>{
 it('has unique, textbook-located concepts distinct from the 32-node function slice',()=>{
  expect(trigonometrySystem.concepts).toHaveLength(28);
  expect(new Set(trigonometrySystem.concepts.map(n=>n.id)).size).toBe(28);
  expect(new Set(trigonometrySystem.concepts.map(n=>n.canonicalName)).size).toBe(28);
  expect(trigonometrySystem.concepts.every(n=>n.domainId==='trigonometry'&&n.sources.length>0)).toBe(true);
  for(const node of trigonometrySystem.concepts)for(const source of node.sources){
   expect(source.sourceRef).toMatch(/^PEP-A:B1:C5:S5\.[1-7]$/);
   expect(source.pdfPage).toBe(source.printedPage+7);
   expect(source.evidence.evidenceStatus).toBe('DIRECT');
  }
 });
 it('passes cycle, duplicate, prerequisite-root, reduction, orphan, overconnection and cross-domain review gates',()=>{
  const report=analyzeStrongGraph(trigonometryGraph);
  expect(trigonometryValidation).toEqual([]);
  expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});
  expect(trigonometrySeed.publicationEligible).toBe(true);
  expect(trigonometryGraph.edges.every(edge=>edge.enabled&&edge.reviewStatus==='APPROVED'&&edge.canonicalTextbookEvidence.length>0)).toBe(true);
  expect(trigonometryGraph.edges.filter(edge=>edge.dependencyType==='weak').length).toBe(2);
  expect(trigonometryCrossDomainReviews).toHaveLength(1);
  expect(trigonometryCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-FUNC-CONCEPT-001',targetNodeId:'HS-TRIG-SINCOS-001',dependencyType:'weak',reviewStatus:'APPROVED'});
  expect(trigonometryCrossDomainReviews[0].outcome.publicationEligible).toBe(true);
 });
});
