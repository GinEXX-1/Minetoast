import {z} from 'zod';
const name=z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,47}$/).refine(s=>!['constructor','prototype','__proto__'].includes(s));
const expr=z.string().min(1).max(256);
const vec2=z.tuple([expr,expr]),vec3=z.tuple([expr,expr,expr]);
const common={id:name,label:z.string().max(120),color:z.enum(['cyan','gold','green','muted']).default('cyan')};
export const objectSchema=z.discriminatedUnion('kind',[
 z.object({...common,kind:z.literal('parametric'),x:expr,y:expr,domain:z.tuple([z.number(),z.number()]),end:expr.optional()}).strict(),
 z.object({...common,kind:z.literal('polygon'),vertices:z.array(vec2).min(3).max(32),opacity:z.number().min(0).max(.6).default(.22)}).strict(),
 z.object({...common,kind:z.literal('label'),at:vec2}).strict(),
 z.object({...common,kind:z.literal('samples'),points:z.array(vec2).min(1).max(512),count:expr.optional(),connect:z.boolean().default(false)}).strict(),
 z.object({...common,kind:z.literal('region'),operation:z.enum(['union','intersection','complement']),first:name,second:name.optional(),bounds:z.tuple([vec2,vec2]),opacity:z.number().min(.1).max(.6).default(.32)}).strict(),
 z.object({...common,kind:z.literal('plot'),expression:expr,domain:z.tuple([z.number(),z.number()]),end:expr.optional()}).strict(),
 z.object({...common,kind:z.literal('point'),at:vec2,draggable:name.optional()}).strict(),
 z.object({...common,kind:z.literal('segment'),from:vec2,to:vec2,dashed:z.boolean().default(false),arrow:z.boolean().default(false)}).strict(),
 z.object({...common,kind:z.literal('circle'),center:vec2,radius:expr}).strict(),
 z.object({...common,kind:z.literal('line'),through:vec2,direction:vec2}).strict(),
 z.object({...common,kind:z.literal('intersections'),circle:name,line:name}).strict(),
 z.object({...common,kind:z.literal('angleMarker'),origin:vec2,first:vec2,second:vec2}).strict(),
 z.object({...common,kind:z.literal('plane'),origin:vec3,u:vec3,v:vec3,size:z.number().positive().max(10)}).strict(),
 z.object({...common,kind:z.literal('line3'),origin:vec3,direction:vec3,length:z.number().positive().max(20),auxiliary:z.boolean().default(false)}).strict(),
 z.object({...common,kind:z.literal('segment3'),from:vec3,to:vec3,auxiliary:z.boolean().default(false)}).strict(),
 z.object({...common,kind:z.literal('arc3'),origin:vec3,u:vec3,v:vec3,radius:expr,angle:expr,auxiliary:z.boolean().default(false)}).strict(),
 z.object({...common,kind:z.literal('angleMarker3'),origin:vec3,first:vec3,second:vec3,size:z.number().positive().max(2),auxiliary:z.boolean().default(true)}).strict(),
 z.object({...common,kind:z.literal('point3'),at:vec3}).strict(),
]);
export const patterns=['OBSERVE_PATTERN','COMPARE_PATTERN','TRANSFORM_PATTERN','CONSTRUCT_PATTERN','DERIVE_PATTERN','PARAMETER_PATTERN','INVARIANT_PATTERN','SPATIAL_REASONING'] as const;
const parameter=z.object({min:z.number().finite(),max:z.number().finite(),default:z.number().finite(),step:z.number().positive().finite(),label:z.string().min(1).max(80)}).strict().refine(p=>p.min<p.max&&p.default>=p.min&&p.default<=p.max&&p.step<=p.max-p.min,{message:'Invalid parameter bounds'});
export const sceneSchema=z.object({
 id:z.string().min(1).max(100),version:z.literal(1),dslVersion:z.literal(1),nodeId:z.string().min(1).max(100),title:z.string().min(1).max(100),
 renderer:z.enum(['coordinate','geometry','solid']),
 pedagogy:z.object({primary:z.enum(patterns),secondary:z.array(z.enum(patterns)).max(3).default([])}).strict(),
 duration:z.number().min(30).max(180),
 scene:z.object({captionPlacement:z.enum(['overlay','below']).default('overlay'),axes:z.boolean().default(false),xRange:z.tuple([z.number().finite(),z.number().finite()]),yRange:z.tuple([z.number().finite(),z.number().finite()]),camera:z.tuple([z.number().finite(),z.number().finite(),z.number().finite()]).default([5,4,6])}).strict().refine(s=>s.xRange[0]<s.xRange[1]&&s.yRange[0]<s.yRange[1]),
 parameters:z.record(name,parameter),expressions:z.record(name,expr),objects:z.array(objectSchema).min(1).max(64),
 readouts:z.array(z.object({id:name,label:z.string().min(1).max(80),expression:expr,range:z.tuple([z.number().finite(),z.number().finite()]).refine(r=>r[0]<r[1]).optional()}).strict()).max(16).default([]),
 constraints:z.array(z.object({kind:z.literal('ordered'),lower:name,upper:name,gap:z.number().positive().finite()}).strict()).max(8).default([]),
 steps:z.array(z.object({id:name,title:z.string().min(1).max(60),caption:z.string().min(1).max(240),semanticLabel:z.string().min(1).max(500),duration:z.number().min(1).max(60),
  show:z.array(name).max(64),readouts:z.array(name).max(16).default([]),highlight:z.array(name).max(64).default([]),formula:z.string().max(500).optional(),interaction:z.array(name).max(16).default([]),
  cues:z.array(z.object({target:name,kind:z.enum(['draw','reveal','pulse']),start:z.number().min(0),duration:z.number().positive().max(60)}).strict()).max(64).default([]),
  narration:z.object({captionAt:z.number().min(0).default(0),formulaAt:z.number().min(0).default(0)}).strict().default({captionAt:0,formulaAt:0}),
  animate:z.array(z.object({parameter:name,from:z.number().finite(),to:z.number().finite(),start:z.number().min(0).default(0),duration:z.number().positive().max(60).optional(),easing:z.enum(['linear','smooth']).default('linear')}).strict()).max(8).default([]),camera:z.tuple([z.number().finite(),z.number().finite(),z.number().finite()]).optional(),
 }).strict()).min(3).max(8),
 controls:z.object({supportsScrub:z.boolean().default(false),allowCameraRotation:z.boolean().default(true)}).strict(),
 completion:z.object({principleViewed:z.literal(true)}).strict(),
 textbook:z.object({sourceRef:z.string().min(1).max(200),scope:z.string().min(1).max(500)}).strict(),
}).strict().superRefine((s,ctx)=>{
 const ids=new Set(s.objects.map(o=>o.id)),parameters=new Set(Object.keys(s.parameters));
 const issue=(message:string)=>ctx.addIssue({code:'custom',message});
 const total=s.steps.reduce((sum,step)=>sum+step.duration,0);if(total<30||total>180||Math.abs(total-s.duration)>0.01)issue('Duration must equal step estimates within 30-180 seconds');
 if(ids.size!==s.objects.length||new Set(s.steps.map(x=>x.id)).size!==s.steps.length)issue('Duplicate IDs');
 if(Object.keys(s.parameters).length>16||Object.keys(s.expressions).length>16)issue('Expression/parameter budget exceeded');
 if(Object.keys(s.expressions).some(key=>parameters.has(key)||['x','pi','sin','cos','tan','sqrt','abs','exp','log','min','max','floor','frequency'].includes(key))||Object.keys(s.parameters).some(key=>['x','pi','sin','cos','tan','sqrt','abs','exp','log','min','max','floor','frequency'].includes(key)))issue('Expression namespace collision');
 const constrained=new Set<string>();for(const c of s.constraints){if(constrained.has(c.lower)||constrained.has(c.upper))issue('V1 constraints must use disjoint pairs');constrained.add(c.lower);constrained.add(c.upper);}
 for(const c of s.constraints){if(!parameters.has(c.lower)||!parameters.has(c.upper)||c.lower===c.upper)issue('Constraint reference invalid');else if(s.parameters[c.lower].default+c.gap>s.parameters[c.upper].default||s.parameters[c.lower].min+c.gap>s.parameters[c.upper].max)issue('Unsatisfiable default constraint');}
 if(new Set(s.readouts.map(r=>r.id)).size!==s.readouts.length)issue('Duplicate readout IDs');
 for(const step of s.steps){for(const cue of step.cues)if(!step.show.includes(cue.target)||cue.start+cue.duration>step.duration)issue('Invalid cue target or timing');if(step.narration.captionAt>=step.duration||step.narration.formulaAt>=step.duration)issue('Narration outside step');for(const id of step.readouts)if(!s.readouts.some(r=>r.id===id))issue('Unknown readout');for(const id of [...step.show,...step.highlight])if(!ids.has(id))issue(`Unknown object ${id}`);for(const p of step.interaction)if(!parameters.has(p))issue(`Unknown interaction ${p}`);for(const a of step.animate){const p=s.parameters[a.parameter];if(a.start>=step.duration||a.start+(a.duration??step.duration-a.start)>step.duration)issue('Animation outside step');if(!p||Math.min(a.from,a.to)<p.min||Math.max(a.from,a.to)>p.max)issue('Invalid animation bounds');}}
 for(const o of s.objects){if(o.kind==='region'){if(!s.objects.some(x=>x.id===o.first&&x.kind==='circle')||(o.operation!=='complement'&&!s.objects.some(x=>x.id===o.second&&x.kind==='circle')))issue('Region requires circle references');}if(o.kind==='intersections'){if(!s.objects.some(x=>x.id===o.circle&&x.kind==='circle')||!s.objects.some(x=>x.id===o.line&&x.kind==='line'))issue('Intersection references invalid');}if(s.renderer==='solid'&&!['plane','point3','line3','segment3','arc3','angleMarker3'].includes(o.kind)||s.renderer!=='solid'&&['plane','point3','line3','segment3','arc3','angleMarker3'].includes(o.kind))issue('Object unsupported by renderer');if((o.kind==='plot'||o.kind==='parametric')&&o.domain[0]>=o.domain[1])issue('Invalid plot domain');if(o.kind==='point'&&o.draggable&&!parameters.has(o.draggable))issue('Invalid draggable parameter');}
});
export type SceneDefinition=z.infer<typeof sceneSchema>;
export type SceneObject=z.infer<typeof objectSchema>;
export type PonderDemo={id:string;nodeId:string;type:'PRINCIPLE'|'DERIVATION'|'INTERACTIVE_EXPERIMENT'|'APPLICATION';title:string;status:'CANDIDATE'|'REVIEW_REQUIRED'|'PASS'|'FAIL';isPrimary:boolean;suitability:'HIGH'|'MEDIUM'|'LOW'|'NONE';version:number;dslVersion:number;createdAt:string;updatedAt:string;scene:SceneDefinition};
