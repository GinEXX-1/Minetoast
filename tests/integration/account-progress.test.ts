import {describe,it,expect,beforeAll,afterAll} from 'vitest';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {openDatabase,type Database} from '../../packages/database/src/connection';
import {setupDatabase} from '../../scripts/setup-db';
import {makeApp} from '../../apps/api/src/app';
import {nodeSpecs} from '../../content/fixtures/function-slice';
import {readFile} from 'node:fs/promises';
import {applyCommand} from '../../apps/api/src/progress';
const origin='http://localhost:4173';
let db:Database,app:Awaited<ReturnType<typeof makeApp>>,directory:string;
const accounts:{cookie:string;csrf:string;username:string;id:string;password:string}[]=[];
const id=(i:number)=>nodeSpecs[i][0];
async function register(){const username='test_'+randomUUID().slice(0,8),password=randomUUID();const response=await app.inject({method:'POST',url:'/api/v1/auth/register',headers:{origin},payload:{username,password}});expect(response.statusCode).toBe(200);const body=response.json();const account={cookie:response.cookies[0].name+'='+response.cookies[0].value,csrf:body.csrfToken,username,id:body.user.id,password};accounts.push(account);return account;}
async function progress(a=accounts[0]){return (await app.inject({url:'/api/v1/me/progress',headers:{cookie:a.cookie}})).json();}
async function command(c:unknown,a=accounts[0],extra:Record<string,unknown>={}){const p=await progress(a);const payload={command:c,idempotencyKey:randomUUID(),graphReleaseId:p.graphReleaseId,expectedRevision:p.revision,...extra};return {response:await app.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload}),payload};}
describe('account and PostgreSQL-compatible persistent transactions',()=>{
 beforeAll(async()=>{directory=await mkdtemp(join(tmpdir(),'kw-phase1-'));db=await openDatabase(process.env.DATABASE_MODE==='postgres'?{mode:'postgres'}:{mode:'pglite',directory});await setupDatabase(db);app=await makeApp(db,{rateLimit:false});await register();await register();});
 afterAll(async()=>{await app?.close();await db?.close();if(directory)await rm(directory,{recursive:true,force:true});});
 it('executes the Phase 0 migration and exposes exactly 20 test nodes',async()=>{const graph=await app.inject({url:'/api/v1/knowledge/graph'});expect(graph.json().nodes).toHaveLength(20);const version=await db.query<{version:string}>('SELECT version()');console.log('Database engine:',version.rows[0].version.split(' on ')[0]);});
 it('blocks guest progress and CSRF / forged origin',async()=>{expect((await app.inject({url:'/api/v1/me/progress'})).statusCode).toBe(401);const a=accounts[0];expect((await app.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie:a.cookie,origin},payload:{}})).statusCode).toBe(403);expect((await app.inject({method:'POST',url:'/api/v1/auth/login',headers:{origin:'https://attacker.invalid'},payload:{}})).statusCode).toBe(403);});
 it('does not return password hashes and ignores no role injection',async()=>{const me=await app.inject({url:'/api/v1/auth/me',headers:{cookie:accounts[0].cookie}});expect(me.body).not.toContain('password');expect((await app.inject({method:'POST',url:'/api/v1/auth/register',headers:{origin},payload:{username:'admin_injection',password:randomUUID(),role:'admin'}})).statusCode).toBe(422);});
 it('rejects unlocking a locked node with no progress',async()=>{expect((await command({kind:'unlock',nodeId:id(15)})).response.statusCode).toBe(422);expect((await progress()).unlocked).toHaveLength(0);});
 it('initializes strong ancestors atomically, not weak / sibling nodes',async()=>{const {response}=await command({kind:'initialize',targetNodeIds:[id(15)]});expect(response.statusCode).toBe(200);const ids=response.json().unlocked.map((n:any)=>n.nodeId);expect(ids).toContain(id(10));expect(ids).toContain(id(15));expect(ids).not.toContain(id(14));expect(ids).not.toContain(id(7));});
 it('stores progress per account, never globally',async()=>{expect((await progress(accounts[1])).unlocked).toHaveLength(0);expect((await progress()).unlocked.length).toBeGreaterThan(0);});
 it('finishes initialization and rejects later initialization',async()=>{expect((await command({kind:'finish_initialization'})).response.statusCode).toBe(200);expect((await command({kind:'initialize',targetNodeIds:[id(19)]})).response.statusCode).toBe(422);});
 it('revoke only removes target, idempotency returns original response without duplicate events',async()=>{const {response,payload}=await command({kind:'revoke',nodeId:id(10)});expect(response.statusCode).toBe(200);const a=accounts[0];const retry=await app.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload});expect(retry.json()).toEqual(response.json());const p=await progress();expect(p.unlocked.map((n:any)=>n.nodeId)).toContain(id(15));expect(p.unlocked.map((n:any)=>n.nodeId)).not.toContain(id(10));const events=await db.query<{n:string}>('SELECT count(*) AS n FROM achievement_events WHERE user_id=$1 AND idempotency_key=$2',[a.id,payload.idempotencyKey]);expect(Number(events.rows[0].n)).toBe(1);});
 it('rejects stale revisions and changed payload with a used idempotency key',async()=>{expect((await command({kind:'unlock',nodeId:id(10)},accounts[0],{expectedRevision:0})).response.statusCode).toBe(409);const a=accounts[0],result=await command({kind:'unlock',nodeId:id(10)});const retry=await app.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload:{...result.payload,command:{kind:'revoke',nodeId:id(10)}}});expect(retry.statusCode).toBe(409);});
 it('rejects invalid batches without partial changes',async()=>{const before=await progress(accounts[1]);expect((await command({kind:'initialize',targetNodeIds:[id(6),'BAD']},accounts[1])).response.statusCode).toBe(422);expect((await progress(accounts[1])).unlocked).toEqual(before.unlocked);});
 it('serializes simultaneous commands against the same revision',async()=>{const a=accounts[1],p=await progress(a);const send=(nodeId:string)=>app.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload:{idempotencyKey:randomUUID(),graphReleaseId:p.graphReleaseId,expectedRevision:p.revision,command:{kind:'initialize',targetNodeIds:[nodeId]}}});const replies=await Promise.all([send(id(1)),send(id(2))]);expect(replies.map(r=>r.statusCode).sort()).toEqual([200,409]);});
 it('rolls back progress when a transaction fails',async()=>{const before=await progress();await expect(db.transaction(async tx=>{await tx.query('DELETE FROM user_unlocked_nodes WHERE user_id=$1',[accounts[0].id]);throw new Error('simulated failure');})).rejects.toThrow('simulated failure');expect((await progress()).unlocked).toEqual(before.unlocked);});
 it('enforces module/domain foreign key and immutable releases',async()=>{await expect(db.query("UPDATE knowledge_nodes SET module_id='missing-module' WHERE id=$1",[id(0)])).rejects.toThrow();await expect(db.query("UPDATE graph_releases SET content_hash=content_hash")).rejects.toThrow('immutable');});
 it('keeps user progress after app + database close/reopen',async()=>{const before=await progress();await app.close();await db.close();db=await openDatabase(process.env.DATABASE_MODE==='postgres'?{mode:'postgres'}:{mode:'pglite',directory});app=await makeApp(db,{rateLimit:false});expect((await progress()).unlocked).toEqual(before.unlocked);});
 it('keeps progress after logout/login and invalidates old session',async()=>{const a=accounts[0],before=await progress();expect((await app.inject({method:'POST',url:'/api/v1/auth/logout',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload:{}})).statusCode).toBe(200);expect((await app.inject({url:'/api/v1/me/progress',headers:{cookie:a.cookie}})).statusCode).toBe(401);const login=await app.inject({method:'POST',url:'/api/v1/auth/login',headers:{origin},payload:{username:a.username.toUpperCase(),password:a.password}});expect(login.statusCode).toBe(200);a.cookie=login.cookies[0].name+'='+login.cookies[0].value;a.csrf=login.json().csrfToken;expect((await progress()).unlocked).toEqual(before.unlocked);});
 it('merges sparse backups without inventing ancestors or changing initialization',async()=>{
  const a=await register(),p=await progress(a),backup={schemaVersion:1,graphReleaseId:randomUUID(),exportedAt:new Date().toISOString(),unlockedNodeIds:[id(15),id(15)]};
  const preview=await app.inject({method:'POST',url:'/api/v1/me/progress/import/preview',headers:{cookie:a.cookie,origin,'x-csrf-token':a.csrf},payload:backup});
  expect(preview.json()).toMatchObject({valid:true,crossRelease:true,addedNodeIds:[id(15)]});
  const imported=await command({kind:'import',mode:'merge',backup},a);expect(imported.response.statusCode).toBe(200);
  expect((await progress(a)).unlocked.map((n:any)=>n.nodeId)).toEqual([id(15)]);expect((await progress(a)).initializationCompletedAt).toBe(p.initializationCompletedAt);
  expect((await command({kind:'import',mode:'merge',backup:{...backup,unlockedNodeIds:[id(0),'HS-BAD-NODE-999']}},a)).response.statusCode).toBe(422);
  expect((await progress(a)).unlocked).toHaveLength(1);
  const exported=(await app.inject({url:'/api/v1/me/progress/export',headers:{cookie:a.cookie}})).json();expect(exported.unlockedNodeIds).toEqual([id(15)]);expect(exported).not.toHaveProperty('userId');
  expect((await command({kind:'import',mode:'merge',backup:{...backup,role:'admin'}},a)).response.statusCode).toBe(422);
 });
 it('rolls back an actual initialization command after an injected mid-batch event failure',async()=>{
  const a=await register(),p=await progress(a);
  const failing:Database={...db,transaction:fn=>db.transaction(tx=>fn({...tx,query:async(sql,params)=>{if(sql.startsWith('INSERT INTO achievement_events'))throw new Error('injected event failure');return tx.query(sql,params);}}))};
  await expect(applyCommand(failing,a.id,{idempotencyKey:randomUUID(),expectedRevision:p.revision,graphReleaseId:p.graphReleaseId,command:{kind:'initialize',targetNodeIds:[id(15)]}})).rejects.toThrow('injected event failure');
  expect(await progress(a)).toEqual(p);
  expect(Number((await db.query<{n:string}>('SELECT count(*) n FROM achievement_events WHERE user_id=$1',[a.id])).rows[0].n)).toBe(0);
 });
 it('enforces admin boundary, draft optimistic locking, and excludes unresolved dependencies without blocking a candidate release',async()=>{
  const a=accounts[0],headers={cookie:a.cookie,origin,'x-csrf-token':a.csrf};
  expect((await app.inject({url:'/api/v1/admin/draft'})).statusCode).toBe(401);
  expect((await app.inject({url:'/api/v1/admin/draft',headers})).statusCode).toBe(403);
  await db.query("UPDATE users SET role='admin' WHERE id=$1",[a.id]);
  const graph=(await app.inject({url:'/api/v1/knowledge/graph'})).json();
  const draft=(await app.inject({url:'/api/v1/admin/draft',headers})).json(),node=draft.nodes.find((n:any)=>n.id===id(0));
  const edit={kind:'node',id:node.id,expectedVersion:node.version,patch:{descriptionShort:'测试隔离草稿：未发布'}};
  expect((await app.inject({method:'POST',url:'/api/v1/admin/edit',headers,payload:edit})).statusCode).toBe(200);
  expect((await app.inject({method:'POST',url:'/api/v1/admin/edit',headers,payload:edit})).statusCode).toBe(409);
  expect((await app.inject({url:'/api/v1/knowledge/graph'})).json()).toEqual(graph);
  const review=await app.inject({method:'POST',url:'/api/v1/admin/review',headers,payload:{kind:'node',id:node.id,expectedVersion:node.version+1,decision:'APPROVED',note:'仅用于自动化测试的人工审核动作模拟，非内容签审。'}});
  expect(review.statusCode).toBe(200);
  const updated=await app.inject({method:'POST',url:'/api/v1/admin/edit',headers,payload:{...edit,expectedVersion:node.version+2}});expect(updated.json()).toMatchObject({reviewStatus:'REVIEW_REQUIRED',reviewedBy:null});
  const publish=await app.inject({method:'POST',url:'/api/v1/admin/publish',headers,payload:{expectedReleaseId:graph.releaseId}});expect(publish.statusCode).toBe(200);
  const candidate=(await app.inject({url:'/api/v1/knowledge/graph'})).json();expect(candidate.releaseId).not.toBe(graph.releaseId);
  expect(candidate.edges.filter((edge:any)=>edge.dependencyType==='strong'&&edge.enabled)).toHaveLength(0);
  expect((await app.inject({url:'/api/v1/admin/audit',headers})).json().length).toBeGreaterThanOrEqual(3);
  await db.query('UPDATE knowledge_nodes SET description_short=$2 WHERE id=$1',[id(0),node.descriptionShort]);
 });
 it('records a complete HIGH-confidence dependency decision without requiring manual approval',async()=>{
  const a=accounts[0],headers={cookie:a.cookie,origin,'x-csrf-token':a.csrf};
  const draft=(await app.inject({url:'/api/v1/admin/draft',headers})).json(),edge=draft.edges[0];
  const response=await app.inject({method:'POST',url:'/api/v1/admin/dependency-quality',headers,payload:{id:edge.id,expectedVersion:edge.version,mode:'ai_review',assessment:{canonicalTextbookEvidence:[{sourceRef:'PEP-A:B1:C2:S2.1',printedPage:38,pdfPage:45,evidenceStatus:'DIRECT',summary:'实数与数轴点的对应关系。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'数轴上的点与实数具有一一对应关系。',definitionAmbiguous:false,prerequisiteCounterfactual:'缺少实数概念会阻碍以实数标记数轴点。',graphContext:'该边不形成环，也不与已有直接 Strong 前置重复。',qualityRationale:'实数对应数轴点是目标能力的必要表达基础。',decision:'KEEP_STRONG',confidence:'HIGH',aiReviews:[]}}});
  expect(response.statusCode,response.body).toBe(200);expect(response.json()).toMatchObject({qualityDecision:'KEEP_STRONG',qualityConfidence:'HIGH',qualityState:'AUTO_PASSED',dependencyType:'strong',enabled:true});
 });
 it('publishes an isolated quality-gated snapshot, preserves old reads and rejects stale progress release',async()=>{
  const a=accounts[0],headers={cookie:a.cookie,origin,'x-csrf-token':a.csrf};
  const old=(await app.inject({url:'/api/v1/knowledge/graph'})).json();
  // Test DB only: retain legacy audit metadata; publication selection uses the quality gate.
  await db.query("UPDATE knowledge_nodes SET review_status='APPROVED',reviewed_by=$1,reviewed_at=now()",[a.id]);
  await db.query("UPDATE knowledge_edges SET review_status='APPROVED',reviewed_by=$1,reviewed_at=now()",[a.id]);
  const result=await app.inject({method:'POST',url:'/api/v1/admin/publish',headers,payload:{expectedReleaseId:old.releaseId}});
  expect(result.statusCode,result.body).toBe(200);const first=result.json().releaseId;
  const historical=(await app.inject({url:'/api/v1/knowledge/releases/'+old.releaseId})).json();
  expect(historical.releaseId).toBe(old.releaseId);expect(historical.nodes[0].contentDetailed.length).toBeGreaterThan(0);expect(old.nodes[0]).not.toHaveProperty('contentDetailed');
  expect((await app.inject({url:`/api/v1/knowledge/nodes/${id(0)}?releaseId=${old.releaseId}`})).json().releaseId).toBe(old.releaseId);
  expect((await command({kind:'revoke',nodeId:id(0)},a,{graphReleaseId:old.releaseId})).response.statusCode).toBe(409);
  const second=await app.inject({method:'POST',url:'/api/v1/admin/publish',headers,payload:{expectedReleaseId:first}});expect(second.statusCode).toBe(200);
  const rollback=await app.inject({method:'POST',url:'/api/v1/admin/rollback',headers,payload:{releaseId:first,expectedReleaseId:second.json().releaseId}});expect(rollback.statusCode).toBe(200);
  expect((await app.inject({url:'/api/v1/knowledge/graph'})).json().releaseId).toBe(first);
  expect((await app.inject({url:'/api/v1/knowledge/map'})).json().landmarks).toHaveLength(1);
 });
 it.skipIf(process.env.TEST_PG_ROLES!=='1')('real PG runtime roles cannot mutate releases, promote users, or perform DDL',async()=>{
  await db.exec(await readFile(new URL('../../packages/database/roles.sql',import.meta.url),'utf8'));
  const denied=["UPDATE graph_head SET release_id=release_id","UPDATE graph_releases SET content_hash=content_hash","UPDATE users SET role='admin'","CREATE TABLE unauthorized_test(id int)","DELETE FROM admin_audit_events","INSERT INTO users(username,password_hash,role) VALUES('bad_role','long-invalid-password-hash','admin')"];
  for(const sql of denied)await expect(db.transaction(async tx=>{await tx.query('SET LOCAL ROLE learning_api');await tx.query(sql);})).rejects.toThrow();
  await db.transaction(async tx=>{await tx.query('SET LOCAL ROLE learning_api');await tx.query('SELECT * FROM graph_head FOR SHARE');});
  await expect(db.transaction(async tx=>{await tx.query('SET LOCAL ROLE content_admin');await tx.query('DELETE FROM graph_releases');})).rejects.toThrow();
  const scoped=(role:'learning_api'|'content_admin'):Database=>{
   const transaction:Database['transaction']=fn=>db.transaction(async tx=>{await tx.query('SET LOCAL ROLE '+role);return fn(tx);});
   return {kind:'postgres',transaction,query:(sql,params)=>transaction(tx=>tx.query(sql,params)),exec:sql=>transaction(tx=>tx.exec(sql)),close:async()=>{}};
  };
  const runtime=await makeApp(scoped('learning_api'),{adminDb:scoped('content_admin'),rateLimit:false});
  try{
   const response=await runtime.inject({method:'POST',url:'/api/v1/auth/register',headers:{origin},payload:{username:'least_'+randomUUID().slice(0,8),password:randomUUID()}});expect(response.statusCode,response.body).toBe(200);
   const cookie=response.cookies[0].name+'='+response.cookies[0].value,csrf=response.json().csrfToken;
   const p=(await runtime.inject({url:'/api/v1/me/progress',headers:{cookie}})).json();
   const unlock=await runtime.inject({method:'POST',url:'/api/v1/me/progress/commands',headers:{cookie,origin,'x-csrf-token':csrf},payload:{idempotencyKey:randomUUID(),graphReleaseId:p.graphReleaseId,expectedRevision:p.revision,command:{kind:'unlock',nodeId:id(0)}}});expect(unlock.statusCode,unlock.body).toBe(200);
   const a=accounts[0];expect((await runtime.inject({url:'/api/v1/admin/draft',headers:{cookie:a.cookie}})).statusCode).toBe(200);
  }finally{await runtime.close();}
  await db.transaction(async tx=>{await tx.query('SET LOCAL ROLE migration_owner');await tx.query('ALTER TABLE knowledge_nodes ADD COLUMN migration_probe boolean');await tx.query('ALTER TABLE knowledge_nodes DROP COLUMN migration_probe');});
 });
});
