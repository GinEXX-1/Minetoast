import {hash} from '@node-rs/argon2';
import {openDatabase} from '../packages/database/src/connection';
const username=process.env.ADMIN_USERNAME,password=process.env.ADMIN_PASSWORD;
if(!username||!/^[A-Za-z0-9_]{3,32}$/.test(username)||!password||password.length<12||password.length>128)throw new Error('Supply ADMIN_USERNAME and ADMIN_PASSWORD (12–128 chars) via environment; never commit credentials.');
const db=await openDatabase();
try{await db.transaction(async tx=>{
 const passwordHash=await hash(password,{memoryCost:19456,timeCost:2,parallelism:1});
 const user=(await tx.query<{id:string}>("INSERT INTO users(username,password_hash,role) VALUES($1,$2,'admin') RETURNING id",[username,passwordHash])).rows[0];
 await tx.query('INSERT INTO user_progress_state(user_id) VALUES($1)',[user.id]);
 await tx.query("INSERT INTO admin_audit_events(actor_id,action,entity_type,entity_id,after_value) VALUES($1,'provision','user',$1,$2)",[user.id,JSON.stringify({username,role:'admin'})]);
});console.log('Administrator provisioned. No credentials printed.');}finally{await db.close();}
