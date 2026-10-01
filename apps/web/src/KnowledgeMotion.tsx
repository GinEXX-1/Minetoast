import {useCallback,useEffect,useRef,type CSSProperties,type ReactNode,type RefObject} from 'react';
import {ControlButton,Controls,useReactFlow} from '@xyflow/react';
import './knowledge-motion.css';

export const motionTime=(duration:number)=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:duration;
const smoothEase=(progress:number)=>progress<.5?4*progress*progress*progress:1-(-2*progress+2)**3/2;

const sparks=Array.from({length:24},(_,index)=>{
 const angle=index*Math.PI*2/24;
 const distance=54+(index%4)*15;
 return {'--spark-x':`${Math.cos(angle)*distance}px`,'--spark-y':`${Math.sin(angle)*distance+16}px`,'--spark-delay':`${index%3*24}ms`,'--spark-size':`${3+index%3}px`} as CSSProperties;
});

/** Small fixed particle budget; decorative elements never receive pointer events. */
export function PixelBurst({important=false}:{important?:boolean}){
 return <span className={`kw-pixel-burst${important?' is-important':''}`} aria-hidden="true"><i className="kw-burst-ring"/>{sparks.filter((_,index)=>important||index%2===0).map((style,index)=><i className="kw-spark" key={index} style={style}/>)}</span>;
}

export function useAnimatedDrawer(ref:RefObject<HTMLDialogElement|null>,onClose:()=>void){
 const onCloseRef=useRef(onClose);onCloseRef.current=onClose;
 const animation=useRef<Animation|null>(null),closing=useRef(false);
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  if(!element.open)element.showModal();
  animation.current=element.animate([{transform:'translateX(100%)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:motionTime(280),easing:'linear'});
  return()=>animation.current?.cancel();
 },[ref]);
 const close=useCallback(()=>{
  const element=ref.current;if(!element||closing.current)return;
  closing.current=true;
  const style=getComputedStyle(element),transform=style.transform,opacity=style.opacity;
  animation.current?.cancel();
  const duration=motionTime(220);
  if(!duration){onCloseRef.current();return;}
  element.dataset.closing='true';
  animation.current=element.animate([{transform,opacity},{transform:'translateX(100%)',opacity:0}],{duration,easing:'linear',fill:'forwards'});
  animation.current.onfinish=()=>onCloseRef.current();
 },[ref]);
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  let target=element.scrollTop,frame=0,last=0;
  const cancel=()=>{cancelAnimationFrame(frame);frame=0;target=element.scrollTop;};
  const step=(now:number)=>{
   const dt=Math.min(32,now-last||16);last=now;
   const next=element.scrollTop+(target-element.scrollTop)*(1-Math.exp(-dt/65));
   element.scrollTop=next;
   if(Math.abs(target-element.scrollTop)<2){element.scrollTop=target;frame=0;return;}
   frame=requestAnimationFrame(step);
  };
  const wheel=(event:WheelEvent)=>{
   if(event.ctrlKey||motionTime(1)===0||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
   // Keep nested formula scrollers and browser zoom native.
   const nested=(event.target as Element).closest('.formula');
   if(nested&&nested.scrollWidth>nested.clientWidth)return;
   if(!frame)target=element.scrollTop;
   const delta=event.deltaY*(event.deltaMode===1?18:event.deltaMode===2?element.clientHeight:1);
   if(!delta)return;
   event.preventDefault();target=Math.max(0,Math.min(element.scrollHeight-element.clientHeight,target+delta));
   if(!frame){last=performance.now();frame=requestAnimationFrame(step);}
  };
  element.addEventListener('wheel',wheel,{passive:false});element.addEventListener('pointerdown',cancel);element.addEventListener('keydown',cancel);
  return()=>{cancel();element.removeEventListener('wheel',wheel);element.removeEventListener('pointerdown',cancel);element.removeEventListener('keydown',cancel);};
 },[ref]);
 return close;
}

