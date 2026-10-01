import {describe,it,expect} from 'vitest';
import {evaluateDependencyQuality,type DependencyQualityRecord} from '../../packages/domain/src/dependency-quality';

const base:DependencyQualityRecord={
 canonicalTextbookEvidence:[{sourceRef:'PEP-A:B1:C3:S3.1',printedPage:62,pdfPage:69,evidenceStatus:'DIRECT',summary:'函数定义以集合与唯一对应关系表述。'}],
 canonicalEvidenceConflict:false,
 mathematicalDefinition:'函数以集合、对应关系和唯一性为定义要素。',
 definitionAmbiguous:false,
 prerequisiteCounterfactual:'若未掌握对应关系，就无法判断函数定义中的唯一输出条件。',
 graphContext:'该边不制造环路，且 target 的其他 Strong 前置不重复此能力。',
 rationale:'对应关系是理解函数定义中唯一输出约束的直接概念基础。',
 decision:'KEEP_STRONG',confidence:'HIGH',aiReviews:[]
};

describe('Knowledge Dependency Quality Gate',()=>{
 it('automatically passes a complete HIGH-confidence assessment',()=>{
  expect(evaluateDependencyQuality(base)).toMatchObject({decision:'KEEP_STRONG',confidence:'HIGH',state:'AUTO_PASSED',publicationEligible:true});
 });
 it('requires two independent and matching MEDIUM-confidence AI reviews',()=>{
  const first={reviewId:'00000000-0000-4000-8000-000000000101',reviewerRunId:'run-a',model:'quality-model-a',decision:'KEEP_STRONG' as const,confidence:'MEDIUM' as const,rationale:'定义、反事实和教材证据共同支持该依赖。',reviewedAt:'2026-09-19T00:00:00.000Z'};
  const second={...first,reviewId:'00000000-0000-4000-8000-000000000102',reviewerRunId:'run-b',model:'quality-model-b',reviewedAt:'2026-09-19T00:01:00.000Z'};
  expect(evaluateDependencyQuality({...base,confidence:'MEDIUM',aiReviews:[first]})).toMatchObject({state:'PENDING_SECOND_AI_REVIEW',publicationEligible:false});
  expect(evaluateDependencyQuality({...base,confidence:'MEDIUM',aiReviews:[first,second]})).toMatchObject({state:'AI_REVIEW_2_PASSED',publicationEligible:true});
 });
 it('routes LOW confidence and conflicting AI conclusions to REVIEW_REQUIRED',()=>{
  const first={reviewId:'00000000-0000-4000-8000-000000000103',reviewerRunId:'run-a',model:'quality-model-a',decision:'KEEP_STRONG' as const,confidence:'MEDIUM' as const,rationale:'支持保留。',reviewedAt:'2026-09-19T00:00:00.000Z'};
  const conflicting={...first,reviewId:'00000000-0000-4000-8000-000000000104',reviewerRunId:'run-b',decision:'DOWNGRADE_TO_WEAK' as const};
  expect(evaluateDependencyQuality({...base,confidence:'LOW'})).toMatchObject({decision:'REVIEW_REQUIRED',state:'REVIEW_REQUIRED',publicationEligible:false});
  expect(evaluateDependencyQuality({...base,confidence:'MEDIUM',aiReviews:[first,conflicting]})).toMatchObject({decision:'REVIEW_REQUIRED',state:'REVIEW_REQUIRED',publicationEligible:false});
  expect(evaluateDependencyQuality({...base,canonicalEvidenceConflict:true})).toMatchObject({decision:'REVIEW_REQUIRED',state:'REVIEW_REQUIRED',publicationEligible:false});
  expect(evaluateDependencyQuality({...base,definitionAmbiguous:true})).toMatchObject({decision:'REVIEW_REQUIRED',state:'REVIEW_REQUIRED',publicationEligible:false});
 });
 it('retains a recorded human override without making it the universal gate',()=>{
  expect(evaluateDependencyQuality({...base,confidence:'MEDIUM',humanOverride:{actorId:'curriculum-lead',rationale:'课程组复核后保留该边。',overriddenAt:'2026-09-19T00:02:00.000Z'}})).toMatchObject({decision:'KEEP_STRONG',confidence:'MEDIUM',state:'HUMAN_OVERRIDE',publicationEligible:true});
 });
});
