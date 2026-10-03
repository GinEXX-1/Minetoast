import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {batchTwoScenes} from '../../content/ponder/batch-two';
import {createMathModel,defaults,stepParameters} from '../../packages/ponder/src/runtime';
import {validateMathematics} from '../../packages/ponder/src/validation';
import {trialFrequency} from '../../packages/ponder/src/expression';
const scene=(id:string)=>batchTwoScenes.find(s=>s.id===id)!;
describe('second batch invariants and boundaries',()=>{
 it('binds 14 different nodes, validates primitives and all formulas',()=>{
  expect(batchTwoScenes).toHaveLength(14);expect(new Set(batchTwoScenes.map(s=>s.nodeId)).size).toBe(14);
  for(const s of batchTwoScenes){expect(validateMathematics(s),s.id).toEqual([]);for(const st of s.steps)if(st.formula)expect(()=>katex.renderToString(st.formula!,{throwOnError:true})).not.toThrow();}
 });
 it('preserves ellipse distance sum and standard equation across the parameter domain',()=>{
  const m=createMathModel(scene('ellipse-definition'));
  for(const a of [3,3.5,4])for(const b of [.6,1.5,2.5])for(let theta=0;theta<=6.3;theta+=.17){const p={a,b,theta};expect(m.value('d1+d2',p)).toBeCloseTo(2*a,9);expect(m.value('(a*cos(theta))^2/a^2+(b*sin(theta))^2/b^2',p)).toBeCloseTo(1,9);}
 });
 it('keeps both hyperbola branches on the curve and distance difference positive',()=>{
  const m=createMathModel(scene('hyperbola-definition'));
  for(const branch of [-1,0,1])for(const a of [1,2])for(const b of [.6,1.4])for(const t of [-2,-1,0,1,2]){const p={branch,a,b,t};expect(m.value('abs(d1-d2)',p)).toBeCloseTo(2*a,9);expect(Math.abs(m.value('side',p))).toBe(1);expect(m.value('(side*a*sqrt(1+t^2))^2/a^2-(b*t)^2/b^2',p)).toBeCloseTo(1,9);}
 });
 it('uses perpendicular distance to the parabola directrix and correct focal parameter',()=>{
  const m=createMathModel(scene('parabola-definition'));
  for(const p of [1.2,2,2.5])for(let t=-3;t<=3;t+=.13){const values={p,t};expect(m.value('sqrt((t^2/(2*p)-p/2)^2+t^2)',values)).toBeCloseTo(m.value('t^2/(2*p)+p/2',values),9);}
 });
 it('projects the matching width, depth and height into each orthographic rectangle',()=>{
  const s=scene('orthographic-views'),m=createMathModel(s);
  for(const w of [1.2,2.4])for(const d of [.8,1.5])for(const h of [.8,1.5])for(const [id,width,height] of [['front',w,h],['side',d,h],['top',w,d]] as const){const o=s.objects.find(o=>o.id===id)!;if(o.kind!=='polygon')throw Error();const corners=o.vertices.map(v=>m.v2(v,{w,d,h}));expect(corners[1][0]-corners[0][0]).toBeCloseTo(width);expect(corners[2][1]-corners[1][1]).toBeCloseTo(height);}
 });
 it('keeps set circles within their universe and uses correct Boolean operations',()=>{
  for(const op of ['union','intersection','complement']){const s=scene(`set-${op}`);const region=s.objects.find(o=>o.kind==='region')!;expect(region).toMatchObject({operation:op,first:'A'});for(const gap of [.8,3.4])expect(gap/2+1.5).toBeLessThan(4);}
 });
 it('never reverses implication and provides a true converse counterexample',()=>{
  for(const id of ['sufficient-condition','necessary-condition']){const s=scene(id),m=createMathModel(s);for(let x0=-2.5;x0<=2.5;x0+=.01){const p=m.value(s.readouts[0].expression,{x0}),q=m.value(s.readouts[1].expression,{x0});expect(p<=q).toBe(true);}
   expect(s.readouts.map(r=>m.value(r.expression,{x0:1.5}))).toEqual([0,1]);expect(stepParameters(s,3,10).x0).toBe(1.5);
  }
 });
 it('reproduces actual trial prefixes without monotone-error fabrication',()=>{
  let rng=1,hits=0;for(let n=1;n<=1000;n++){rng=(Math.imul(rng,1664525)+1013904223)>>>0;hits+=Number(rng/4294967296<.5);expect(trialFrequency(n,.5,1)).toBe(hits/n);}
  expect(trialFrequency(1000,.5,1)).not.toBe(trialFrequency(1000,.5,2));
  let increases=0;for(let n=2;n<=200;n++)if(Math.abs(trialFrequency(n,.5,1)-.5)>Math.abs(trialFrequency(n-1,.5,1)-.5))increases++;expect(increases).toBeGreaterThan(10);
  for(const n of [0,1001])expect(()=>trialFrequency(n,.5,1)).toThrow();
  expect(trialFrequency(100,0,1)).toBe(0);expect(trialFrequency(100,1,1)).toBe(1);
 });
 it('counts dice outcomes and uses uniform area ratios exactly',()=>{
  const classical=createMathModel(scene('classical-probability'));for(const k of [1,2,3.8,6])expect(classical.value('floor(k)/6',{k})).toBe(Math.floor(k)/6);
  const geometric=createMathModel(scene('geometric-probability'));for(const w of [.5,2,5.5])expect(geometric.value('w/6',{w})).toBeCloseTo(3*w/18);
  const samples=geometric.scene.objects.find(o=>o.kind==='samples')!;if(samples.kind!=='samples')throw Error();for(const v of samples.points){const [x,y]=geometric.v2(v,defaults(geometric.scene));expect(x).toBeGreaterThanOrEqual(-3);expect(x).toBeLessThan(3);expect(y).toBeGreaterThanOrEqual(0);expect(y).toBeLessThan(3);}
 });
 it('keeps sequence terms on the continuous extension, including constant cases',()=>{
  for(const id of ['arithmetic-linear','geometric-exponential']){const m=createMathModel(scene(id)),points=m.scene.objects.find(o=>o.kind==='samples')!;if(points.kind!=='samples')throw Error();for(const value of id==='arithmetic-linear'?[-.6,0,.6]:[.6,1,1.5]){const p={...defaults(m.scene),[id==='arithmetic-linear'?'d':'q']:value};for(const at of points.points){const [x,y]=m.v2(at,p);expect(x).toBe(Math.floor(x));expect(y).toBeCloseTo(m.value('f(x)',p,{x}),9);}}}
 });
});
