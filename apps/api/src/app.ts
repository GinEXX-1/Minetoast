import Fastify,{type FastifyContextConfig,type FastifyRequest} from 'fastify';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import staticFiles from '@fastify/static';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {hash,verify} from '@node-rs/argon2';
import {z} from 'zod';
import type {Database} from '../../../packages/database/src/connection';
import {ApiError,applyCommand,envelopeSchema,getProgress} from './progress';
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
const credentials=z.object({username:z.string().regex(/^[A-Za-z0-9_]{3,32}$/),password:z.string().min(12).max(128)}).strict();
const argonOptions={memoryCost:19456,timeCost:2,parallelism:1};
export async function makeApp(db:Database,options:{origin?:string;serveStatic?:boolean;rateLimit?:boolean}={}){
 const app=Fastify({logger:false,bodyLimit:64*1024});
 const production=process.env.NODE_ENV==='production';
 const origin=options.origin??process.env.APP_ORIGIN??'http://localhost:4173';
 const origins=new Set([origin,...(production?[]:['http://terminal.local:4173'])]);
 const cookieName=production?'__Host-kw_session':'kw_session';
 const dummyHash=await hash(randomBytes(32).toString('hex'),argonOptions);
 await app.register(cookie);
 if(options.rateLimit!==false)await app.register(rateLimit,{global:false});
 async function account(request:FastifyRequest){
  const token=request.cookies[cookieName];if(!token)throw new ApiError(401,'LOGIN_REQUIRED','登录后才能保存个人进度。');
  const row=(await db.query<{id:string;username:string;role:string;csrf_token_hash:string}>(`SELECT u.id,u.username,u.role,s.csrf_token_hash FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now() AND u.disabled_at IS NULL`,[digest(token)])).rows[0];
  if(!row)throw new ApiError(401,'SESSION_EXPIRED','登录已过期，请重新登录。');
  return {...row,token,csrf:digest(token+':csrf')};
 }
 function sameOrigin(request:FastifyRequest){if(!origins.has(request.headers.origin??''))throw new ApiError(403,'ORIGIN_REJECTED','请求来源不允许。');}
 async function writer(request:FastifyRequest){sameOrigin(request);const user=await account(request);const supplied=String(request.headers['x-csrf-token']??'');if(!supplied||!timingSafeEqual(Buffer.from(digest(supplied)),Buffer.from(user.csrf_token_hash)))throw new ApiError(403,'CSRF_REJECTED','会话验证失败，请刷新页面。');return user;}
 async function session(userId:string,reply:any){
  const token=randomBytes(32).toString('hex'),csrf=digest(token+':csrf');
  await db.query("INSERT INTO sessions(token_hash,user_id,csrf_token_hash,expires_at) VALUES($1,$2,$3,now()+interval '7 days')",[digest(token),userId,digest(csrf)]);
  reply.setCookie(cookieName,token,{httpOnly:true,secure:production,sameSite:'lax',path:'/',maxAge:604800});return csrf;
 }
 app.setErrorHandler((error:any,request,reply)=>{
  if(error instanceof z.ZodError)return reply.code(422).send({code:'INVALID_INPUT',message:'请检查输入：用户名为 3–32 位字母、数字或下划线；密码为 12–128 个字符。',requestId:request.id});
  const status=error.statusCode??500;return reply.code(status).send({code:error.code??'SERVER_ERROR',message:status>=500?'暂时无法保存，请稍后重试。':error.message,requestId:request.id});
 });
 app.get('/api/v1/health',async()=>{await db.query('SELECT 1');return {ok:true};});
 app.get('/api/v1/knowledge/graph',async(_,reply)=>{
  const data=(await db.query<{snapshot:any;content_hash:string}>('SELECT r.snapshot,r.content_hash FROM graph_releases r JOIN graph_head h ON h.release_id=r.id')).rows[0];
  reply.header('Cache-Control','no-cache').header('ETag','"'+data.content_hash+'"');return data.snapshot;
 });
 app.get('/api/v1/auth/me',async(request,reply)=>{reply.header('Cache-Control','no-store');try{const a=await account(request);return {user:{id:a.id,username:a.username},csrfToken:a.csrf};}catch(e){if(e instanceof ApiError&&e.statusCode===401)return {user:null,csrfToken:null};throw e;}});
 const limits:FastifyContextConfig=options.rateLimit===false?{}:{rateLimit:{max:12,timeWindow:'1 minute',keyGenerator:(request:FastifyRequest)=>request.ip}};
 // IP limit + bounded per-name bucket, both applied before expensive Argon2 work.
 const attempts=new Map<string,{count:number;expires:number}>();
 function nameLimit(name:string){if(options.rateLimit===false)return;const now=Date.now();for(const [k,v] of attempts)if(v.expires<now)attempts.delete(k);const key=name.toLowerCase();const a=attempts.get(key)??{count:0,expires:now+60000};if(++a.count>12)throw new ApiError(429,'TOO_MANY_ATTEMPTS','尝试次数过多，请稍后再试。');if(attempts.size>=10000&&!attempts.has(key))throw new ApiError(429,'TOO_MANY_ATTEMPTS','请稍后重试。');attempts.set(key,a);}
 app.post('/api/v1/auth/register',{config:limits},async(request,reply)=>{
  sameOrigin(request);const data=credentials.parse(request.body);nameLimit(data.username);
  const passwordHash=await hash(data.password,argonOptions);
  let user:{id:string;username:string};
  try{user=await db.transaction(async tx=>{const u=(await tx.query<{id:string;username:string}>('INSERT INTO users(username,password_hash) VALUES($1,$2) RETURNING id,username',[data.username,passwordHash])).rows[0];await tx.query('INSERT INTO user_progress_state(user_id) VALUES($1)',[u.id]);return u;});}catch(e:any){if(e.code==='23505')throw new ApiError(409,'USERNAME_EXISTS','这个用户名已被使用。');throw e;}
  const csrfToken=await session(user.id,reply);return {user,csrfToken};
 });
 app.post('/api/v1/auth/login',{config:limits},async(request,reply)=>{
  sameOrigin(request);const data=credentials.parse(request.body);nameLimit(data.username);
  const user=(await db.query<{id:string;username:string;password_hash:string;disabled_at:Date|null}>('SELECT id,username,password_hash,disabled_at FROM users WHERE lower(username)=lower($1)',[data.username])).rows[0];
  const valid=await verify(user&&!user.disabled_at?user.password_hash:dummyHash,data.password);
  if(!user||user.disabled_at||!valid)throw new ApiError(401,'INVALID_CREDENTIALS','用户名或密码不正确。');
  // Rotate a previous session when an account logs in again in the same browser.
  const old=request.cookies[cookieName];if(old)await db.query('UPDATE sessions SET revoked_at=now() WHERE token_hash=$1',[digest(old)]);
  await db.query('UPDATE users SET last_login_at=now() WHERE id=$1',[user.id]);
  return {user:{id:user.id,username:user.username},csrfToken:await session(user.id,reply)};
 });
 app.post('/api/v1/auth/logout',async(request,reply)=>{const user=await writer(request);await db.query('UPDATE sessions SET revoked_at=now() WHERE token_hash=$1',[digest(user.token)]);reply.clearCookie(cookieName,{path:'/',secure:production,httpOnly:true,sameSite:'lax'});return {ok:true};});
 app.get('/api/v1/me/progress',async(request,reply)=>{const user=await account(request);reply.header('Cache-Control','no-store');return db.transaction(tx=>getProgress(tx,user.id));});
 app.post('/api/v1/me/progress/commands',async(request,reply)=>{const user=await writer(request);reply.header('Cache-Control','no-store');return applyCommand(db,user.id,envelopeSchema.parse(request.body));});
 if(options.serveStatic&&existsSync(resolve('dist/index.html'))){await app.register(staticFiles,{root:resolve('dist')});app.setNotFoundHandler((request,reply)=>request.url.startsWith('/api/')?reply.code(404).send({code:'NOT_FOUND',message:'接口不存在。'}):reply.sendFile('index.html'));}
 return app;
}
