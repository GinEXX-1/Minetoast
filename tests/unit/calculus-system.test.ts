import {describe,it,expect} from 'vitest';
import {analyzeStrongGraph} from '../../packages/graph-core/src/analysis';
import {strongAncestors} from '../../packages/graph-core/src/index';
import {emptyWorldProgress,initializeGraphTarget,summarizeInitializationFeedback} from '../../apps/web/src/function-world-model';
import {calculusCrossDomainReviews,calculusGraph,calculusSeed,calculusSystem,calculusValidation} from '../../content/fixtures/calculus-system';

describe('PEP-A derivative curriculum system',()=>{
 it('has unique chapter-located concepts and correct X2 page offset',()=>{
  expect(calculusSystem.concepts).toHaveLength(41);expect(new Set(calculusSystem.concepts.map(n=>n.id)).size).toBe(41);expect(new Set(calculusSystem.concepts.map(n=>n.canonicalName)).size).toBe(41);
  for(const node of calculusSystem.concepts)for(const source of node.sources){expect(source.sourceRef).toMatch(/^PEP-A:X2:C5:S5\.[1-3]$/);expect(source.pdfPage).toBe(source.printedPage+5);expect(source.evidence.evidenceStatus).toBe('DIRECT');}
 });
 it('passes strong prerequisite publication checks',()=>{const report=analyzeStrongGraph(calculusGraph);expect(calculusValidation).toEqual([]);expect(report).toMatchObject({isDag:true,cycleDetected:false,isolatedNodes:[],undeclaredRoots:[],redundantEdgeIds:[],overconnected:[],crossDomainEdges:[],crossDomainReviewRequired:[]});expect(calculusSeed.publicationEligible).toBe(true);});
 it('keeps the derivative-to-function-properties relationship weak',()=>{expect(calculusCrossDomainReviews).toHaveLength(1);expect(calculusCrossDomainReviews[0]).toMatchObject({sourceNodeId:'HS-CALC-MONOTONICITY-CRITERION-001',targetNodeId:'HS-FUNC-MONO-001',dependencyType:'weak',reviewStatus:'APPROVED'});expect(calculusCrossDomainReviews[0].outcome.publicationEligible).toBe(true);});
 it('batch-unlocks the real advanced synthesis node and bounds its feedback',()=>{
  const target='HS-CALC-FUNCTION-ANALYSIS-001',closure=strongAncestors(calculusGraph,[target]);
  expect(closure.size-1).toBeGreaterThanOrEqual(20);
  const result=initializeGraphTarget(calculusGraph,emptyWorldProgress(),target);
  expect(new Set(result.next.unlockedNodeIds)).toEqual(closure);
  expect(result.addedAncestorIds).toHaveLength(closure.size-1);
  const feedback=summarizeInitializationFeedback(result.addedTargetId,result.addedAncestorIds);
  expect(feedback.toastText).toBe(`已自动点亮 ${closure.size} 个知识节点`);
  expect(feedback.ancestorPulseIds).toHaveLength(8);
 });
});
