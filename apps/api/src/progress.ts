import {createHash} from 'node:crypto';
import {z} from 'zod';
import type {Database,Sql} from '../../../packages/database/src/connection';
import type {Graph} from '../../../packages/graph-core/src/index';
import {statusOf,strongAncestors} from '../../../packages/graph-core/src/index';
export class ApiError extends Error {constructor(public statusCode:number,public code:string,message:string){super(message);}}
const command=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('unlock'),nodeId:z.string().max(80)}).strict(),
 z.object({kind:z.literal('revoke'),nodeId:z.string().max(80)}).strict(),
 z.object({kind:z.literal('initialize'),targetNodeIds:z.array(z.string().max(80)).min(1).max(25)}).strict(),
 z.object({kind:z.literal('finish_initialization')}).strict()
]);
export const envelopeSchema=z.object({idempotencyKey:z.uuid(),graphReleaseId:z.uuid(),expectedRevision:z.number().int().min(0),command}).strict();
export type Envelope=z.infer<typeof envelopeSchema>;
export async function getProgress(tx:Sql,userId:string){
 const state=(await tx.query<{revision:string;initialization_completed_at:Date|null;updated_at:Date}>('SELECT * FROM user_progress_state WHERE user_id=$1',[userId])).rows[0];
 const rows=(await tx.query<{node_id:string;source:string;unlocked_at:Date}>('SELECT node_id,source,unlocked_at FROM user_unlocked_nodes WHERE user_id=$1 ORDER BY node_id',[userId])).rows;
 const head=(await tx.query<{release_id:string}>('SELECT release_id FROM graph_head')).rows[0];
 return {graphReleaseId:head.release_id,revision:Number(state.revision),initializationCompletedAt:state.initialization_completed_at,updatedAt:state.updated_at,unlocked:rows.map(n=>({nodeId:n.node_id,source:n.source,unlockedAt:n.unlocked_at}))};
}
export async function applyCommand(db:Database,userId:string,input:Envelope){
 return db.transaction(async tx=>{
  const head=(await tx.query<{release_id:string}>('SELECT release_id FROM graph_head FOR SHARE')).rows[0];
  const state=(await tx.query<{revision:string;initialization_completed_at:Date|null}>('SELECT revision,initialization_completed_at FROM user_progress_state WHERE user_id=$1 FOR UPDATE',[userId])).rows[0];
  const requestHash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
  const previous=(await tx.query<{request_hash:string;result:any}>('SELECT request_hash,result FROM progress_commands WHERE user_id=$1 AND idempotency_key=$2',[userId,input.idempotencyKey])).rows[0];
  if(previous){if(previous.request_hash!==requestHash)throw new ApiError(409,'IDEMPOTENCY_CONFLICT','同一请求标识对应了不同操作。');return previous.result;}
  if(head.release_id!==input.graphReleaseId||Number(state.revision)!==input.expectedRevision)throw new ApiError(409,'STALE_PROGRESS','进度或图谱已更新，请重试。');
  const graph=(await tx.query<{snapshot:Graph}>('SELECT snapshot FROM graph_releases WHERE id=$1',[head.release_id])).rows[0].snapshot;
  const current=(await tx.query<{node_id:string}>('SELECT node_id FROM user_unlocked_nodes WHERE user_id=$1',[userId])).rows;
  const unlocked=new Set(current.map(n=>n.node_id)),ids=new Set(graph.nodes.map(n=>n.id));
  const c=input.command;let add:string[]=[],remove:string[]=[],finished=false;
  if(c.kind==='unlock'||c.kind==='revoke'){
   if(!ids.has(c.nodeId))throw new ApiError(422,'UNKNOWN_NODE','节点不存在。');
   if(c.kind==='unlock'){
    if(statusOf(graph,unlocked,c.nodeId)==='locked')throw new ApiError(422,'PREREQUISITES_MISSING','请先掌握所有强前置知识。');
    if(!unlocked.has(c.nodeId))add=[c.nodeId];
   }else if(unlocked.has(c.nodeId))remove=[c.nodeId];
  }else if(c.kind==='initialize'){
   if(state.initialization_completed_at)throw new ApiError(422,'INITIALIZATION_FINISHED','初始化已完成，请正常解锁节点。');
   if(c.targetNodeIds.some(id=>!ids.has(id)))throw new ApiError(422,'UNKNOWN_NODE','节点不存在。');
   add=[...strongAncestors(graph,c.targetNodeIds)].filter(id=>!unlocked.has(id));
  }else finished=!state.initialization_completed_at;
  for(const nodeId of add){
   const source=c.kind==='initialize'?(c.targetNodeIds.includes(nodeId)?'initialization_target':'initialization_ancestor'):'manual';
   await tx.query('INSERT INTO user_unlocked_nodes(user_id,node_id,source,release_id) VALUES($1,$2,$3,$4)',[userId,nodeId,source,head.release_id]);
   await tx.query('INSERT INTO achievement_events(user_id,node_id,idempotency_key,event_type,release_id) VALUES($1,$2,$3,$4,$5)',[userId,nodeId,input.idempotencyKey,source==='manual'?'unlock':source,head.release_id]);
  }
  for(const nodeId of remove){await tx.query('DELETE FROM user_unlocked_nodes WHERE user_id=$1 AND node_id=$2',[userId,nodeId]);await tx.query("INSERT INTO achievement_events(user_id,node_id,idempotency_key,event_type,release_id) VALUES($1,$2,$3,'revoke',$4)",[userId,nodeId,input.idempotencyKey,head.release_id]);}
  if(finished){await tx.query('UPDATE user_progress_state SET initialization_completed_at=now() WHERE user_id=$1',[userId]);await tx.query("INSERT INTO achievement_events(user_id,idempotency_key,event_type,release_id) VALUES($1,$2,'initialization_complete',$3)",[userId,input.idempotencyKey,head.release_id]);}
  if(add.length||remove.length||finished)await tx.query('UPDATE user_progress_state SET revision=revision+1 WHERE user_id=$1',[userId]);
  const result={...(await getProgress(tx,userId)),addedNodeIds:add,removedNodeIds:remove};
  await tx.query('INSERT INTO progress_commands(user_id,idempotency_key,request_hash,release_id,result) VALUES($1,$2,$3,$4,$5)',[userId,input.idempotencyKey,requestHash,head.release_id,JSON.stringify(result)]);
  return result;
 });
}
