import {readFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {openDatabase,type Database} from '../packages/database/src/connection';
import {fixture} from '../content/fixtures/function-slice';
import {validateGraph} from '../packages/graph-core/src/index';
export async function setupDatabase(db:Database){
 const exists=await db.query<{name:string|null}>("SELECT to_regclass('public.users')::text AS name");
 if(!exists.rows[0].name){await db.exec(await readFile(new URL('../packages/database/migrations/0001_phase0.sql',import.meta.url),'utf8'));}
 await db.exec(await readFile(new URL('../packages/database/migrations/0002_authoring.sql',import.meta.url),'utf8'));
 await db.exec(await readFile(new URL('../packages/database/migrations/0003_dependency_quality_gate.sql',import.meta.url),'utf8'));
 const errors=validateGraph(fixture);if(errors.length)throw new Error('Fixture structural errors: '+errors.join(','));
 await db.transaction(async tx=>{
  await tx.query('SELECT pg_advisory_xact_lock(7351001)');
  const head=await tx.query('SELECT release_id FROM graph_head');if(head.rows.length)return;
  if(process.env.NODE_ENV==='production')throw new Error('Production cannot seed the unreviewed test fixture. Restore a reviewed release using the deployment runbook.');
  const actor=randomUUID();
  // Disabled technical fixture actor. No password or administrator login is created.
  await tx.query('INSERT INTO users(id,username,password_hash,role,disabled_at) VALUES($1,$2,$3,$4,now())',[actor,'fixture_system','!disabled-fixture-no-password-000000000000','admin']);
  await tx.query("INSERT INTO math_domains(id,name_zh,name_en) VALUES('functions','函数测试领域','Functions Test Slice')");
  await tx.query("INSERT INTO math_modules(id,domain_id,name_zh) VALUES('foundation','functions','初中前置'),('function-core','functions','函数基础')");
  for(const n of fixture.nodes)await tx.query(`INSERT INTO knowledge_nodes(id,name_zh,achievement_name,description_short,content_detailed,domain_id,module_id,stage,tags,node_type,difficulty,gaokao_importance,formulas,is_root,root_rationale,key_achievement_rationale,review_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'REVIEW_REQUIRED')`,[n.id,n.nameZh,n.achievementName,n.descriptionShort,n.contentDetailed,n.domainId,n.moduleId,n.stage,n.tags,n.nodeType,n.difficulty,n.gaokaoImportance,JSON.stringify(n.formulas),n.isRoot,n.rootRationale??null,n.keyAchievementRationale??null]);
  for(const e of fixture.edges)await tx.query('INSERT INTO knowledge_edges(id,source_node_id,target_node_id,dependency_type,rationale,review_status) VALUES($1,$2,$3,$4,$5,$6)',[e.id,e.sourceNodeId,e.targetNodeId,e.dependencyType,e.rationale,e.reviewStatus]);
  for(const n of fixture.nodes)await tx.query('UPDATE knowledge_nodes SET textbook_references=$2,name_pinyin=$3,pinyin_initials=$4,student_aliases=$5,math_notation_aliases=$6,common_question_types=$7,common_mistakes=$8 WHERE id=$1',[n.id,JSON.stringify(n.textbookReferences),n.namePinyin,n.pinyinInitials,n.studentAliases,n.mathNotationAliases,n.commonQuestionTypes,n.commonMistakes]);
  for(const r of fixture.regions)await tx.query('INSERT INTO map_regions(id,domain_id,name_zh,level,geometry) VALUES($1,$2,$3,$4,$5)',[r.id,r.domainId,r.nameZh,r.level,JSON.stringify(r.geometry)]);
  for(const l of fixture.landmarks)await tx.query('INSERT INTO map_landmarks(id,region_id,node_id,x,y) VALUES($1,$2,$3,$4,$5)',[l.id,l.regionId,l.nodeId,l.x,l.y]);
  const release=randomUUID(),hash=createHash('sha256').update(JSON.stringify(fixture)).digest('hex');
  await tx.query('INSERT INTO graph_releases(id,content_hash,snapshot,validation_report,published_by) VALUES($1,$2,$3,$4,$5)',[release,hash,JSON.stringify({...fixture,releaseId:release,contentHash:hash}),JSON.stringify({mode:'test_fixture_only',structuralErrors:[],academicReview:'REVIEW_REQUIRED'}),actor]);
  await tx.query('INSERT INTO graph_head(release_id) VALUES($1)',[release]);
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const db=await openDatabase();try{await setupDatabase(db);console.log('Schema and 20-node test fixture ready ('+db.kind+').');}finally{await db.close();}}
