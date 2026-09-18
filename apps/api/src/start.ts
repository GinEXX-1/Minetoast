import {openDatabase} from '../../../packages/database/src/connection';
import {makeApp} from './app';
const db=await openDatabase();const app=await makeApp(db,{serveStatic:true});
await app.listen({host:'0.0.0.0',port:Number(process.env.PORT??4174)});
console.log('Knowledge World API ready.');
for(const signal of ['SIGINT','SIGTERM'] as const)process.once(signal,async()=>{await app.close();await db.close();process.exit(0);});
