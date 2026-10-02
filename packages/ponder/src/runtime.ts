import {sceneSchema,type SceneDefinition,type SceneObject} from './schema';
import {parseExpression,evaluateAst} from './expression';
export type Parameters=Record<string,number>;
export function defaults(scene:SceneDefinition):Parameters{return Object.fromEntries(Object.entries(scene.parameters).map(([k,v])=>[k,v.default]));}
export function constrain(scene:SceneDefinition,previous:Parameters,key:string,value:number):Parameters{
 const p=scene.parameters[key];if(!p||!Number.isFinite(value))return previous;
 const next={...previous,[key]:Math.max(p.min,Math.min(p.max,value))};
 for(const c of scene.constraints){if(c.lower===key)next[key]=Math.min(next[key],next[c.upper]-c.gap);if(c.upper===key)next[key]=Math.max(next[key],next[c.lower]+c.gap);}
 return next;
}
/** Apply only the current step tracks to a preserved experiment baseline. */
export function animateParameters(scene:SceneDefinition,index:number,elapsed:number,baseline:Parameters):Parameters{
 const step=scene.steps[index];let values=baseline;
 for(const a of step.animate){const fraction=unit((elapsed-a.start)/(a.duration??step.duration-a.start));values=constrain(scene,values,a.parameter,a.from+(a.to-a.from)*ease(a.easing,fraction));}
 return values;
}
export function stepParameters(scene:SceneDefinition,index:number,elapsed:number):Parameters{
 let values=defaults(scene);for(let i=0;i<=index;i++)values=animateParameters(scene,i,i===index?elapsed:scene.steps[i].duration,values);return values;
}
export const unit=(value:number)=>Math.max(0,Math.min(1,value));
export const ease=(kind:'linear'|'smooth',value:number)=>kind==='smooth'?value*value*(3-2*value):value;
export type Timeline={step:number;elapsed:number;playing:boolean;complete:boolean;visited:number[]};
export const startTimeline=(scene:SceneDefinition):Timeline=>({step:0,elapsed:0,playing:scene.steps[0].interaction.length===0,complete:false,visited:[]});
export function jumpTimeline(scene:SceneDefinition,state:Timeline,step:number):Timeline{return {...state,step:Math.max(0,Math.min(scene.steps.length-1,step)),elapsed:0,playing:false,complete:false};}
export function nextTimeline(scene:SceneDefinition,state:Timeline):Timeline{
 const visited=[...new Set([...state.visited,state.step])];
 if(state.step===scene.steps.length-1)return {...state,playing:false,complete:visited.length===scene.steps.length,visited};
 const step=state.step+1;return {...state,step,elapsed:0,visited,playing:scene.steps[step].interaction.length===0};
}
export function tickTimeline(scene:SceneDefinition,state:Timeline,seconds:number):Timeline{
 if(!state.playing||seconds<0||!Number.isFinite(seconds))return state;
 const elapsed=Math.min(scene.steps[state.step].duration,state.elapsed+seconds);
 if(elapsed>=scene.steps[state.step].duration)return nextTimeline(scene,{...state,elapsed});
 return {...state,elapsed};
}
export const palette={cyan:'#75d8ef',gold:'#ffd27a',green:'#8fdaa9',muted:'#8c9cae'};
export function createMathModel(input:unknown){
 const scene=sceneSchema.parse(input),expressions=Object.fromEntries(Object.entries(scene.expressions).map(([id,s])=>[id,parseExpression(s)]));
 const cache=new Map<string,ReturnType<typeof parseExpression>>();
 const value=(source:string,parameters:Parameters,extra:Parameters={})=>{let ast=cache.get(source);if(!ast){ast=parseExpression(source);cache.set(source,ast);}return evaluateAst(ast,{...parameters,...extra},expressions);};
 const v2=(sources:readonly string[],p:Parameters)=>sources.map(s=>value(s,p)) as [number,number];
 const v3=(sources:readonly string[],p:Parameters)=>sources.map(s=>value(s,p)) as [number,number,number];
 const objects=new Map(scene.objects.map(o=>[o.id,o]));
 const intersections=(object:Extract<SceneObject,{kind:'intersections'}>,p:Parameters)=>{
  const c=objects.get(object.circle),l=objects.get(object.line);if(c?.kind!=='circle'||l?.kind!=='line')throw new Error('Invalid intersection');
  const center=v2(c.center,p),r=value(c.radius,p),origin=v2(l.through,p),d=v2(l.direction,p),offset=[origin[0]-center[0],origin[1]-center[1]],a=d[0]**2+d[1]**2;
  if(a<1e-12||r<=0)throw new Error('Degenerate geometry');const b=2*(offset[0]*d[0]+offset[1]*d[1]),cc=offset[0]**2+offset[1]**2-r*r,disc=b*b-4*a*cc;
  const tolerance=1e-12*Math.max(1,b*b,Math.abs(4*a*cc));
  if(disc<-tolerance)return [];const root=Math.abs(disc)<=tolerance?0:Math.sqrt(Math.max(0,disc)),ts=root===0?[-b/(2*a)]:[(-b-root)/(2*a),(-b+root)/(2*a)];return ts.map(t=>[origin[0]+t*d[0],origin[1]+t*d[1]] as [number,number]);
 };
 return {scene,value,v2,v3,intersections};
}
export type MathModel=ReturnType<typeof createMathModel>;
export function dot(a:readonly number[],b:readonly number[]){return a.reduce((sum,x,i)=>sum+x*b[i],0);}
export function cross(a:readonly number[],b:readonly number[]):[number,number,number]{return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
