import {ease,unit} from './runtime';
import type {SceneDefinition} from './schema';
export type ObjectFrame={reveal:number;draw:number;emphasis:number};
export type AnimationFrame={objects:Record<string,ObjectFrame>;caption:boolean;formula:boolean;elapsed:number;camera:[number,number,number];progress:number;beat:string};
/** Pure, seekable choreography. No DOM, timers, or knowledge-state effects. */
export function animationFrame(scene:SceneDefinition,index:number,elapsed:number,settled=false):AnimationFrame{
 const step=scene.steps[index],time=settled?step.duration:Math.max(0,elapsed);
 const objects:Record<string,ObjectFrame>=Object.fromEntries(step.show.map(id=>[id,{reveal:1,draw:1,emphasis:step.highlight.includes(id)?1:0}]));
 let beat=step.title;
 for(const cue of step.cues){const state=objects[cue.target],t=unit((time-cue.start)/cue.duration);if(!state)continue;
  if(cue.kind==='draw')state.draw=ease('smooth',t);
  if(cue.kind==='reveal')state.reveal=ease('smooth',t);
  if(cue.kind==='pulse')state.emphasis=time>=cue.start&&time<=cue.start+cue.duration ? .35+.65*Math.sin(Math.PI*t)**2:state.emphasis;
  if(time>=cue.start&&time<cue.start+cue.duration)beat=scene.objects.find(o=>o.id===cue.target)?.label||step.title;
 }
 const from=index>0?(scene.steps[index-1].camera??scene.scene.camera):scene.scene.camera,to=step.camera??scene.scene.camera,t=ease('smooth',unit(time/2.5));
 return {objects,elapsed:time,caption:time>=step.narration.captionAt,formula:time>=step.narration.formulaAt,camera:from.map((v,i)=>v+(to[i]-v)*t) as [number,number,number],progress:unit(time/step.duration),beat};
}
