import type {ReactNode} from 'react';
import type {NodeStatus} from '../../../packages/domain/src/index';
import './knowledge-node-frame.css';

export type FrameLevel='normal'|'core'|'key';
export type FrameState=NodeStatus;
export const frameLevels:readonly FrameLevel[]=['normal','core','key'];
export const frameStates:readonly FrameState[]=['locked','available','unlocked'];
export const frameLevelLabels:Record<FrameLevel,string>={normal:'普通节点',core:'核心节点',key:'关键成就'};
export const frameStateLabels:Record<FrameState,string>={locked:'未解锁',available:'可解锁',unlocked:'已掌握'};

/** Tier is ontology metadata, never a consequence of learning progress. O(1). */
export function frameLevelFor(importance:number,isKeyAchievement:boolean):FrameLevel{
 return isKeyAchievement?'key':importance>=4?'core':'normal';
}

export interface KnowledgeNodeFrameProps{
 level:FrameLevel;
 state:FrameState;
 name?:string;
 ariaLabel?:string;
 selected?:boolean;
 icon?:ReactNode;
 className?:string;
 onClick?:()=>void;
}

/** One DOM/CSS construction produces all nine combinations; no raster frame atlas. */
export function KnowledgeNodeFrame({level,state,name='测试占位',ariaLabel,selected=false,icon,className='',onClick}:KnowledgeNodeFrameProps){
 return <div
  className={`kw-frame kw-frame--${level} kw-frame--${state}${selected?' kw-frame--selected':''}${className?' '+className:''}`}
  data-level={level}
  data-state={state}
  data-selected={selected}
  role={onClick?'button':'img'}
  tabIndex={onClick?0:undefined}
  aria-label={ariaLabel??`${name}，${frameLevelLabels[level]}，${frameStateLabels[state]}`}
  aria-pressed={onClick?selected:undefined}
  title={`${name} · ${frameLevelLabels[level]} · ${frameStateLabels[state]}`}
  onClick={event=>{if(onClick){event.stopPropagation();onClick();}}}
  onKeyDown={event=>{if(onClick&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.stopPropagation();onClick();}}}
 >
  <span className="kw-frame__rail" aria-hidden="true"/>
  <span className="kw-frame__corner kw-frame__corner--tl" aria-hidden="true"/>
  <span className="kw-frame__corner kw-frame__corner--tr" aria-hidden="true"/>
  <span className="kw-frame__corner kw-frame__corner--bl" aria-hidden="true"/>
  <span className="kw-frame__corner kw-frame__corner--br" aria-hidden="true"/>
  <span className="kw-frame__icon-safe" aria-hidden="true">
   {icon??<svg className="kw-frame__placeholder" width="48" height="48" viewBox="0 0 16 16" shapeRendering="crispEdges" focusable="false">
    <path d="M4 2h8v2H4zM2 4h2v8H2zM12 4h2v8h-2zM4 12h8v2H4zM7 5h2v6H7zM5 7h6v2H5z" fill="currentColor"/>
   </svg>}
  </span>
  <span className="kw-frame__state-marker" aria-hidden="true"/>
 </div>;
}
