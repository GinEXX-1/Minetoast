import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase} from '../packages/database/src/connection';
import {setupDatabase} from './setup-db';
import {makeApp} from '../apps/api/src/app';
import {hash} from '@node-rs/argon2';

// An isolated, disposable database: never use the developer's saved progress.
const directory=await mkdtemp(join(tmpdir(),'kw-e2e-'));
const db=await openDatabase({mode:'pglite',directory});
await setupDatabase(db);
// Known credentials exist only in this disposable test DB, never dev/production.
await db.transaction(async tx=>{const user=(await tx.query<{id:string}>("INSERT INTO users(username,password_hash,role) VALUES('e2e_admin',$1,'admin') RETURNING id",[await hash('isolated-e2e-admin-password')])).rows[0];await tx.query('INSERT INTO user_progress_state(user_id) VALUES($1)',[user.id]);});
const app=await makeApp(db,{serveStatic:true,origin:'http://127.0.0.1:4187',rateLimit:false});
await app.listen({host:'127.0.0.1',port:4187});
let closing=false;
async function close(){if(closing)return;closing=true;await app.close();await db.close();await rm(directory,{recursive:true});}
for(const signal of ['SIGTERM','SIGINT'] as const)process.once(signal,()=>{void close();});
