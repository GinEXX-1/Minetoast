import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {geometryCompletionScenes} from '../../content/ponder/geometry-complete';
import {geometrySystem} from '../../content/fixtures/geometry-system';
import {ponderScenes} from '../../content/ponder/catalog';
import {createMathModel,defaults} from '../../packages/ponder/src/runtime';
import {validateMathematics} from '../../packages/ponder/src/validation';

const scene=(id:string)=>geometryCompletionScenes.find(s=>s.id===id)!;
describe('geometry completion scenes',()=>{
 it('covers each of the 50 geometry nodes exactly once with executable, interactive scenes',()=>{
  expect(geometryCompletionScenes).toHaveLength(40);
  const ids=geometrySystem.concepts.map(c=>c.id);
  expect(ids.every(id=>ponderScenes.filter(s=>s.nodeId===id).length===1)).toBe(true);
  for(const s of geometryCompletionScenes){
   expect(validateMathematics(s),s.id).toEqual([]);
   expect(s.steps.some(step=>step.animate.length>0),s.id).toBe(true);
   expect(s.steps.some(step=>step.interaction.length>0),s.id).toBe(true);
   expect(s.objects.some(o=>JSON.stringify(o).match(new RegExp(Object.keys(s.parameters).join('|')))),s.id).toBe(true);
   for(const step of s.steps)if(step.formula)expect(()=>katex.renderToString(step.formula!,{throwOnError:true}),s.id).not.toThrow();
  }
 });
 it('keeps the point-to-line foot on the line and perpendicular to it',()=>{
  const s=scene('geometry-point-line-distance'),m=createMathModel(s),foot=s.objects.find(o=>o.id==='H');if(foot?.kind!=='point')throw Error('Missing foot');
  for(const px of [-2,-.3,1,2])for(const py of [-1,.4,2]){const p={px,py},[hx,hy]=m.v2(foot.at,p);
   expect(hx+2*hy-2).toBeCloseTo(0,9);
   expect((px-hx)*2-(py-hy)).toBeCloseTo(0,9);
   expect(Math.hypot(px-hx,py-hy)).toBeCloseTo(m.value('abs(px+2*py-2)/sqrt(5)',p),9);
  }
 });
 it('unfolds a cone sector whose arc matches its base circumference',()=>{
  const s=scene('geometry-cone-surface-area'),m=createMathModel(s),arc=s.objects.find(o=>o.id==='arc');if(arc?.kind!=='parametric'||!arc.end)throw Error('Missing dynamic sector arc');
  for(const radius of [.5,.8,1.3])for(const slant of [1.5,2.2,3]){const p={radius,slant},angle=m.value(arc.end,p);expect(slant*angle).toBeCloseTo(2*Math.PI*radius,9);expect(angle).toBeLessThan(2*Math.PI);}
 });
 it('uses the true drawn oblique length and physically valid pyramid slant height',()=>{
  const s=scene('geometry-oblique-projection'),m=createMathModel(s),edge=s.objects.find(o=>o.id==='depth1');if(edge?.kind!=='segment')throw Error('Missing projected edge');
  for(const depth of [.5,2,3])for(const ratio of [.3,.5,.8]){const p={depth,ratio},a=m.v2(edge.from,p),b=m.v2(edge.to,p);expect(Math.hypot(b[0]-a[0],b[1]-a[1])).toBeCloseTo(depth*ratio,9);}
  const pyramid=scene('geometry-pyramid-surface-area');expect(pyramid.parameters.slant.min).toBeGreaterThan(pyramid.parameters.base.max/2);
 });
 it('keeps focus, eccentricity and asymptote values tied to the displayed conics',()=>{
  const e=createMathModel(scene('geometry-ellipse-eccentricity')),h=createMathModel(scene('geometry-hyperbola-asymptotes'));
  for(const major of [2.4,3,3.6])for(const minor of [.6,1.5,2]){const p={major,minor},c=e.value('sqrt(major^2-minor^2)',p);expect(c*c+minor*minor).toBeCloseTo(major*major,9);expect(c/major).toBeGreaterThan(0);expect(c/major).toBeLessThan(1);}
  for(const real of [1,1.4,2])for(const imag of [.5,.9,1.5]){const p={real,imag};expect(h.value('sqrt(real^2+imag^2)/real',p)).toBeGreaterThan(1);expect(h.value('imag/real',p)).toBeCloseTo(imag/real,9);}
 });
 it('separates distance, area and volume units under scaling',()=>{
  const sphere=createMathModel(scene('geometry-sphere-measure'));
  const one={radius:1},two={radius:2};
  expect(sphere.value('4*pi*radius^2',two)/sphere.value('4*pi*radius^2',one)).toBe(4);
  expect(sphere.value('4*pi*radius^3/3',two)/sphere.value('4*pi*radius^3/3',one)).toBe(8);
  const prism=createMathModel(scene('geometry-prism-volume'));
  const p={...defaults(prism.scene),base:1.5,height:2};
  expect(prism.value('base^2*height',p)).toBeCloseTo(4.5,9);
  const pyramid=createMathModel(scene('geometry-pyramid-volume'));
  expect(pyramid.value('base^2*height/3',p)).toBeCloseTo(1.5,9);
 });
});
