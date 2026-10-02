import {openDatabase} from '../../../packages/database/src/connection';
import {makeApp} from './app';
const db=await openDatabase();
if(process.env.NODE_ENV==='production'&&!process.env.ADMIN_DATABASE_URL)throw new Error('ADMIN_DATABASE_URL is required for a separate least-privilege content connection.');
const adminDb=process.env.ADMIN_DATABASE_URL?await openDatabase({url:process.env.ADMIN_DATABASE_URL,mode:'postgres'}):db;
const app=await makeApp(db,{serveStatic:true,adminDb});
await app.listen({host:'0.0.0.0',port:Number(process.env.PORT??4174)});
console.log('Minetoast API ready.');
for(const signal of ['SIGINT','SIGTERM'] as const)process.once(signal,async()=>{await app.close();await db.close();if(adminDb!==db)await adminDb.close();process.exit(0);});
