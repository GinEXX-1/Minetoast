import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {batchOneScenes} from '../../content/ponder/batch-one';
import {createMathModel,defaults,dot,cross} from '../../packages/ponder/src/runtime';
import {parsePreferences,lineColors} from '../../apps/web/src/settings/preferences';
const scene=(id:string)=>batchOneScenes.find(s=>s.id===id)!;
describe('approved batch mathematical boundaries',()=>{
 it('binds eleven distinct nodes and renders every formula without escape loss',()=>{
  expect(batchOneScenes).toHaveLength(11);expect(new Set(batchOneScenes.map(s=>s.nodeId)).size).toBe(11);
  for(const s of batchOneScenes)for(const step of s.steps)if(step.formula){expect(step.formula).not.toMatch(/[\u0000-\u001f]/);expect(()=>katex.renderToString(step.formula!,{throwOnError:true})).not.toThrow();}
  for(const id of ['local-maximum','local-minimum'])expect(scene(id).steps.at(-1)!.formula).toContain(String.raw`\prime`);
 });
 it('keeps angle constructions in their planes and measures the spatial angle rather than screen projection',()=>{
  for(const theta of [.15,.7,Math.PI/2,2.8]){
   const s=scene('dihedral-angle'),m=createMathModel(s),p={theta},beta=s.objects.find(o=>o.id==='beta')!,ray=s.objects.find(o=>o.id==='rayB')!;
   if(beta.kind!=='plane'||ray.kind!=='segment3')throw Error();const u=m.v3(beta.u,p),v=m.v3(beta.v,p),r=m.v3(ray.to,p);
   expect(dot(r,v)).toBeCloseTo(0);expect(dot(cross(u,v),r)).toBeCloseTo(0);expect(Math.acos(r[0]/Math.hypot(...r))).toBeCloseTo(theta);
  }
  for(const theta of [.1,.6,1.4]){const m=createMathModel(scene('line-plane-angle')),s=m.scene.objects.find(o=>o.id==='slant')!;if(s.kind!=='segment3')throw Error();const r=m.v3(s.to,{theta});expect(Math.hypot(...r)).toBeCloseTo(2.5);expect(Math.asin(r[1]/2.5)).toBeCloseTo(theta);}
 });
 it('enforces nondegenerate parallel-plane constructions and distinguishes tilted directions',()=>{
  const s=scene('plane-plane-parallel'),m=createMathModel(s),beta=s.objects.find(o=>o.id==='beta')!;if(beta.kind!=='plane')throw Error();
  for(const tilt of [-.7,0,.7]){const p={height:1.2,tilt};const normal=cross(m.v3(beta.u,p),m.v3(beta.v,p));expect(Math.hypot(...normal)).toBeCloseTo(1);expect(Math.abs(normal[2])).toBeCloseTo(Math.abs(Math.sin(tilt)));}
  expect(s.parameters.height.min).toBeGreaterThan(0);
 });
 it('synchronizes circle height with sine tracing and the period with sinusoid parameters',()=>{
  const m=createMathModel(scene('sine-from-circle')),p=m.scene.objects.find(o=>o.id==='circlePoint')!,q=m.scene.objects.find(o=>o.id==='trace')!;if(p.kind!=='point'||q.kind!=='point')throw Error();
  for(const phase of [0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI]){const a=m.v2(p.at,{phase}),b=m.v2(q.at,{phase});expect(Math.hypot(a[0]+3,a[1])).toBeCloseTo(1);expect(a[1]).toBeCloseTo(b[1]);expect(b[0]).toBeCloseTo(phase);}
  const family=createMathModel(scene('sinusoidal-parameters'));for(const omega of [.4,1,2.5]){const p={amplitude:2,omega,phase:.7};expect(family.value('amplitude*sin(omega*x+phase)',p,{x:.3})).toBeCloseTo(family.value('amplitude*sin(omega*x+phase)',p,{x:.3+2*Math.PI/omega}));}
 });
 it('computes finite differences, derivative signs, extrema neighborhoods and signed dot products',()=>{
  const average=createMathModel(scene('average-rate'));for(const x0 of [.2,1,1.8])for(const h of [.05,.6,1.5])expect(average.value('(f(x0+h)-f(x0))/h',{x0,h})).toBeCloseTo(2*x0+h);
  const mono=createMathModel(scene('derivative-monotonicity'));for(const x0 of [-2,-1,0,1,2])expect(mono.value('df(x0)',{x0})).toBeCloseTo(3*x0*x0-3);
  for(const id of ['local-maximum','local-minimum']){const m=createMathModel(scene(id));for(const delta of [.1,.7,1.5]){const center=m.value('f(0)',{delta}),left=m.value('f(-delta)',{delta}),right=m.value('f(delta)',{delta});expect(left).toBeCloseTo(right);expect(id==='local-maximum'?center>left:center<left).toBe(true);}}
  const m=createMathModel(scene('vector-dot-product'));for(const phi of [0,Math.PI/2,Math.PI]){const p={lengthA:3,lengthB:2,phi};expect(m.value('lengthA*lengthB*cos(phi)',p)).toBeCloseTo(phi===0?6:phi===Math.PI?-6:0);}
 });
});
describe('settings validation and contrast palette',()=>{
 it('rejects malformed preferences and invalid color values while preserving valid custom colors',()=>{
  expect(parsePreferences('broken')).toEqual({theme:'night',comfort:false,colors:{}});expect(parsePreferences('{"theme":"invalid","comfort":1,"colors":{"cyan":"red","gold":"#123456","unknown":"#abcdef"}}')).toEqual({theme:'night',comfort:false,colors:{gold:'#123456'}});
  const p=parsePreferences('{"theme":"day","comfort":true,"colors":{"cyan":"#234567"}}');expect(lineColors('coordinate',p).cyan).toBe('#234567');expect(lineColors('solid',p).green).toBe('#2c6f44');expect(defaults(scene('average-rate')).h).toBeGreaterThan(0);
 });
});