export function MotionToast({children,onDismiss,important=false}:{children:ReactNode;onDismiss:()=>void;important?:boolean}){
 const element=useRef<HTMLDivElement>(null),animation=useRef<Animation|null>(null),dismiss=useRef(onDismiss);dismiss.current=onDismiss;
 const state=useRef({x:0,start:0,dragging:false,leaving:false,lastX:0,lastAt:0,velocity:0,hovering:false,focused:false});
 const timer=useRef<number|undefined>(undefined),remaining=useRef(4500),started=useRef(0);
 const leave=useCallback(()=>{
  const node=element.current;if(!node||state.current.leaving)return;
  state.current.leaving=true;window.clearTimeout(timer.current);animation.current?.cancel();
  const duration=motionTime(220);
  if(!duration){dismiss.current();return;}
  animation.current=node.animate([{transform:`translateX(${state.current.x}px)`,opacity:1},{transform:`translateX(${node.offsetWidth+32}px)`,opacity:0}],{duration,easing:'linear',fill:'forwards'});
  animation.current.onfinish=()=>dismiss.current();
 },[]);
 const pause=useCallback(()=>{if(timer.current!==undefined){window.clearTimeout(timer.current);timer.current=undefined;remaining.current=Math.max(0,remaining.current-(performance.now()-started.current));}},[]);
 const resume=useCallback(()=>{if(state.current.leaving||state.current.dragging||state.current.hovering||state.current.focused||timer.current!==undefined)return;started.current=performance.now();timer.current=window.setTimeout(leave,remaining.current);},[leave]);
 useEffect(()=>{const node=element.current;if(!node)return;animation.current=node.animate([{transform:'translateX(calc(100% + 32px))',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:motionTime(260),easing:'linear'});resume();return()=>{window.clearTimeout(timer.current);timer.current=undefined;animation.current?.cancel();};},[resume]);
 const reset=()=>{const node=element.current;if(!node)return;animation.current?.cancel();animation.current=node.animate([{transform:`translateX(${state.current.x}px)`},{transform:'translateX(0)'}],{duration:motionTime(160),easing:'linear'});state.current.x=0;node.style.transform='';resume();};
 return <div ref={element} className={`kw-motion-toast${important?' key':''}`} onPointerEnter={()=>{state.current.hovering=true;pause();}} onPointerLeave={()=>{state.current.hovering=false;resume();}} onFocusCapture={()=>{state.current.focused=true;pause();}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null)){state.current.focused=false;resume();}}}
  onPointerDown={event=>{if(event.button!==0||(event.target as Element).closest('button,a'))return;pause();animation.current?.cancel();state.current={...state.current,start:event.clientX,lastX:event.clientX,lastAt:performance.now(),velocity:0,dragging:true};event.currentTarget.setPointerCapture(event.pointerId);}}
  onPointerMove={event=>{const drag=state.current;if(!drag.dragging)return;const now=performance.now();drag.velocity=(event.clientX-drag.lastX)/Math.max(1,now-drag.lastAt);drag.lastX=event.clientX;drag.lastAt=now;drag.x=Math.max(0,event.clientX-drag.start);event.currentTarget.style.transform=`translateX(${drag.x}px)`;}}
  onPointerUp={event=>{const drag=state.current;if(!drag.dragging)return;drag.dragging=false;event.currentTarget.releasePointerCapture(event.pointerId);if(drag.x>Math.min(100,event.currentTarget.offsetWidth*.3)||(drag.x>24&&drag.velocity>.5))leave();else reset();}}
  onPointerCancel={()=>{state.current.dragging=false;reset();}}>
  {important&&<PixelBurst important/>}{children}<button className="kw-toast-dismiss" aria-label="关闭通知" onClick={leave}>×</button>
 </div>;
}

