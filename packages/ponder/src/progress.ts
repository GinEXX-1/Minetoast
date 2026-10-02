import {z} from 'zod';
import type {SceneDefinition} from './schema';
import type {Timeline} from './runtime';
export const progressSchema=z.object({userId:z.string(),nodeId:z.string(),demoId:z.string(),version:z.number().int().positive(),startedAt:z.string().datetime(),completedAt:z.string().datetime().nullable(),lastStep:z.number().int().nonnegative(),principleViewed:z.boolean(),interactionUsed:z.boolean(),replayCount:z.number().int().nonnegative()}).strict();
export type PonderProgress=z.infer<typeof progressSchema>;
export const progressKey=(scene:SceneDefinition,userId='local')=>`kw:ponder:v1:${encodeURIComponent(userId)}:${scene.id}:${scene.version}`;
export function beginProgress(scene:SceneDefinition,saved:unknown,now=new Date().toISOString(),userId='local'):PonderProgress{
 const parsed=progressSchema.safeParse(saved);
 if(parsed.success&&parsed.data.userId===userId&&parsed.data.demoId===scene.id&&parsed.data.nodeId===scene.nodeId&&parsed.data.version===scene.version&&parsed.data.lastStep<scene.steps.length)return {...parsed.data,replayCount:parsed.data.replayCount+1};
 return {userId,nodeId:scene.nodeId,demoId:scene.id,version:scene.version,startedAt:now,completedAt:null,lastStep:0,principleViewed:false,interactionUsed:false,replayCount:0};
}
export function updateProgress(progress:PonderProgress,timeline:Timeline,interactionUsed=false,now=new Date().toISOString()):PonderProgress{return {...progress,lastStep:timeline.step,interactionUsed:progress.interactionUsed||interactionUsed,principleViewed:progress.principleViewed||timeline.complete,completedAt:progress.completedAt??(timeline.complete?now:null)};}
