import {useEffect,useRef,useState,type ReactNode,type RefObject} from 'react';
import {ControlButton,Controls,useReactFlow} from '@xyflow/react';
import './world-motion.css';

export const motionDuration=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:280;

export function useDrawerMotion(dialog:RefObject<HTMLDialogElement|null>,onClose:()=>void){
 const [closing,setClosing]=useState(false);
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{if(!closing)return;const timer=window.setTimeout(()=>closeRef.current(),motionDuration());return()=>clearTimeout(timer);},[closing]);
 useEffect(()=>{const element=dialog.current;if(!element)return;let target=element.scrollTop,timer:number|undefined;
  const wheel=(event:WheelEvent)=>{if(event.ctrlKey||motionDuration()===0)return;const nested=(event.target as Element).closest('.world-formula');if(nested&&nested.scrollWidth>nested.clientWidth)return;if(timer===undefined)target=element.scrollTop;const delta=event.deltaY*(event.deltaMode===1?20:event.deltaMode===2?element.clientHeight:1);if(!delta)return;event.preventDefault();target=Math.max(0,Math.min(element.scrollHeight-element.clientHeight,target+delta));element.scrollTo({top:target,behavior:'smooth'});window.clearTimeout(timer);timer=window.setTimeout(()=>{target=element.scrollTop;timer=undefined;},250);};
  element.addEventListener('wheel',wheel,{passive:false});return()=>{element.removeEventListener('wheel',wheel);window.clearTimeout(timer);};
 },[dialog]);
 return {closing,close:()=>setClosing(true)};
}

export function SwipeToast({children,className='',onDismiss}:{children:ReactNode;className?:string;onDismiss:()=>void}){
 const [offset,setOffset]=useState(0),[leaving,setLeaving]=useState(false),[dragging,setDragging]=useState(false);const start=useRef<number|null>(null);
 useEffect(()=>{if(!leaving)return;const timer=window.setTimeout(onDismiss,motionDuration());return()=>clearTimeout(timer);},[leaving,onDismiss]);
 return <div className={`${className} motion-toast${leaving?' is-leaving':''}${dragging?' is-dragging':''}`}  style={{'--toast-drag':`${offset}px`} as React.CSSProperties} onPointerDown={event=>{if(event.button!==0)return;setDragging(true);start.current=event.clientX;event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{if(start.current!==null)setOffset(Math.max(0,event.clientX-start.current));}} onPointerUp={()=>{setDragging(false);start.current=null;if(offset>65)setLeaving(true);else setOffset(0);}} onPointerCancel={()=>{setDragging(false);start.current=null;setOffset(0);}}>{children}<button className="motion-toast-close" aria-label="关闭通知" onClick={()=>setLeaving(true)}>×</button></div>;
}

export function SmoothControls({position='top-left'}:{position?:'top-left'|'bottom-left'}){
 const flow=useReactFlow();
 return <Controls showZoom={false} showFitView={false} showInteractive={false} position={position}><ControlButton aria-label="Zoom In" onClick={()=>void flow.zoomIn({duration:motionDuration()})}>+</ControlButton><ControlButton aria-label="Zoom Out" onClick={()=>void flow.zoomOut({duration:motionDuration()})}>−</ControlButton><ControlButton aria-label="Fit View" onClick={()=>void flow.fitView({padding:.18,duration:motionDuration()})}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4v2H4v2h-2zm8-4h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm10 0h2v4h-4v-2h2v-2z"/></svg></ControlButton></Controls>;
}

export function PageMotion(){
 useEffect(()=>{const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const anchor=(event.target as Element).closest('a');if(!anchor||anchor.target||anchor.hasAttribute('download'))return;const url=new URL(anchor.href);if(url.origin!==location.origin||url.pathname===location.pathname||motionDuration()===0)return;event.preventDefault();document.documentElement.classList.add('page-leaving');window.setTimeout(()=>location.assign(url.href),180);};const restore=()=>document.documentElement.classList.remove('page-leaving');document.addEventListener('click',click);window.addEventListener('pageshow',restore);return()=>{document.removeEventListener('click',click);window.removeEventListener('pageshow',restore);};},[]);
 return null;
}