/** Animate mouse-wheel zoom around the pointer; retain native trackpad pinch. */
export function useSmoothGraphWheel(ref:RefObject<HTMLElement|null>){
 const flow=useReactFlow();
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  let frame=0,last=0,target=flow.getViewport();
  const cancel=()=>{cancelAnimationFrame(frame);frame=0;};
  const step=(now:number)=>{
   const current=flow.getViewport(),factor=1-Math.exp(-Math.min(32,now-last||16)/55);last=now;
   const next={x:current.x+(target.x-current.x)*factor,y:current.y+(target.y-current.y)*factor,zoom:current.zoom+(target.zoom-current.zoom)*factor};
   const settled=Math.abs(next.zoom-target.zoom)<.0002&&Math.abs(next.x-target.x)<.2&&Math.abs(next.y-target.y)<.2;
   void flow.setViewport(settled?target:next,{duration:0});
   frame=settled?0:requestAnimationFrame(step);
  };
  const wheel=(event:WheelEvent)=>{
   if(event.ctrlKey){cancel();return;}if((event.target as Element).closest('.react-flow__minimap,.react-flow__controls'))return;
   if(!frame)target=flow.getViewport();
   const bounds=element.getBoundingClientRect(),x=event.clientX-bounds.left,y=event.clientY-bounds.top;
   const delta=event.deltaY*(event.deltaMode===1?18:event.deltaMode===2?bounds.height:1);
   if(!delta)return;event.preventDefault();event.stopPropagation();
   const zoom=Math.max(.04,Math.min(1.8,target.zoom*Math.exp(-Math.max(-180,Math.min(180,delta))*.002)));
   const ratio=zoom/target.zoom;target={x:x-(x-target.x)*ratio,y:y-(y-target.y)*ratio,zoom};
   if(!motionTime(1)){void flow.setViewport(target,{duration:0});return;}
   if(!frame){last=performance.now();frame=requestAnimationFrame(step);}
  };
  element.addEventListener('wheel',wheel,{capture:true,passive:false});element.addEventListener('pointerdown',cancel);
  return()=>{cancel();element.removeEventListener('wheel',wheel,true);element.removeEventListener('pointerdown',cancel);};
 },[flow,ref]);
}

export function MotionControls({position='top-left'}:{position?:'top-left'|'bottom-left'}){
 const flow=useReactFlow();
 const zoom=(direction:1|-1)=>{
  const current=flow.getZoom(),step=Math.max(.12,current*.4);
  const target=Math.max(.04,Math.min(1.8,current+direction*step));
  void flow.zoomTo(target,{duration:motionTime(520),ease:smoothEase,interpolate:'linear'});
 };
 return <Controls position={position} showZoom={false} showFitView={false} showInteractive={false}>
  <ControlButton aria-label="Zoom In" onClick={()=>zoom(1)}><svg viewBox="0 0 16 16"><path d="M7 2h2v5h5v2H9v5H7V9H2V7h5z"/></svg></ControlButton>
  <ControlButton aria-label="Zoom Out" onClick={()=>zoom(-1)}><svg viewBox="0 0 16 16"><path d="M2 7h12v2H2z"/></svg></ControlButton>
  <ControlButton aria-label="Fit View" onClick={()=>void flow.fitView({padding:.18,duration:motionTime(480),ease:smoothEase,interpolate:'smooth'})}><svg viewBox="0 0 16 16"><path d="M2 6V2h4v2H4v2zm8-4h4v4h-2V4h-2zM2 10h2v2h2v2H2zm10 0h2v4h-4v-2h2z"/></svg></ControlButton>
 </Controls>;
}

/** Cross-document View Transitions preserve native link navigation and history. */
export function PageMotion(){
 useEffect(()=>{
  if(Reflect.has(window,'PageSwapEvent'))return;
  let timer:number|undefined;
  const entrance=document.getElementById('root')?.animate([{opacity:0},{opacity:1}],{duration:motionTime(180),easing:'linear'});
  const restore=()=>document.getElementById('root')?.classList.remove('kw-page-exit');
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!motionTime(1))return;
   const link=(event.target as Element).closest('a');if(!link||link.target||link.download)return;
   const url=new URL(link.href);if(url.origin!==location.origin||(url.pathname===location.pathname&&url.search===location.search))return;
   event.preventDefault();if(timer!==undefined)return;document.getElementById('root')?.classList.add('kw-page-exit');timer=window.setTimeout(()=>location.assign(url.href),160);
  };
  document.addEventListener('click',click);window.addEventListener('pageshow',restore);
  return()=>{entrance?.cancel();window.clearTimeout(timer);document.removeEventListener('click',click);window.removeEventListener('pageshow',restore);};
 },[]);
 return null;
}
