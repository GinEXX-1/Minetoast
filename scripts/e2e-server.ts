import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase} from '../packages/database/src/connection';
import {setupDatabase} from './setup-db';
import {makeApp} from '../apps/api/src/app';

// An isolated, disposable database: never use the developer's saved progress.
const directory=await mkdtemp(join(tmpdir(),'kw-e2e-'));
const db=await openDatabase({mode:'pglite',directory});
await setupDatabase(db);
const app=await makeApp(db,{serveStatic:true,origin:'http://127.0.0.1:4187',rateLimit:false});
await app.listen({host:'127.0.0.1',port:4187});
let closing=false;
async function close(){if(closing)return;closing=true;await app.close();await db.close();await rm(directory,{recursive:true});}
for(const signal of ['SIGTERM','SIGINT'] as const)process.once(signal,()=>{void close();});
