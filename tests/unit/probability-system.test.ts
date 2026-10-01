import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {probabilityCrossDomainReviews,probabilityGraph,probabilitySeed,probabilitySystem,probabilityValidation} from '../../content/fixtures/probability-system';

describe('PEP-A probability and statistics curriculum system',()=>{
 it('has unique textbook-located concepts across B2 and X3',()=>{
  expect(probabilitySystem.concepts).toHaveLength(69);expect(new Set(probabilitySystem.concepts.map(n=>n.id)).size).toBe(69);expect(new Set(probabilitySystem.concepts.map(n=>n.canonicalName)).size).toBe(69);
  for(const node of probabilitySystem.concepts)for(const source of node.sources){expect(source.evidence.evidenceStatus).toBe('DIRECT');expect(source.pdfPage).toBe(source.printedPage+(source.volume==='B2'?7:5));}
 });
 it('passes strong dependency graph publication checks',()=>{const report=analyzeStrongGraph(probabilityGraph);expect(probabilityValidation).toEqual([]);expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});expect(probabilitySeed.publicationEligible).toBe(true);});
 it('reviews the statistics-model bridge as weak',()=>{expect(probabilityCrossDomainReviews).toHaveLength(1);expect(probabilityCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-STAT-SAMPLE-TO-POP-001',targetNodeId:'HS-FUNC-APPLY-001',dependencyType:'weak',reviewStatus:'APPROVED'});expect(probabilityCrossDomainReviews[0].outcome.publicationEligible).toBe(true);});
});
