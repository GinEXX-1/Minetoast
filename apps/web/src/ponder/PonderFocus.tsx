import {lazy,Suspense,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {animationFrame} from '../../../../packages/ponder/src/animation';
import {MathCraftIcon,mathCraftDesigns} from '../MathCraftIcon';
import Formula from '../Formula';
import {createMathModel,animateParameters,constrain,defaults,jumpTimeline,nextTimeline,startTimeline,stepParameters,tickTimeline,type Timeline} from '../../../../packages/ponder/src/runtime';
import {beginProgress,progressKey,updateProgress} from '../../../../packages/ponder/src/progress';
import type {SceneDefinition} from '../../../../packages/ponder/src/schema';
import {assertExecutableScene} from '../../../../packages/ponder/src/validation';
import type {RendererProps} from './types';
import CoordinateRenderer from './CoordinateRenderer';
import GeometryRenderer from './GeometryRenderer';
import {openSettings,usePreferences} from '../settings/preferences';
const SolidGeometryRenderer=lazy(()=>import('./SolidGeometryRenderer'));
const rendererRegistry={coordinate:CoordinateRenderer,geometry:GeometryRenderer,solid:SolidGeometryRenderer};
export default function PonderFocus({definition,onExit}:{definition:SceneDefinition;onExit:()=>void}){
 const model=useMemo(()=>createMathModel(assertExecutableScene(definition)),[definition]),scene=model.scene;
 const [systemReduced,setSystemReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [motionOverride,setMotionOverride]=useState<boolean|null>(null);
 const reduced=motionOverride===null?systemReduced:!motionOverride;
 const [timeline,setTimeline]=useState(()=>({...startTimeline(scene),playing:!systemReduced})),[parameters,setParameters]=useState(()=>systemReduced?stepParameters(scene,0,scene.steps[0].duration):defaults(scene));
 const [storageError,setStorageError]=useState(false),[showAuxiliary,setShowAuxiliary]=useState(true),[cameraReset,setCameraReset]=useState(0);
 const preferences=usePreferences(),comfort=preferences.comfort,setComfort=(value:boolean)=>preferences.update({comfort:value});
 const [hidden,setHidden]=useState(()=>document.hidden);
 const dialog=useRef<HTMLDialogElement>(null),exit=useRef(onExit);exit.current=onExit;
 const progress=useRef(beginProgress(scene,null)),loadedProgress=useRef(false);
 const state=useRef(timeline),baseline=useRef(parameters),values=useRef(parameters);
 const resetSnapshot=useRef<{timeline:Timeline;parameters:typeof parameters;baseline:typeof parameters}|null>(null);
 const setValues=useCallback((next:typeof parameters)=>{values.current=next;setParameters(next);},[]);
 const currentStep=scene.steps[timeline.step],Renderer=rendererRegistry[scene.renderer];
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)'),changed=()=>setSystemReduced(query.matches),visibility=()=>setHidden(document.hidden);query.addEventListener('change',changed);document.addEventListener('visibilitychange',visibility);return()=>{query.removeEventListener('change',changed);document.removeEventListener('visibilitychange',visibility);};},[]);
 useEffect(()=>{
  const element=dialog.current!,previous=document.activeElement as HTMLElement|null,scroll=document.body.style.overflow;
  element.showModal();element.querySelector<HTMLElement>('.ponder-stage')?.focus();document.body.style.overflow='hidden';
  if(!loadedProgress.current){loadedProgress.current=true;try{progress.current=beginProgress(scene,JSON.parse(localStorage.getItem(progressKey(scene))??'null'));}catch{setStorageError(true);}}
  return()=>{element.close();document.body.style.overflow=scroll;previous?.focus();};
 },[scene]);
 const save=useCallback((next:Timeline,interaction=false)=>{
  progress.current=updateProgress(progress.current,next,interaction);
  try{localStorage.setItem(progressKey(scene),JSON.stringify(progress.current));}catch{setStorageError(true);}
 },[scene]);
 const apply=useCallback((requested:Timeline,staticMode=reduced)=>{const next=staticMode?{...requested,playing:false}:requested;baseline.current=stepParameters(scene,next.step,0);state.current=next;setTimeline(next);setValues(animateParameters(scene,next.step,staticMode?scene.steps[next.step].duration:next.elapsed,baseline.current));save(next);},[scene,reduced,save,setValues]);
 useEffect(()=>{
  const reset=(event:Event)=>{
   const detail=(event as CustomEvent<{keys:string[];operation?:'reset'|'restore'}>).detail;
   if(!detail?.keys.includes(progressKey(scene)))return;
   try{const saved=JSON.parse(localStorage.getItem(progressKey(scene))??'null'),fresh=beginProgress(scene,saved);progress.current={...fresh,replayCount:saved?Math.max(0,fresh.replayCount-1):0};}catch{progress.current=beginProgress(scene,null);setStorageError(true);}
   if(detail.operation==='restore'&&resetSnapshot.current){const snapshot=resetSnapshot.current;resetSnapshot.current=null;const next={...snapshot.timeline,playing:false};baseline.current=snapshot.baseline;state.current=next;setTimeline(next);setValues(snapshot.parameters);}
   else{resetSnapshot.current={timeline:state.current,parameters:values.current,baseline:baseline.current};apply({...startTimeline(scene),playing:false});}
  };
  window.addEventListener('kw:progress-reset',reset);return()=>window.removeEventListener('kw:progress-reset',reset);
 },[scene,apply,setValues]);
 const advance=useCallback(()=>{const previous=state.current;baseline.current=scene.steps[previous.step].interaction.length?values.current:animateParameters(scene,previous.step,scene.steps[previous.step].duration,baseline.current);const requested=nextTimeline(scene,previous),next=reduced?{...requested,playing:false}:requested;state.current=next;setTimeline(next);setValues(animateParameters(scene,next.step,reduced?scene.steps[next.step].duration:next.elapsed,baseline.current));save(next);},[scene,reduced,save,setValues]);
 const jump=useCallback((step:number)=>apply(jumpTimeline(scene,state.current,step)),[scene,apply]);
 const changeMotion=useCallback((enabled:boolean)=>{setMotionOverride(enabled);apply({...jumpTimeline(scene,state.current,state.current.step),playing:enabled&&!scene.steps[state.current.step].interaction.length},!enabled);},[scene,apply]);
 useEffect(()=>{if(reduced){const next={...state.current,playing:false};state.current=next;setTimeline(next);setValues(animateParameters(scene,next.step,scene.steps[next.step].duration,baseline.current));}},[reduced,scene,setValues]);
 const play=useCallback(()=>{
  const current=state.current;if(current.complete)return;
  if(scene.steps[current.step].interaction.length){advance();return;}
  if(reduced){changeMotion(true);return;}
  const next={...current,playing:!current.playing};state.current=next;setTimeline(next);
 },[scene,advance,reduced,changeMotion]);
 useEffect(()=>{
  save(timeline);
 },[timeline.step,timeline.complete,save]);
 useEffect(()=>{
  if(!timeline.playing||hidden||reduced)return;let frame=0,last=performance.now();
  const tick=(now:number)=>{
   {const seconds=Math.min(.1,(now-last)/1000)*(comfort ? .65 : 1);last=now;
    const previous=state.current,next=tickTimeline(scene,previous,seconds);state.current=next;
    const changed=next.step!==previous.step||next.playing!==previous.playing||next.complete!==previous.complete;
    if(next.step!==previous.step)baseline.current=animateParameters(scene,previous.step,scene.steps[previous.step].duration,baseline.current);
    if(changed||!reduced){setTimeline(next);setValues(animateParameters(scene,next.step,reduced?scene.steps[next.step].duration:next.elapsed,baseline.current));}
    if(next.step!==previous.step||next.complete!==previous.complete)save(next);
    if(!next.playing)return;
   }frame=requestAnimationFrame(tick);
  };frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[timeline.playing,scene,reduced,hidden,save,comfort,setValues]);
 const updateParameter=useCallback((key:string,value:number)=>{const adjusted=constrain(scene,values.current,key,value);baseline.current=adjusted;setValues(adjusted);const next={...state.current,playing:false};state.current=next;setTimeline(next);save(next,true);},[scene,save,setValues]);
 const interaction=useCallback(()=>save(state.current,true),[save]);
 const frame=animationFrame(scene,timeline.step,timeline.elapsed,reduced||timeline.complete||currentStep.interaction.length>0||!timeline.playing&&timeline.elapsed===0);
 if(!timeline.playing)frame.caption=true;
 const props:RendererProps={frame,reduced,model,parameters,step:currentStep,interactive:currentStep.interaction.length>0,onParameter:updateParameter,onInteraction:interaction,showAuxiliary,cameraReset};
 const restart=()=>{progress.current={...progress.current,replayCount:progress.current.replayCount+1};apply(startTimeline(scene));};
 return <dialog ref={dialog} className="ponder-focus" data-caption-placement={scene.scene.captionPlacement} aria-labelledby="ponder-title" onClose={event=>event.stopPropagation()} onCancel={event=>{event.preventDefault();event.stopPropagation();exit.current();}} onKeyDown={event=>{
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();exit.current();return;}
  const tag=(event.target as HTMLElement).tagName;
  if(['INPUT','SELECT','TEXTAREA'].includes(tag))return;
  if(tag==='BUTTON'&&event.code==='Space')return;
  if(event.code==='Space'){event.preventDefault();play();}else if(event.key==='ArrowLeft'){event.preventDefault();jump(state.current.step-1);}else if(event.key==='ArrowRight'){event.preventDefault();advance();}
 }}>
  <header className="ponder-hud"><span className="ponder-item-icon"><MathCraftIcon nodeId={mathCraftDesigns[scene.nodeId]?scene.nodeId:"MS-GEO-COORD-001"} decorative/></span><div><span>思索 · 数学原理</span><h2 id="ponder-title">{scene.title}</h2></div><span className="ponder-counter" aria-label="步骤进度">{timeline.step+1} / {scene.steps.length}</span><button onClick={onExit} aria-label="退出思索">结束思索</button></header>
  <div className="ponder-theatre" data-caption-placement={scene.scene.captionPlacement}><main className="ponder-stage" tabIndex={0} aria-label="数学演示舞台"><Suspense fallback={<p role="status">三维场景加载中…</p>}><Renderer {...props}/></Suspense></main>
  {currentStep.readouts.some(id=>scene.readouts.find(r=>r.id===id)?.range)&&<aside className="ponder-measurements" aria-label="函数值比较">{currentStep.readouts.map(id=>{const r=scene.readouts.find(x=>x.id===id)!,value=model.value(r.expression,parameters);return r.range&&<div key={id}><span>{r.label}</span><strong>{value.toFixed(2)}</strong><div className="ponder-meter"><i style={{width:`${Math.max(0,Math.min(1,(value-r.range[0])/(r.range[1]-r.range[0])))*100}%`}}/></div><small>{r.range[0]}<span>{r.range[1]}</span></small></div>;})}</aside>}
  <section className="ponder-caption" data-caption-visible={frame.caption} aria-live="polite" aria-atomic="true"><span>{String(timeline.step+1).padStart(2,'0')} · {currentStep.title}</span><p>{currentStep.caption}</p>{currentStep.formula&&<div className="ponder-formula-reveal" data-visible={frame.formula}><Formula latex={currentStep.formula}/></div>}</section><div className="ponder-stage-badge">{scene.renderer==='solid'?'空间构造':scene.renderer==='geometry'?'几何构造':'函数观察'}<span>{currentStep.interaction.length?'自由操作':reduced?'静态模式':timeline.playing?'演示中':'已暂停'}</span></div></div>
  <div className="ponder-experiment-bar">{currentStep.interaction.length>0&&<section className="ponder-interaction" aria-label="数学实验参数">{currentStep.interaction.map(key=>{const p=scene.parameters[key];return <label key={key}>{p.label}<output data-testid={`value-${key}`}>{parameters[key].toFixed(2)}</output><input type="range" aria-label={p.label} min={p.min} max={p.max} step={p.step} value={parameters[key]} onChange={event=>updateParameter(key,Number(event.target.value))}/></label>;})}</section>}
  {currentStep.readouts.length>0&&<p className="ponder-live-values" data-testid="ponder-readouts">{currentStep.readouts.map(id=>{const r=scene.readouts.find(x=>x.id===id)!;return <span key={id}>{r.label} = {model.value(r.expression,parameters).toFixed(2)}　</span>;})}</p>}
  {scene.renderer==='solid'&&<div className="ponder-camera-controls"><button onClick={()=>{setCameraReset(n=>n+1);interaction();}}>恢复最佳视角</button><label><input type="checkbox" checked={showAuxiliary} onChange={event=>{setShowAuxiliary(event.target.checked);interaction();}}/>显示辅助线</label></div>}</div>
  <nav className="ponder-timeline" aria-label="步骤时间轴">{scene.steps.map((step,i)=><button key={step.id} aria-current={i===timeline.step?'step':undefined} onClick={()=>jump(i)} style={{'--step-progress':`${i<timeline.step?100:i===timeline.step?frame.progress*100:0}%`} as React.CSSProperties}><b>{i+1}</b><span>{step.title}</span></button>)}</nav>
  <footer className="ponder-controls"><button disabled={timeline.step===0} onClick={()=>jump(timeline.step-1)}>上一步</button><button className="ponder-primary" disabled={timeline.complete} onClick={play}>{currentStep.interaction.length?'继续思索':reduced?'播放动画':timeline.playing?'暂停':'播放'}</button><button onClick={advance} disabled={timeline.complete}>{timeline.step===scene.steps.length-1?'完成观看':'下一步'}</button><button onClick={()=>reduced?changeMotion(true):apply({...jumpTimeline(scene,state.current,state.current.step),playing:currentStep.interaction.length===0})}>重播本步</button><button onClick={restart}>重新开始</button><button onClick={()=>{if(state.current.playing){const next={...state.current,playing:false};state.current=next;setTimeline(next);}openSettings();}}>设置</button><label className="ponder-motion"><input type="checkbox" checked={!reduced} onChange={e=>changeMotion(e.target.checked)}/>启用动画</label><label className="ponder-comfort"><input type="checkbox" checked={comfort} onChange={e=>setComfort(e.target.checked)}/>舒适阅读</label></footer>
  {reduced&&<p className="ponder-status" role="status">静态模式{systemReduced?"：浏览器启用了减少动态效果。":"。"}可点击“播放动画”或勾选“启用动画”观看动态构造。</p>}
  {timeline.complete&&<p className="ponder-completion" role="status">已观看原理演示</p>}
  {timeline.step===scene.steps.length-1&&!timeline.complete&&timeline.visited.length<scene.steps.length-1&&<p className="ponder-status">可自由跳转。浏览各步骤后再记录完成观看。</p>}
  {storageError&&<p role="status" className="ponder-status">本机存储不可用；当前演示仍可操作。</p>}
  <details className="ponder-transcript"><summary>文字说明与键盘操作</summary><p>在演示舞台按 Space 播放或暂停，← 上一步，→ 下一步，Esc 退出。参数可使用键盘方向键调节。</p>{scene.steps.map((s,i)=><p key={s.id}><b>{i+1}. {s.title}</b>：{s.semanticLabel}</p>)}<p>教材范围：{scene.textbook.scope}</p></details>
 </dialog>;
}
