import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {openDatabase} from '../packages/database/src/connection';
import {setupDatabase} from './setup-db';
const bin=process.env.PG_BIN??'/opt/homebrew/opt/postgresql@18/bin';
const directory=await mkdtemp(join(tmpdir(),'kw-pg18-'));
const data=join(directory,'data');let started=false;
function command(name:string,args:string[]){const r=spawnSync(join(bin,name),args,{encoding:'utf8'});if(r.status!==0)throw new Error(`${name}: ${r.stderr??r.error}`);return r.stdout;}
try{
 command('initdb',['-D',data,'-A','trust','--no-locale','-E','UTF8']);
 // A private Unix socket only: no TCP listener, no permanent launch service.
 command('pg_ctl',['-D',data,'-l',join(directory,'postgres.log'),'-o',`-k ${directory} -h '' -p 55439`,'-w','start']);started=true;
 command('createdb',['-h',directory,'-p','55439','knowledge_phase1']);
 const url=`postgresql:///knowledge_phase1?host=${encodeURIComponent(directory)}&port=55439`;
 const db=await openDatabase({mode:'postgres',url});
 try{
  const version=(await db.query<{server_version:string}>('SHOW server_version')).rows[0].server_version;
  if(!version.startsWith('18.'))throw new Error('PostgreSQL 18 required, found '+version);
  console.log('Isolated PostgreSQL',version);
  await setupDatabase(db);
  await db.exec(await readFile(new URL('../packages/database/roles.sql',import.meta.url),'utf8'));
 }finally{await db.close();}
 const result=spawnSync('pnpm',['exec','vitest','run','tests/integration'],{stdio:'inherit',env:{...process.env,DATABASE_MODE:'postgres',DATABASE_URL:url,TEST_PG_ROLES:'1'}});
 if(result.status!==0)process.exitCode=result.status??1;
}finally{
 if(started)command('pg_ctl',['-D',data,'-m','fast','-w','stop']);
 await rm(directory,{recursive:true,force:true});
}
