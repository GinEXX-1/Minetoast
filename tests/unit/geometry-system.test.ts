import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {geometryCrossDomainReviews,geometryGraph,geometrySeed,geometrySystem,geometryValidation} from '../../content/fixtures/geometry-system';

describe('PEP-A geometry curriculum system',()=>{
 it('has unique concepts with book-specific printed and PDF page offsets',()=>{
  expect(geometrySystem.concepts).toHaveLength(50);expect(new Set(geometrySystem.concepts.map(n=>n.id)).size).toBe(50);expect(new Set(geometrySystem.concepts.map(n=>n.canonicalName)).size).toBe(50);
  for(const node of geometrySystem.concepts)for(const ref of node.sources){expect(ref.evidence.evidenceStatus).toBe('DIRECT');expect(ref.pdfPage).toBe(ref.printedPage+(ref.volume==='B2'?7:5));}
 });
 it('passes strong dependency graph publication checks',()=>{const report=analyzeStrongGraph(geometryGraph);expect(geometryValidation).toEqual([]);expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});expect(geometrySeed.publicationEligible).toBe(true);});
 it('reviews the coordinate-geometry bridge to function graphs as weak',()=>{expect(geometryCrossDomainReviews).toHaveLength(1);expect(geometryCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-GEO-LINE-EQUATION-FORMS-001',targetNodeId:'HS-FUNC-GRAPH-001',dependencyType:'weak',reviewStatus:'APPROVED'});expect(geometryCrossDomainReviews[0].outcome.publicationEligible).toBe(true);});
});
