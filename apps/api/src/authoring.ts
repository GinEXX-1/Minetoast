import {randomUUID,createHash} from 'node:crypto';
import type {FastifyInstance,FastifyRequest} from 'fastify';
import {z} from 'zod';
import katex from 'katex';
import type {Database,Sql} from '../../../packages/database/src/connection';
import type {KnowledgeNode} from '../../../packages/domain/src/index';
import {evaluateDependencyQuality,type DependencyQualityRecord} from '../../../packages/domain/src/dependency-quality';
import {validateGraph} from '../../../packages/graph-core/src/index';
import {ApiError} from './progress';
import {nodeIdSchema} from './backup';

const text=z.string().trim().min(1).max(20000), strings=z.array(z.string().max(500)).max(100);
const positivePage=z.number().int().positive();
const reference=z.object({publisher:text,series:text,edition:text,volume:text,chapter:text,section:text,page:z.string().optional(),sourceUrl:z.url().refine(s=>/^https?:/.test(s)).optional(),sourceRef:z.string().trim().min(1).max(200).optional(),printedPage:positivePage.optional(),pdfPage:positivePage.optional(),evidenceStatus:z.enum(['DIRECT','PARTIAL_CONTEXTUAL','NO_LOCATED_EVIDENCE','REVIEW_REQUIRED']).optional()}).strict().refine(r=>(r.printedPage===undefined)===(r.pdfPage===undefined),{message:'printedPage and pdfPage must be provided together'});
const qualityDecision=z.enum(['KEEP_STRONG','DOWNGRADE_TO_WEAK','REMOVE','REVIEW_REQUIRED']);
const qualityConfidence=z.enum(['HIGH','MEDIUM','LOW']);
const canonicalEvidence=z.object({sourceRef:z.string().trim().min(1).max(200),printedPage:positivePage.optional(),pdfPage:positivePage.optional(),evidenceStatus:z.enum(['DIRECT','PARTIAL_CONTEXTUAL','NO_LOCATED_EVIDENCE','REVIEW_REQUIRED']),summary:z.string().trim().min(1).max(4000)}).strict().refine(r=>(r.printedPage===undefined)===(r.pdfPage===undefined),{message:'printedPage and pdfPage must be provided together'});
const aiReview=z.object({reviewId:z.uuid(),reviewerRunId:z.string().trim().min(1).max(200),model:z.string().trim().min(1).max(200),decision:qualityDecision,confidence:qualityConfidence,rationale:z.string().trim().min(10).max(4000),reviewedAt:z.string().datetime()}).strict();
const qualityInput=z.object({canonicalTextbookEvidence:z.array(canonicalEvidence).min(1).max(20),canonicalEvidenceConflict:z.boolean(),mathematicalDefinition:z.string().trim().min(10).max(8000),definitionAmbiguous:z.boolean(),prerequisiteCounterfactual:z.string().trim().min(10).max(8000),graphContext:z.string().trim().min(10).max(8000),qualityRationale:z.string().trim().min(10).max(8000),decision:qualityDecision,confidence:qualityConfidence,aiReviews:z.array(aiReview).max(10)}).strict();
const fields={nameZh:text,achievementName:text,nameEn:z.string().max(200),descriptionShort:text,contentDetailed:text,domainId:text,moduleId:text,
 stage:z.enum(['middle_school','high_school']),tags:strings,nodeType:z.enum(['normal','core','key_achievement']),difficulty:z.number().int().min(1).max(5),gaokaoImportance:z.number().int().min(1).max(5),
 textbookReferences:z.array(reference).max(20),formulas:z.array(z.object({id:text,latex:text,explanation:text,conditions:text}).strict()).max(30),
 skillsRequired:strings,commonQuestionTypes:strings,commonMistakes:strings,namePinyin:z.string().max(200),pinyinInitials:z.string().max(100),aliases:strings,studentAliases:strings,mathNotationAliases:strings,
 isRoot:z.boolean(),rootRationale:z.string().max(2000).nullable(),maxStrongPrerequisites:z.union([z.literal(3),z.literal(5)]),prerequisiteExceptionRationale:z.string().max(2000).nullable(),keyAchievementRationale:z.string().max(2000).nullable(),retired:z.boolean()};
