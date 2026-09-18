import {PGlite} from '@electric-sql/pglite';
import pg from 'pg';
import {mkdir} from 'node:fs/promises';
export interface Sql {query<T=Record<string,unknown>>(sql:string,params?:unknown[]):Promise<{rows:T[]}>;exec(sql:string):Promise<void>;}
export interface Database extends Sql {transaction<T>(fn:(tx:Sql)=>Promise<T>):Promise<T>;close():Promise<void>;kind:'postgres'|'pglite';}
export async function openDatabase(options:{mode?:string;url?:string;directory?:string}={}):Promise<Database>{
 const mode=options.mode??process.env.DATABASE_MODE??'postgres';
 if(mode==='pglite'){
  if(process.env.NODE_ENV==='production')throw new Error('PGlite local adapter is disabled in production');
  const directory=options.directory??process.env.PGLITE_DIR??'.data/knowledge-world';
  if(directory!=='memory://')await mkdir(directory,{recursive:true});
  const db=await PGlite.create(directory);
  const wrap=(q:{query:any;exec:any}):Sql=>({query:(s,p)=>q.query(s,p),exec:async s=>{await q.exec(s);}});
  return {...wrap(db),kind:'pglite',transaction:fn=>db.transaction(tx=>fn(wrap(tx))),close:()=>db.close()};
 }
 if(mode!=='postgres')throw new Error('Unsupported DATABASE_MODE');
 const connectionString=options.url??process.env.DATABASE_URL;
 if(!connectionString)throw new Error('Set DATABASE_URL for PostgreSQL, or use pnpm dev:local for explicit local testing.');
 const pool=new pg.Pool({connectionString,max:8});
 const wrap=(q:pg.Pool|pg.PoolClient):Sql=>({query:async <T>(s:string,p?:unknown[])=>({rows:(await q.query(s,p)).rows as T[]}),exec:async s=>{await q.query(s);}});
 return {...wrap(pool),kind:'postgres',transaction:async fn=>{const client=await pool.connect();try{await client.query('BEGIN');const result=await fn(wrap(client));await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}},close:()=>pool.end()};
}
