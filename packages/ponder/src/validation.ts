import {createMathModel,defaults,constrain,stepParameters,cross,dot,type Parameters} from './runtime';
import {sceneSchema,type SceneDefinition} from './schema';
import {parseExpression,evaluateAst} from './expression';
/** Numerical smoke validation is evidence, not a proof of arbitrary mathematical claims. */
export function validateMathematics(input:unknown):string[]{
 const parsed=sceneSchema.safeParse(input);if(!parsed.success)return parsed.error.issues.map(i=>i.message);
 const scene=parsed.data,issues=new Set<string>();
 try{
  const model=createMathModel(scene),base=defaults(scene),cases:Parameters[]=[base];
  for(const [key,p] of Object.entries(scene.parameters))for(const value of [p.min,p.max,(p.min+p.max)/2])cases.push(constrain(scene,base,key,value));
  for(let i=0;i<scene.steps.length;i++)for(const t of [0,.25,.5,.75,1])cases.push(stepParameters(scene,i,scene.steps[i].duration*t));
  const asts=Object.fromEntries(Object.entries(scene.expressions).map(([key,x])=>[key,parseExpression(x)]));
  for(const [key,ast] of Object.entries(asts))try{evaluateAst(ast,{...base,x:1},asts,[key]);}catch(e){issues.add(`Expression ${key}: ${String(e)}`);}
  for(const p of cases){
   for(const c of scene.constraints)if(p[c.lower]+c.gap>p[c.upper]+1e-10)issues.add('Parameter ordering violation');
   for(const r of scene.readouts)try{model.value(r.expression,p);}catch(e){issues.add(`${r.id}: ${String(e)}`);}
   for(const o of scene.objects){try{
    if(o.kind==='plot'){// Undefined plot samples create gaps; reject an entirely undefined graph.
     if(o.end){const end=model.value(o.end,p);if(end<o.domain[0]-1e-8||end>o.domain[1]+1e-8)issues.add(`Plot endpoint outside domain ${o.id}`);}
     let valid=0;for(let i=0;i<=24;i++)try{model.value(o.expression,p,{x:o.domain[0]+(o.domain[1]-o.domain[0])*i/24});valid++;}catch{/* A domain gap is represented without a connecting stroke. */}if(!valid)issues.add(`Plot ${o.id} entirely undefined`);
     }else if(o.kind==='parametric'){
     const end=o.end?model.value(o.end,p):o.domain[1];if(end<o.domain[0]-1e-8||end>o.domain[1]+1e-8)issues.add(`Parametric endpoint outside domain ${o.id}`);
     for(let i=0;i<=24;i++){const x=o.domain[0]+(o.domain[1]-o.domain[0])*i/24;model.value(o.x,p,{x});model.value(o.y,p,{x});}
    }else if(o.kind==='polygon')o.vertices.forEach(v=>model.v2(v,p));
    else if(o.kind==='samples'){o.points.forEach(v=>model.v2(v,p));if(o.count)model.value(o.count,p);}
    else if(o.kind==='region'){const a=model.v2(o.bounds[0],p),b=model.v2(o.bounds[1],p);if(a[0]>=b[0]||a[1]>=b[1])issues.add(`Invalid region bounds ${o.id}`);}
    else if(o.kind==='point'||o.kind==='label')model.v2(o.at,p);
    else if(o.kind==='segment'){model.v2(o.from,p);model.v2(o.to,p);}
    else if(o.kind==='circle'){model.v2(o.center,p);if(model.value(o.radius,p)<=0)issues.add(`Nonpositive radius ${o.id}`);}
    else if(o.kind==='line'){model.v2(o.through,p);if(Math.hypot(...model.v2(o.direction,p))<1e-8)issues.add(`Degenerate line ${o.id}`);}
    else if(o.kind==='intersections')model.intersections(o,p);
    else if(o.kind==='angleMarker'){model.v2(o.origin,p);const a=model.v2(o.first,p),b=model.v2(o.second,p);if(Math.hypot(...a)<1e-8||Math.hypot(...b)<1e-8||Math.abs(dot(a,b))>1e-8)issues.add(`Invalid right angle ${o.id}`);}
    else if(o.kind==='angleMarker3'){model.v3(o.origin,p);const a=model.v3(o.first,p),b=model.v3(o.second,p);if(Math.hypot(...a)<1e-8||Math.hypot(...b)<1e-8||Math.abs(dot(a,b))>1e-8)issues.add(`Invalid 3D right angle ${o.id}`);}
    else if(o.kind==='plane'){model.v3(o.origin,p);if(Math.hypot(...cross(model.v3(o.u,p),model.v3(o.v,p)))<1e-8)issues.add(`Degenerate plane ${o.id}`);}
    else if(o.kind==='line3'){model.v3(o.origin,p);if(Math.hypot(...model.v3(o.direction,p))<1e-8)issues.add(`Degenerate 3D line ${o.id}`);}
    else if(o.kind==='segment3'){model.v3(o.from,p);model.v3(o.to,p);}
    else if(o.kind==='arc3'){model.v3(o.origin,p);const u=model.v3(o.u,p),v=model.v3(o.v,p);if(Math.abs(Math.hypot(...u)-1)>1e-8||Math.abs(Math.hypot(...v)-1)>1e-8||Math.abs(dot(u,v))>1e-8||model.value(o.radius,p)<=0||model.value(o.angle,p)<0||model.value(o.angle,p)>2*Math.PI)issues.add(`Invalid 3D arc ${o.id}`);}
    else model.v3(o.at,p);
   }catch(e){issues.add(`${o.id}: ${String(e)}`);}}
  }
 }catch(e){issues.add(String(e));}
 return [...issues];
}
export function assertExecutableScene(scene:SceneDefinition){const issues=validateMathematics(scene);if(issues.length)throw new Error(issues.join('\n'));return scene;}
