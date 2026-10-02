import {createHash} from 'node:crypto';
import {z} from 'zod';
import {sceneSchema,type SceneDefinition} from './schema';
import {validateMathematics} from './validation';
export const reviewTypes=['MATHEMATICAL_CORRECTNESS','PEDAGOGICAL_VALUE','REPRESENTATION_ACCURACY','DSL_VALIDITY','RENDER_VALIDITY','INTERACTION_VALIDITY','PERFORMANCE','ACCESSIBILITY','TEXTBOOK_ALIGNMENT'] as const;
export const reviewSchema=z.object({demoId:z.string(),sceneDigest:z.string().regex(/^[a-f0-9]{64}$/),reviewType:z.enum(reviewTypes),decision:z.enum(['PASS','REVIEW_REQUIRED','FAIL']),confidence:z.enum(['HIGH','MEDIUM','LOW']),issues:z.array(z.string()),reviewer:z.string().min(1),createdAt:z.string().datetime(),evidence:z.string().min(1)}).strict();
export type PonderReview=z.infer<typeof reviewSchema>;
export const independentReviewSchema=z.object({sceneDigest:z.string().regex(/^[a-f0-9]{64}$/),decision:z.enum(['PASS','REVIEW_REQUIRED','FAIL']),confidence:z.enum(['HIGH','MEDIUM','LOW']),reviewer:z.string().min(1).max(200),author:z.string().min(1).max(200),createdAt:z.string().datetime(),evidence:z.string().min(1).max(10000)}).strict();
export type GateEvidence={reviews:unknown[];independentReview?:unknown};
export const sceneDigest=(scene:SceneDefinition)=>createHash('sha256').update(JSON.stringify(sceneSchema.parse(scene))).digest('hex');
export function qualityGate(candidate:unknown,evidence:GateEvidence={reviews:[]}){
 const parsed=sceneSchema.safeParse(candidate);
 if(!parsed.success)return {decision:'FAIL' as const,confidence:'HIGH' as const,issues:parsed.error.issues.map(x=>x.message),digest:null};
 const scene=parsed.data,digest=sceneDigest(scene),math=validateMathematics(scene),issues=[...math];let failed=math.length>0;
 if(!evidence||!Array.isArray(evidence.reviews)||evidence.reviews.length>128)return {decision:'FAIL' as const,confidence:'HIGH' as const,issues:['Malformed gate evidence'],digest};
 const reviews=evidence.reviews.map(r=>reviewSchema.safeParse(r));
 for(const r of reviews)if(!r.success){issues.push('Malformed review evidence');failed=true;}
 const valid=reviews.filter(r=>r.success).map(r=>r.data!);
 for(const type of reviewTypes){const matching=valid.filter(r=>r.demoId===scene.id&&r.sceneDigest===digest&&r.reviewType===type);if(matching.some(r=>r.decision==='FAIL')){failed=true;issues.push(`${type}: FAIL`);}else if(!matching.some(r=>r.decision==='PASS'&&r.confidence==='HIGH'))issues.push(`${type}: verified HIGH confidence evidence required`);}
 const independent=independentReviewSchema.safeParse(evidence.independentReview);
 if(evidence.independentReview!==undefined&&!independent.success){failed=true;issues.push('Malformed independent review evidence');}
 const review=independent.success?independent.data:undefined;
 if(review?.decision==='FAIL'&&review.sceneDigest===digest){failed=true;issues.push('Independent review failed');}
 if(!review||review.sceneDigest!==digest||review.reviewer===review.author||!review.reviewer||!review.author||!review.evidence||review.decision!=='PASS'||review.confidence!=='HIGH')issues.push('Independent review required for this exact scene');
 return {decision:failed?'FAIL' as const:issues.length?'REVIEW_REQUIRED' as const:'PASS' as const,confidence:failed?'HIGH' as const:issues.length?'LOW' as const:'HIGH' as const,issues,digest};
}
export function publishableScene(candidate:unknown,evidence:GateEvidence){const gate=qualityGate(candidate,evidence);if(gate.decision!=='PASS')throw new Error(`Publication blocked: ${gate.decision}`);return sceneSchema.parse(candidate);}
