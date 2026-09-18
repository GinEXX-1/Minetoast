import {spawn} from 'node:child_process';
import {openDatabase} from '../packages/database/src/connection';
import {setupDatabase} from './setup-db';
const db=await openDatabase();await setupDatabase(db);await db.close();
const viteArgs=process.argv.slice(2);
const children=[
 spawn('node',['--import','tsx','apps/api/src/start.ts'],{stdio:'inherit',env:process.env}),
 spawn('pnpm',['exec','vite',...viteArgs],{stdio:'inherit',env:process.env}),
];
let closing=false;function stop(){if(closing)return;closing=true;for(const child of children)child.kill('SIGTERM');}
process.on('SIGTERM',stop);process.on('SIGINT',stop);for(const child of children)child.on('exit',stop);
