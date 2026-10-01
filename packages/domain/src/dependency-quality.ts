/**
 * Dependency quality is deliberately separate from graph structure validation.
 * It decides whether a proposed pedagogical relation may be emitted as an
 * effective Strong/Weak edge; it never infers that relation from topology.
 */
export type DependencyQualityDecision =
  | 'KEEP_STRONG'
  | 'DOWNGRADE_TO_WEAK'
  | 'REMOVE'
  | 'REVIEW_REQUIRED';
export type DependencyConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type DependencyQualityState =
  | 'AUTO_PASSED'
  | 'PENDING_SECOND_AI_REVIEW'
  | 'AI_REVIEW_2_PASSED'
  | 'HUMAN_OVERRIDE'
  | 'REVIEW_REQUIRED';

export interface CanonicalTextbookEvidence {
  sourceRef: string;
  printedPage?: number;
  pdfPage?: number;
  evidenceStatus: 'DIRECT' | 'PARTIAL_CONTEXTUAL' | 'NO_LOCATED_EVIDENCE' | 'REVIEW_REQUIRED';
  summary: string;
}

export interface DependencyAIReview {
  reviewId: string;
  reviewerRunId: string;
  model: string;
  decision: DependencyQualityDecision;
  confidence: DependencyConfidence;
  rationale: string;
  reviewedAt: string;
}

export interface DependencyQualityRecord {
  canonicalTextbookEvidence: readonly CanonicalTextbookEvidence[];
  canonicalEvidenceConflict: boolean;
  mathematicalDefinition: string;
  definitionAmbiguous: boolean;
  prerequisiteCounterfactual: string;
  graphContext: string;
  rationale: string;
  decision: DependencyQualityDecision;
  confidence: DependencyConfidence;
  aiReviews: readonly DependencyAIReview[];
  humanOverride?: { actorId: string; rationale: string; overriddenAt: string };
}

export interface DependencyQualityOutcome {
  decision: DependencyQualityDecision;
  confidence: DependencyConfidence;
  state: DependencyQualityState;
  publicationEligible: boolean;
  reasons: readonly string[];
}

const nonEmpty=(value:string)=>value.trim().length>0;
const validEvidence=(e:CanonicalTextbookEvidence)=>
  nonEmpty(e.sourceRef) && nonEmpty(e.summary) &&
  (e.printedPage === undefined || Number.isInteger(e.printedPage)) &&
  (e.pdfPage === undefined || Number.isInteger(e.pdfPage));

/** Pure policy evaluator. Callers persist the result and map its decision to edge type. */
export function evaluateDependencyQuality(record:DependencyQualityRecord):DependencyQualityOutcome {
  const reasons:string[]=[];
  if(!record.canonicalTextbookEvidence.length || !record.canonicalTextbookEvidence.every(validEvidence)) reasons.push('CANONICAL_TEXTBOOK_EVIDENCE_REQUIRED');
  if(record.canonicalEvidenceConflict) reasons.push('CANONICAL_TEXTBOOK_EVIDENCE_CONFLICT');
  if(!nonEmpty(record.mathematicalDefinition)) reasons.push('MATHEMATICAL_DEFINITION_REQUIRED');
  if(record.definitionAmbiguous) reasons.push('MATHEMATICAL_DEFINITION_AMBIGUOUS');
  if(!nonEmpty(record.prerequisiteCounterfactual)) reasons.push('COUNTERFACTUAL_REQUIRED');
  if(!nonEmpty(record.graphContext)) reasons.push('GRAPH_CONTEXT_REQUIRED');
  if(!nonEmpty(record.rationale)) reasons.push('DEPENDENCY_RATIONALE_REQUIRED');
  const reviewIds=new Set<string>(), runIds=new Set<string>();
  for(const review of record.aiReviews){
    if(!nonEmpty(review.reviewId)||!nonEmpty(review.reviewerRunId)||!nonEmpty(review.model)||!nonEmpty(review.rationale)||!nonEmpty(review.reviewedAt)) reasons.push('AI_REVIEW_INVALID');
    if(reviewIds.has(review.reviewId)||runIds.has(review.reviewerRunId)) reasons.push('AI_REVIEW_NOT_INDEPENDENT');
    reviewIds.add(review.reviewId);runIds.add(review.reviewerRunId);
  }
  if(record.decision==='REVIEW_REQUIRED') return {decision:record.decision,confidence:record.confidence,state:'REVIEW_REQUIRED',publicationEligible:false,reasons:[...reasons,'DECISION_REVIEW_REQUIRED']};
  if(record.confidence==='LOW'||record.aiReviews.some(review=>review.confidence==='LOW')) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons:[...reasons,'LOW_CONFIDENCE']};
  if(reasons.length) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons};
  // A HIGH label must never bypass a conflicting independent decision.
  if(record.aiReviews.some(review=>review.decision!==record.decision)) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons:['AI_REVIEW_CONFLICT']};
  if(record.humanOverride){
    if(!nonEmpty(record.humanOverride.actorId)||!nonEmpty(record.humanOverride.rationale)||!nonEmpty(record.humanOverride.overriddenAt)) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons:['HUMAN_OVERRIDE_INVALID']};
    return {decision:record.decision,confidence:record.confidence,state:'HUMAN_OVERRIDE',publicationEligible:true,reasons:['HUMAN_OVERRIDE_RECORDED']};
  }
  if(record.confidence==='HIGH') return {decision:record.decision,confidence:'HIGH',state:'AUTO_PASSED',publicationEligible:true,reasons:['HIGH_CONFIDENCE_AUTO_PASSED']};
  const reviews=record.aiReviews;
  if(reviews.length<2) return {decision:record.decision,confidence:'MEDIUM',state:'PENDING_SECOND_AI_REVIEW',publicationEligible:false,reasons:['SECOND_INDEPENDENT_AI_REVIEW_REQUIRED']};
  const [first,...rest]=reviews;
  if(rest.some(review=>review.decision!==first.decision)) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons:['AI_REVIEW_CONFLICT']};
  // MEDIUM + HIGH agreeing assessments retain the conservative MEDIUM outcome.
  if(first.decision!==record.decision) return {decision:'REVIEW_REQUIRED',confidence:'LOW',state:'REVIEW_REQUIRED',publicationEligible:false,reasons:['AI_REVIEW_RESULT_MISMATCH']};
  return {decision:record.decision,confidence:'MEDIUM',state:'AI_REVIEW_2_PASSED',publicationEligible:true,reasons:['TWO_INDEPENDENT_AI_REVIEWS_AGREE']};
}
