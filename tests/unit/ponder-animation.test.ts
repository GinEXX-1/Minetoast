import {describe,it,expect} from 'vitest';
import {ponderScenes} from '../../content/ponder/catalog';
import {animationFrame} from '../../packages/ponder/src/animation';
import {sceneSchema} from '../../packages/ponder/src/schema';
import {stepParameters,animateParameters,startTimeline,nextTimeline,jumpTimeline} from '../../packages/ponder/src/runtime';
describe('seekable mathematical choreography',()=>{
 it('gives each authored step bounded animation cues and preserves exact seek/replay results',()=>{
  for(const scene of ponderScenes)for(let i=0;i<scene.steps.length;i++){
   const step=scene.steps[i];expect(step.cues.length).toBeGreaterThan(0);
   for(const t of [0,.5,2,step.duration]){
    const frame=animationFrame(scene,i,t);expect(frame).toEqual(animationFrame(scene,i,t));
    for(const object of Object.values(frame.objects)){expect(object.draw).toBeGreaterThanOrEqual(0);expect(object.draw).toBeLessThanOrEqual(1);expect(object.reveal).toBeGreaterThanOrEqual(0);expect(object.reveal).toBeLessThanOrEqual(1);}
   }
   const settled=animationFrame(scene,i,0,true);expect(settled.caption).toBe(true);expect(settled.formula).toBe(true);for(const object of Object.values(settled.objects)){expect(object.draw).toBe(1);expect(object.reveal).toBe(1);}
  }
 });
 it('allows replay and seeking after a completed session while preserving visited steps',()=>{const scene=ponderScenes[0];let timeline=startTimeline(scene);for(let i=0;i<scene.steps.length;i++)timeline=nextTimeline(scene,timeline);expect(timeline.complete).toBe(true);const replay=jumpTimeline(scene,timeline,1);expect(replay.complete).toBe(false);expect(replay.elapsed).toBe(0);expect(replay.visited).toEqual(timeline.visited);});
 it('preserves chosen experiment values into symbolic steps until explicit seek',()=>{const scene=ponderScenes[0],values={x1:2,x2:2.7};expect(animateParameters(scene,4,4,values)).toEqual(values);expect(stepParameters(scene,4,4).x1).toBe(.6);});
 it('rejects out-of-step tracks and nonexistent targets before rendering',()=>{
  const scene=ponderScenes[0],step=scene.steps[0];
  for(const cue of [{target:'missing',kind:'draw',start:0,duration:1},{target:'curve',kind:'draw',start:7,duration:3}])expect(sceneSchema.safeParse({...scene,steps:[{...step,cues:[cue]},...scene.steps.slice(1)]}).success).toBe(false);
 });
 it('holds the secant while it is introduced, then merges intersections at the mathematical endpoint',()=>{
  const scene=ponderScenes.find(s=>s.id==='circle-tangent')!;
  expect(stepParameters(scene,1,1).theta).toBe(.8);expect(stepParameters(scene,1,6.5).theta).toBeCloseTo(.4);expect(stepParameters(scene,1,11).theta).toBe(0);
 });
});
