import {test,expect} from 'vitest';
import {randomUUID} from 'node:crypto';
import {openDatabase} from '../../packages/database/src/connection';
import {setupDatabase} from '../../scripts/setup-db';
import {pilotScenes} from '../../content/ponder/pilots';
import {sceneDigest} from '../../packages/ponder/src/quality';
test('Ponder migration supports versioned progress without touching knowledge progress or relations',async()=>{
 const db=await openDatabase({mode:'pglite',directory:'memory://'});
 try{
  await setupDatabase(db);await setupDatabase(db); // Idempotent migrations.
  const scene=pilotScenes[0],userId=randomUUID();
  await db.query('INSERT INTO users(id,username,password_hash) VALUES($1,$2,$3)',[userId,'ponder_'+userId.slice(0,8),'!disabled-test-account-no-password']);
  await db.query('INSERT INTO user_progress_state(user_id) VALUES($1)',[userId]);
  const before=await db.query('SELECT * FROM user_progress_state WHERE user_id=$1',[userId]),edges=await db.query('SELECT * FROM knowledge_edges ORDER BY id');
  await db.query("INSERT INTO ponder_demos(id,node_id,type,title,suitability,pedagogy_pattern,renderer_type,version,dsl_version) VALUES($1,$2,'PRINCIPLE',$3,'HIGH',$4,$5,1,1)",[scene.id,scene.nodeId,scene.title,scene.pedagogy.primary,scene.renderer]);
  await db.query('INSERT INTO ponder_scenes(id,demo_id,definition_json,duration_estimate,scene_digest) VALUES($1,$1,$2,$3,$4)',[scene.id,JSON.stringify(scene),scene.duration,sceneDigest(scene)]);
  await db.query('INSERT INTO user_ponder_progress(user_id,node_id,demo_id,demo_version,last_step,principle_viewed,completed_at,interaction_used) VALUES($1,$2,$3,1,4,true,now(),true)',[userId,scene.nodeId,scene.id]);
  expect((await db.query('SELECT * FROM user_progress_state WHERE user_id=$1',[userId])).rows).toEqual(before.rows);
  expect((await db.query('SELECT * FROM knowledge_edges ORDER BY id')).rows).toEqual(edges.rows);
  expect((await db.query('SELECT * FROM user_unlocked_nodes WHERE user_id=$1',[userId])).rows).toEqual([]);
  await expect(db.query('INSERT INTO user_ponder_progress(user_id,node_id,demo_id,demo_version,principle_viewed) VALUES($1,$2,$3,2,true)',[userId,scene.nodeId,scene.id])).rejects.toThrow();
  await db.query('INSERT INTO user_ponder_progress(user_id,node_id,demo_id,demo_version) VALUES($1,$2,$3,2)',[userId,scene.nodeId,scene.id]);
  expect((await db.query('SELECT * FROM user_ponder_progress WHERE user_id=$1',[userId])).rows).toHaveLength(2);
 }finally{await db.close();}
});
