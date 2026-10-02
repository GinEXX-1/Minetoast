import {describe,it,expect} from 'vitest';
import {ponderScenes} from '../../content/ponder/catalog';
import {pilotScenes} from '../../content/ponder/pilots';
import {sceneSchema} from '../../packages/ponder/src/schema';
import {compileExpression} from '../../packages/ponder/src/expression';
import {createMathModel,defaults,constrain,startTimeline,nextTimeline,tickTimeline,jumpTimeline,stepParameters,dot,cross} from '../../packages/ponder/src/runtime';
import {beginProgress,updateProgress} from '../../packages/ponder/src/progress';
import {validateMathematics} from '../../packages/ponder/src/validation';
import {qualityGate,publishableScene,sceneDigest,reviewTypes} from '../../packages/ponder/src/quality';
const [mono,circle,solid]=pilotScenes;
describe('Ponder DSL and safe mathematics',()=>{
 it('validates all executable pilots and rejects invalid refs/renderer/bounds',()=>{
  for(const s of ponderScenes)expect(validateMathematics(s)).toEqual([]);
  expect(sceneSchema.safeParse({...mono,steps:[...mono.steps.slice(0,-1),{...mono.steps.at(-1),show:['missing']}]}).success).toBe(false);
  expect(sceneSchema.safeParse({...mono,renderer:'solid'}).success).toBe(false);
  expect(sceneSchema.safeParse({...mono,parameters:{x1:{...mono.parameters.x1,max:-1}}}).success).toBe(false);
  expect(sceneSchema.safeParse({...mono,code:'anything'}).success).toBe(false);
 });
 it('parses precedence and standard functions, rejects code and undefined operations',()=>{
  expect(compileExpression('-2^2+3*4')({})).toBe(8);expect(compileExpression('2^3^2')({})).toBe(512);
  expect(compileExpression('sin(pi/2)+sqrt(4)')({})).toBeCloseTo(3);
  for(const x of ['window.alert(1)','fetch(1)','x=1','constructor(1)','1;2','sin()','1/0','sqrt(-1)','2**3'])expect(()=>compileExpression(x)({})).toThrow();
  expect(()=>compileExpression('('.repeat(40)+'1'+')'.repeat(40))({})).toThrow();
  expect(validateMathematics({...mono,expressions:{f:'f(x)'}}).length).toBeGreaterThan(0);
 });
 it('clamps parameters and preserves strict order throughout extreme interaction',()=>{
  let p=defaults(mono);for(let i=0;i<100;i++){p=constrain(mono,p,'x1',i%2?999:-999);p=constrain(mono,p,'x2',i%3?999:-999);expect(p.x1+.05).toBeLessThanOrEqual(p.x2+1e-12);expect(p.x1).toBeGreaterThanOrEqual(0);expect(p.x2).toBeLessThanOrEqual(3);}
  expect(constrain(mono,p,'x1',NaN)).toBe(p);expect(constrain(mono,p,'missing',1)).toBe(p);
 });
 it('calculates monotonic values for arbitrary ordered pairs on the stated interval',()=>{
  const m=createMathModel(mono);for(let i=0;i<30;i++)for(let j=i+1;j<=30;j++){const p={x1:i/10,x2:j/10};expect(m.value('f(x1)',p)).toBeCloseTo(p.x1**2);expect(m.value('f(x2)',p)).toBeGreaterThan(m.value('f(x1)',p));}
 });
 it('merges two exact circle intersections and preserves the tangent invariant',()=>{
  const m=createMathModel(circle),crossings=circle.objects.find(o=>o.kind==='intersections')!;if(crossings.kind!=='intersections')throw Error();
  const secant=m.intersections(crossings,{phi:0,theta:.8}),tangent=m.intersections(crossings,{phi:0,theta:0});expect(secant).toHaveLength(2);expect(tangent).toHaveLength(1);expect(tangent[0][0]).toBeCloseTo(2);
  for(let phi=-3;phi<=3;phi+=.1){const p={phi,theta:0},radius=[Math.cos(phi),Math.sin(phi)],direction=[-Math.sin(phi),Math.cos(phi)];expect(dot(radius,direction)).toBeCloseTo(0);expect(m.intersections(crossings,p)).toHaveLength(1);const point=m.intersections(crossings,p)[0];expect(Math.hypot(...point)).toBeCloseTo(2);}
  const midway=stepParameters(circle,1,6.5);expect(midway.theta).toBeCloseTo(.4);
 });
 it('keeps solid lines in a nondegenerate plane with perpendicular normal',()=>{
  for(let beta=.35;beta<2.8;beta+=.1){const a=[1,0,0],b=[Math.cos(beta),0,Math.sin(beta)],l=[0,1,0];expect(dot(a,l)).toBe(0);expect(dot(b,l)).toBe(0);expect(Math.hypot(...cross(a,b))).toBeGreaterThan(.3);expect(dot(cross(a,b),l)).not.toBe(0);}
  expect(solid.renderer).toBe('solid');
 });
});
describe('Ponder timeline, progress and quality isolation',()=>{
 it('pauses at optional interaction, seeks deterministically, and requires all steps for completion',()=>{
  let t=startTimeline(mono);for(let i=0;i<3;i++)t=tickTimeline(mono,t,60);expect(t.step).toBe(3);expect(t.playing).toBe(false);expect(tickTimeline(mono,t,60)).toEqual(t);
  t=nextTimeline(mono,t);t=tickTimeline(mono,t,60);expect(t.complete).toBe(true);
  const skip=nextTimeline(mono,jumpTimeline(mono,startTimeline(mono),4));expect(skip.complete).toBe(false);
  expect(startTimeline(mono).visited).toEqual([]);
 });
 it('records only Ponder progress, persists completion across replay, and invalidates corrupt records',()=>{
  const knowledge={unlocked:['A'],mastered:['A'],strong:['A>B'],weak:['B>C']},before=JSON.stringify(knowledge);
  let t=startTimeline(mono);for(let i=0;i<5;i++)t=nextTimeline(mono,t);
  const p=updateProgress(beginProgress(mono,null),t,true);expect(p.principleViewed).toBe(true);expect(p.completedAt).not.toBeNull();expect(p.interactionUsed).toBe(true);
  expect(beginProgress(mono,p).principleViewed).toBe(true);expect(beginProgress(mono,{...p,nodeId:'wrong'}).principleViewed).toBe(false);
  expect(updateProgress(p,startTimeline(mono)).principleViewed).toBe(true);expect(JSON.stringify(knowledge)).toBe(before);expect(p).not.toHaveProperty('mastered');
 });
 it('blocks missing, stale, malformed or non-independent review evidence',()=>{
  expect(qualityGate(mono).decision).toBe('REVIEW_REQUIRED');expect(()=>publishableScene(mono,{reviews:[]})).toThrow();
  const digest=sceneDigest(mono),reviews=reviewTypes.map(reviewType=>({demoId:mono.id,sceneDigest:digest,reviewType,decision:'PASS',confidence:'HIGH',issues:[],reviewer:'test-fixture',createdAt:new Date().toISOString(),evidence:'Synthetic evidence only used to test gate transitions'}));
  const independentReview={sceneDigest:digest,decision:'PASS' as const,confidence:'HIGH' as const,reviewer:'review-model',author:'scene-author',createdAt:new Date().toISOString(),evidence:'Synthetic test review'};
  expect(qualityGate(mono,{reviews,independentReview}).decision).toBe('PASS');
  expect(qualityGate({...mono,title:'changed'},{reviews,independentReview}).decision).toBe('REVIEW_REQUIRED');
  expect(qualityGate(mono,{reviews,independentReview:{...independentReview,reviewer:'scene-author'}}).decision).toBe('REVIEW_REQUIRED');
  expect(qualityGate(mono,{reviews:[{}]}).decision).toBe('FAIL');
  expect(qualityGate(mono,{reviews,independentReview:{...independentReview,reviewer:123,author:321,evidence:{}}}).decision).toBe('FAIL');
 });
});