const nodePatch=z.object(fields).partial().strict().refine(x=>Object.keys(x).length>0);
const edgeFields={sourceNodeId:nodeIdSchema,targetNodeId:nodeIdSchema,dependencyType:z.enum(['strong','weak']),rationale:text,enabled:z.boolean()};
const edgePatch=z.object(edgeFields).partial().strict().refine(x=>Object.keys(x).length>0);
const kind=z.enum(['node','edge']);
const snake=(s:string)=>s.replace(/[A-Z]/g,c=>'_'+c.toLowerCase());
const camel=(row:Record<string,any>):any=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k.replace(/_([a-z])/g,(_,c:string)=>c.toUpperCase()),v instanceof Date?v.toISOString():v]));
const qualityRecord=(edge:any):DependencyQualityRecord=>({canonicalTextbookEvidence:edge.canonicalTextbookEvidence??[],canonicalEvidenceConflict:edge.canonicalEvidenceConflict??false,mathematicalDefinition:edge.mathematicalDefinition??'',definitionAmbiguous:edge.definitionAmbiguous??false,prerequisiteCounterfactual:edge.prerequisiteCounterfactual??'',graphContext:edge.graphContext??'',rationale:edge.qualityRationale??'',decision:edge.qualityDecision??'REVIEW_REQUIRED',confidence:edge.qualityConfidence??'LOW',aiReviews:edge.aiReviews??[],humanOverride:edge.qualityOverrideBy?{actorId:edge.qualityOverrideBy,rationale:edge.qualityRationale??'',overriddenAt:edge.qualityOverrideAt??''}:undefined});
function effectiveEdge(edge:any){
 const outcome=evaluateDependencyQuality(qualityRecord(edge));
 if(!outcome.publicationEligible||outcome.decision==='REMOVE'||outcome.decision==='REVIEW_REQUIRED')return {...edge,enabled:false,qualityState:outcome.state,qualityDecision:outcome.decision,qualityConfidence:outcome.confidence};
 return {...edge,enabled:true,dependencyType:outcome.decision==='KEEP_STRONG'?'strong':'weak',qualityState:outcome.state,qualityDecision:outcome.decision,qualityConfidence:outcome.confidence};
}
function materializeReleaseDraft(draft:Awaited<ReturnType<typeof readDraft>>){return {...draft,edges:draft.edges.map(effectiveEdge)};}
export async function readDraft(tx:Sql){
 const load=async(table:string)=>(await tx.query(`SELECT * FROM ${table} ORDER BY id`)).rows.map(camel);
 const loaded:any[][]=[];
 // A transaction owns one pg client: do not enqueue concurrent queries on it.
 for(const table of ['knowledge_nodes','knowledge_edges','math_domains','math_modules','map_regions','map_landmarks','assets'])loaded.push(await load(table));
 const [nodes,edges,domains,modules,regions,landmarks,assets]=loaded;
 const layouts=(await tx.query('SELECT * FROM node_layouts ORDER BY node_id')).rows.map(camel);
 return {schemaVersion:1 as const,nodes:nodes.map(n=>({...n,worldLandmark:landmarks.some(l=>l.nodeId===n.id)})),edges,domains,modules,regions,landmarks,assets,layouts};
}
export function validatePublicationReport(draft:Awaited<ReturnType<typeof readDraft>>){
 const candidate=materializeReleaseDraft(draft), nodes=candidate.nodes.filter(n=>!n.retired), edges=candidate.edges.filter(e=>e.enabled);
 const structural=validateGraph({nodes,edges}), errors=structural.filter(issue=>!issue.startsWith('ORPHAN:')),
  warnings=structural.filter(issue=>issue.startsWith('ORPHAN:'));
 if(!nodes.length)errors.push('EMPTY_GRAPH');
 const ids=new Map(nodes.map(n=>[n.id,n]));
 for(const n of nodes){
  if(n.reviewStatus==='REJECTED')errors.push('NODE_REJECTED:'+n.id);
  if(!n.contentDetailed?.trim()||!n.descriptionShort?.trim()||!n.textbookReferences.length)errors.push('CONTENT_INVALID:'+n.id);
  if(!draft.modules.some(m=>m.id===n.moduleId&&m.domainId===n.domainId))errors.push('MODULE_INVALID:'+n.id);
  for(const r of n.textbookReferences)if(!reference.safeParse(r).success)errors.push('TEXTBOOK_INVALID:'+n.id);
  for(const f of n.formulas){
   if(!f.conditions?.trim())errors.push('CONDITION_REQUIRED:'+n.id);
   try{katex.renderToString(f.latex,{throwOnError:true,trust:false,strict:'error'});}catch{errors.push('FORMULA_INVALID:'+n.id);}
  }
 }
 for(const edge of draft.edges){const outcome=evaluateDependencyQuality(qualityRecord(edge));if(!outcome.publicationEligible)warnings.push('DEPENDENCY_QUALITY_'+outcome.state+':'+edge.id);}
 for(const region of draft.regions){
  if(!draft.domains.some(d=>d.id===region.domainId))errors.push('REGION_DOMAIN:'+region.id);
  if(region.level===2&&!draft.regions.some(r=>r.id===region.parentRegionId&&r.domainId===region.domainId&&r.level===1))errors.push('REGION_PARENT:'+region.id);
 }
 for(const landmark of draft.landmarks){const n=ids.get(landmark.nodeId);if(!n||n.nodeType!=='key_achievement'||!draft.regions.some(r=>r.id===landmark.regionId&&r.domainId===n.domainId))errors.push('LANDMARK_INVALID:'+landmark.id);}
 for(const l of draft.layouts)if(ids.get(l.nodeId)?.domainId!==l.domainId)errors.push('LAYOUT_DOMAIN:'+l.nodeId);
 for(const a of draft.assets)if(a.reviewStatus!=='APPROVED'||!a.license?.trim()||!a.altText?.trim())errors.push('ASSET_REVIEW:'+a.id);
 return {errors:[...new Set(errors)],warnings:[...new Set(warnings)],candidate};
}
export function validatePublication(draft:Awaited<ReturnType<typeof readDraft>>){return validatePublicationReport(draft).errors;}
async function audit(tx:Sql,actor:string,action:string,type:string,id:string,before:unknown,after:unknown){await tx.query('INSERT INTO admin_audit_events(actor_id,action,entity_type,entity_id,before_value,after_value) VALUES($1,$2,$3,$4,$5,$6)',[actor,action,type,id,JSON.stringify(before),JSON.stringify(after)]);}
type Authenticator=(request:FastifyRequest)=>Promise<{id:string;role:string}>;
export function registerAuthoring(app:FastifyInstance,db:Database,account:Authenticator,writer:Authenticator){
 async function admin(request:FastifyRequest,write=false){const a=await(write?writer:account)(request);if(a.role!=='admin')throw new ApiError(403,'ADMIN_REQUIRED','需要管理员权限。');return a;}
 // A single lock order serializes authoring/publication against progress commands.
 async function mutate<T>(fn:(tx:Sql)=>Promise<T>){return db.transaction(async tx=>{await tx.query('SELECT release_id FROM graph_head FOR UPDATE');return fn(tx);});}
 app.get('/api/v1/admin/draft',async(req,reply)=>{await admin(req);reply.header('Cache-Control','no-store');return mutate(readDraft);});
 app.get('/api/v1/admin/audit',async(req,reply)=>{await admin(req);reply.header('Cache-Control','no-store');return (await db.query('SELECT * FROM admin_audit_events ORDER BY occurred_at DESC LIMIT 200')).rows;});
 app.get('/api/v1/admin/releases',async req=>{await admin(req);return(await db.query('SELECT id,content_hash,published_at FROM graph_releases ORDER BY published_at DESC')).rows;});
 app.post('/api/v1/admin/assets',async req=>{
  const actor=await admin(req,true),input=z.object({id:z.uuid(),kind:z.enum(['icon','sprite_sheet','background','map','sound','font']),objectKey:z.string().regex(/^[a-zA-Z0-9_./-]+$/).max(250).refine(s=>!s.includes('..')),sha256:z.string().regex(/^[a-f0-9]{64}$/),mimeType:text,byteSize:z.number().int().nonnegative(),version:z.number().int().positive(),width:z.number().int().positive().optional(),height:z.number().int().positive().optional(),provenance:z.object({origin:z.enum(['original','placeholder','licensed','aigc']),source:z.string().max(1000).optional()}).strict(),license:text,altText:text,note:z.string().min(10).max(2000)}).strict().parse(req.body);
  return mutate(async tx=>{await tx.query("INSERT INTO assets(id,kind,object_key,sha256,mime_type,byte_size,version,width,height,provenance,license,alt_text,review_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'APPROVED')",[input.id,input.kind,input.objectKey,input.sha256,input.mimeType,input.byteSize,input.version,input.width??null,input.height??null,JSON.stringify(input.provenance),input.license,input.altText]);await audit(tx,actor.id,'asset_review','asset',input.id,null,input);return {id:input.id};});
 });
 app.post('/api/v1/admin/edit',async req=>{
  const actor=await admin(req,true);const input=z.object({kind,id:text,expectedVersion:z.number().int().min(1),patch:z.unknown()}).strict().parse(req.body);
  const patch=input.kind==='node'?nodePatch.parse(input.patch):edgePatch.parse(input.patch),table=input.kind==='node'?'knowledge_nodes':'knowledge_edges';
  return mutate(async tx=>{
   const before=(await tx.query(`SELECT * FROM ${table} WHERE id=$1 FOR UPDATE`,[input.id])).rows[0];
   if(!before)throw new ApiError(404,'NOT_FOUND','草稿不存在。');
   if(before.version!==input.expectedVersion)throw new ApiError(409,'STALE_DRAFT','草稿已被修改，请重新载入。');
   const entries=Object.entries(patch),params=entries.map(([key,value])=>['formulas','textbookReferences'].includes(key)?JSON.stringify(value):value);
   params.push(input.id);
   const qualityReset=input.kind==='edge'?",enabled=false,canonical_textbook_evidence='[]'::jsonb,canonical_evidence_conflict=false,mathematical_definition='',definition_ambiguous=false,prerequisite_counterfactual='',graph_context='',quality_rationale='',quality_decision='REVIEW_REQUIRED',quality_confidence='LOW',quality_state='REVIEW_REQUIRED',ai_reviews='[]'::jsonb,quality_override_by=NULL,quality_override_at=NULL,quality_updated_at=now()":'';
   const updated=(await tx.query(`UPDATE ${table} SET ${entries.map(([key],i)=>`${snake(key)}=$${i+1}`).join(',')}${qualityReset},review_status='REVIEW_REQUIRED',reviewed_by=NULL,reviewed_at=NULL,version=version+1 WHERE id=$${params.length} RETURNING *`,params)).rows[0];
   await audit(tx,actor.id,'edit',input.kind,input.id,before,updated);return camel(updated);
  });
 });
 app.post('/api/v1/admin/create',async req=>{
  const actor=await admin(req,true),input=z.object({kind,value:z.unknown()}).strict().parse(req.body);
  const parsed=input.kind==='node'?z.object({id:nodeIdSchema,...fields}).strict().parse(input.value):z.object({id:z.uuid(),...edgeFields}).strict().parse(input.value);
  const value=input.kind==='edge'?{...parsed,enabled:false}:parsed;
  return mutate(async tx=>{
   const entries=Object.entries(value),params=entries.map(([key,v])=>['formulas','textbookReferences'].includes(key)?JSON.stringify(v):v),table=input.kind==='node'?'knowledge_nodes':'knowledge_edges';
   const row=(await tx.query(`INSERT INTO ${table}(${entries.map(([k])=>snake(k)).join(',')}) VALUES(${params.map((_,i)=>'$'+(i+1)).join(',')}) RETURNING *`,params)).rows[0];
   await audit(tx,actor.id,'create',input.kind,value.id,null,row);return camel(row);
 });
 });
 app.post('/api/v1/admin/dependency-quality',async req=>{
  const actor=await admin(req,true),input=z.object({id:z.uuid(),expectedVersion:z.number().int().min(1),mode:z.enum(['ai_review','human_override']),assessment:qualityInput,humanOverrideNote:z.string().trim().min(10).max(4000).optional()}).strict().parse(req.body);
  return mutate(async tx=>{
   const before=(await tx.query('SELECT * FROM knowledge_edges WHERE id=$1 FOR UPDATE',[input.id])).rows[0];
   if(!before||before.version!==input.expectedVersion)throw new ApiError(409,'STALE_DRAFT','请重新载入当前草稿。');
   const prior=camel(before),reviews=input.mode==='ai_review'?[...(prior.aiReviews??[]),...input.assessment.aiReviews]:input.assessment.aiReviews;
   const record:DependencyQualityRecord={canonicalTextbookEvidence:input.assessment.canonicalTextbookEvidence,canonicalEvidenceConflict:input.assessment.canonicalEvidenceConflict,mathematicalDefinition:input.assessment.mathematicalDefinition,definitionAmbiguous:input.assessment.definitionAmbiguous,prerequisiteCounterfactual:input.assessment.prerequisiteCounterfactual,graphContext:input.assessment.graphContext,rationale:input.assessment.qualityRationale,decision:input.assessment.decision,confidence:input.assessment.confidence,aiReviews:reviews,humanOverride:input.mode==='human_override'?{actorId:actor.id,rationale:input.humanOverrideNote!,overriddenAt:new Date().toISOString()}:undefined};
   const outcome=evaluateDependencyQuality(record),enabled=outcome.publicationEligible&&outcome.decision!=='REMOVE',type=outcome.decision==='DOWNGRADE_TO_WEAK'?'weak':'strong';
   const row=(await tx.query(`UPDATE knowledge_edges SET canonical_textbook_evidence=$1,canonical_evidence_conflict=$2,mathematical_definition=$3,definition_ambiguous=$4,prerequisite_counterfactual=$5,graph_context=$6,quality_rationale=$7,quality_decision=$8,quality_confidence=$9,quality_state=$10,ai_reviews=$11,quality_override_by=$12,quality_override_at=$13,quality_updated_at=now(),dependency_type=$14,enabled=$15,review_status='REVIEW_REQUIRED',reviewed_by=NULL,reviewed_at=NULL,version=version+1 WHERE id=$16 RETURNING *`,[JSON.stringify(record.canonicalTextbookEvidence),record.canonicalEvidenceConflict,record.mathematicalDefinition,record.definitionAmbiguous,record.prerequisiteCounterfactual,record.graphContext,record.rationale,outcome.decision,outcome.confidence,outcome.state,JSON.stringify(record.aiReviews),record.humanOverride?.actorId??null,record.humanOverride?.overriddenAt??null,type,enabled,input.id])).rows[0];
   await audit(tx,actor.id,input.mode==='human_override'?'dependency_quality_override':'dependency_quality_ai_review','edge',input.id,before,{...row,outcome});return camel(row);
  });
 });
 app.post('/api/v1/admin/review',async req=>{
  const actor=await admin(req,true),input=z.object({kind,id:text,expectedVersion:z.number().int().min(1),decision:z.enum(['APPROVED','REJECTED']),note:z.string().trim().min(10).max(2000)}).strict().parse(req.body);
  return mutate(async tx=>{
   const table=input.kind==='node'?'knowledge_nodes':'knowledge_edges';
   const before=(await tx.query(`SELECT * FROM ${table} WHERE id=$1 FOR UPDATE`,[input.id])).rows[0];
   if(!before||before.version!==input.expectedVersion)throw new ApiError(409,'STALE_DRAFT','请重新载入当前草稿。');
   const row=(await tx.query(`UPDATE ${table} SET review_status=$1,reviewed_by=$2,reviewed_at=now(),version=version+1 WHERE id=$3 RETURNING *`,[input.decision,actor.id,input.id])).rows[0];
   await audit(tx,actor.id,'review',input.kind,input.id,before,{...row,note:input.note});return camel(row);
  });
 });
 app.post('/api/v1/admin/validate',async req=>{await admin(req,true);return mutate(async tx=>{const report=validatePublicationReport(await readDraft(tx));return {errors:report.errors,warnings:report.warnings};});});
 app.post('/api/v1/admin/publish',async req=>{
  const actor=await admin(req,true);const input=z.object({expectedReleaseId:z.uuid()}).strict().parse(req.body);
  return mutate(async tx=>{
   const head=(await tx.query<{release_id:string}>('SELECT release_id FROM graph_head')).rows[0];
   if(head.release_id!==input.expectedReleaseId)throw new ApiError(409,'STALE_RELEASE','线上版本已变化，请刷新。');
   const draft=await readDraft(tx),report=validatePublicationReport(draft);
   if(report.errors.length)throw new ApiError(422,'PUBLICATION_BLOCKED',report.errors.join('\n'));
   const releaseId=randomUUID(),releaseDraft=report.candidate,contentHash=createHash('sha256').update(JSON.stringify(releaseDraft)).digest('hex');
   const snapshot={...releaseDraft,releaseId,contentHash,contentMode:'quality-gated',notice:'已通过 Knowledge Dependency Quality Gate 的内容快照；未通过的依赖未作为有效边发布。'};
   await tx.query('INSERT INTO graph_releases(id,content_hash,snapshot,validation_report,published_by) VALUES($1,$2,$3,$4,$5)',[releaseId,contentHash,JSON.stringify(snapshot),JSON.stringify({errors:report.errors,warnings:report.warnings}),actor.id]);
   await tx.query('UPDATE graph_head SET release_id=$1',[releaseId]);
   await audit(tx,actor.id,'publish','release',releaseId,head,snapshot);return {releaseId,contentHash};
  });
 });
 app.post('/api/v1/admin/rollback',async req=>{
  const actor=await admin(req,true),input=z.object({releaseId:z.uuid(),expectedReleaseId:z.uuid()}).strict().parse(req.body);
  return mutate(async tx=>{const head=(await tx.query<{release_id:string}>('SELECT release_id FROM graph_head')).rows[0];if(head.release_id!==input.expectedReleaseId)throw new ApiError(409,'STALE_RELEASE','线上版本已变化。');
   const release=(await tx.query<{snapshot:any}>('SELECT snapshot FROM graph_releases WHERE id=$1',[input.releaseId])).rows[0];
   if(!release||!['reviewed','quality-gated'].includes(release.snapshot.contentMode))throw new ApiError(422,'INVALID_RELEASE','只能回退到通过质量门禁的版本。');
   await tx.query('UPDATE graph_head SET release_id=$1',[input.releaseId]);await audit(tx,actor.id,'rollback','release',input.releaseId,head,input);return {releaseId:input.releaseId};});
 });
 app.post('/api/v1/admin/layout',async req=>{
  const actor=await admin(req,true),input=z.object({nodeId:nodeIdSchema,domainId:text,layoutVersion:text,x:z.number().finite(),y:z.number().finite()}).strict().parse(req.body);
  return mutate(async tx=>{const n=(await tx.query<{domain_id:string}>('SELECT domain_id FROM knowledge_nodes WHERE id=$1',[input.nodeId])).rows[0];if(n?.domain_id!==input.domainId)throw new ApiError(422,'DOMAIN_MISMATCH','布局领域不匹配。');
   await tx.query("INSERT INTO node_layouts(node_id,domain_id,layout_version,x,y,source) VALUES($1,$2,$3,$4,$5,'manual') ON CONFLICT(node_id,domain_id,layout_version) DO UPDATE SET x=$4,y=$5,source='manual'",[input.nodeId,input.domainId,input.layoutVersion,input.x,input.y]);await audit(tx,actor.id,'layout','node',input.nodeId,null,input);return input;});
 });
}
export function registerSnapshots(app:FastifyInstance,db:Database){
 async function snapshot(request:FastifyRequest){const {releaseId}=z.object({releaseId:z.uuid().optional()}).parse(request.query);const row=(await db.query<{snapshot:any}>(releaseId?'SELECT snapshot FROM graph_releases WHERE id=$1':'SELECT r.snapshot FROM graph_releases r JOIN graph_head h ON h.release_id=r.id',releaseId?[releaseId]:[])).rows[0];if(!row)throw new ApiError(404,'RELEASE_NOT_FOUND','版本不存在。');return row.snapshot;}
 app.get('/api/v1/knowledge/releases/:id',async req=>{const {id}=z.object({id:z.uuid()}).parse(req.params);const row=(await db.query<{snapshot:any}>('SELECT snapshot FROM graph_releases WHERE id=$1',[id])).rows[0];if(!row)throw new ApiError(404,'NOT_FOUND','版本不存在。');return row.snapshot;});
 app.get('/api/v1/knowledge/nodes/:id',async req=>{const {id}=z.object({id:nodeIdSchema}).parse(req.params);const s=await snapshot(req);const node=s.nodes.find((n:KnowledgeNode)=>n.id===id);if(!node)throw new ApiError(404,'NOT_FOUND','该版本无此节点。');return {releaseId:s.releaseId,node};});
 app.get('/api/v1/knowledge/map',async req=>{const s=await snapshot(req);return {releaseId:s.releaseId,regions:s.regions??[],landmarks:s.landmarks??[]};});
}
