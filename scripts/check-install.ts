import {mkdtemp,mkdir,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
const directory=await mkdtemp(join(tmpdir(),'kw-clean-install-'));
try{
 for(const path of ['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','packages/domain/package.json']){const target=join(directory,path);await mkdir(dirname(target),{recursive:true});await copyFile(path,target);}
 const result=spawnSync('pnpm',['install','--frozen-lockfile','--offline'],{cwd:directory,stdio:'inherit'});
 if(result.status!==0)process.exitCode=result.status??1;else console.log('Clean frozen install passed using cached packages and no existing node_modules.');
}finally{await rm(directory,{recursive:true,force:true});}
