import React,{lazy,memo,Suspense,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ReactFlow,Background,BaseEdge,Handle,MarkerType,MiniMap,Position,useReactFlow,useViewport,type Node as FlowNode,type Edge as FlowEdge,type NodeProps,type EdgeProps} from '@xyflow/react';
import type {NodeStatus,PathQuery} from '../../../packages/domain/src/index';
import type {KnowledgeNodeDetail} from '../../../packages/domain/src/knowledge-node-detail';
import {startLayout} from './workers/layout';
import {KnowledgeNodeFrame} from './KnowledgeNodeFrame';
import {MathCraftIcon} from './MathCraftIcon';
import {KnowledgeWorldBrand} from './KnowledgeWorldBrand';
import {emptyWorldProgress,fallbackWorldPositions,finishWorldInitialization,initializeWorldTarget,parseWorldProgress,searchWorld,summarizeInitializationFeedback,unlockWorldNode,worldDetailById,worldGraph,worldIndex,worldKeys,worldModuleIds,worldNodes,worldPath,worldProgressCounts,worldProgressStorageKey,worldStatuses,type WorldProgress} from './function-world-model';
import './function-world.css';
import './function-world-p3.css';
import './function-world-wiki.css';
import {MotionControls,MotionToast,PixelBurst,useAnimatedDrawer,useSmoothGraphWheel} from './KnowledgeMotion';

const Formula=lazy(()=>import('./Formula'));
const statusLabels:Record<NodeStatus,string>={locked:'未满足前置',available:'可以解锁',unlocked:'已掌握'};
type Tier='normal'|'core'|'key';
interface CardData{nodeId:string;name:string;achievement:string;summary:string;module:string;status:NodeStatus;tier:Tier;dim:boolean;focused:boolean;targetPulse:boolean;particleToken:number;ancestorPulse:boolean;wake:boolean;initializing:boolean;reviewRequired:boolean;onActivate:(id:string)=>void;}
const WorldCard=memo(function WorldCard({data}:NodeProps){
 const d=data as unknown as CardData;
 return <div className={`world-card ${d.status} ${d.tier}${d.dim?' dim':''}${d.focused?' focused':''}${d.targetPulse?' target-pulse':''}${d.ancestorPulse?' ancestor-pulse':''}${d.wake?' wake':''}`} data-testid={`world-node-${d.nodeId}`} data-status={d.status} data-tier={d.tier} title={`${d.name} · ${d.achievement} · ${statusLabels[d.status]}`}>
  <Handle type="target" position={Position.Top}/>
  <KnowledgeNodeFrame level={d.tier} state={d.status} name={d.name} selected={d.focused} icon={<MathCraftIcon nodeId={d.nodeId} decorative/>} onClick={()=>d.onActivate(d.nodeId)}/>
  {d.reviewRequired&&<span className="world-review-dot" title="内容证据仍需复核" aria-label="内容证据仍需复核">!</span>}
  {d.targetPulse&&<PixelBurst key={d.particleToken} important={d.tier==='key'}/>}
  <Handle type="source" position={Position.Bottom}/>
 </div>;
});
interface EdgeData{weak:boolean;completed:boolean;dim:boolean;highlight:boolean;energy:boolean;}
const WorldEdge=memo(function WorldEdge(props:EdgeProps){
 const d=props.data as unknown as EdgeData,middle=(props.sourceY+props.targetY)/2;
 const path=`M ${props.sourceX} ${props.sourceY} V ${middle} H ${props.targetX} V ${props.targetY}`;
 return <><BaseEdge path={path} markerEnd={props.markerEnd} style={{stroke:d.highlight?'#e9d18d':d.weak?'#718477':d.completed?'#9fcba2':'#657467',strokeWidth:d.highlight?3:d.weak?1.5:2.2,strokeDasharray:d.weak?'4 6':d.completed?undefined:'5 4',opacity:d.dim?.15:1}}/>{d.energy&&<path className="world-edge-energy" d={path} pathLength={1} fill="none" pointerEvents="none"/>}</>;
});
const nodeTypes={world:WorldCard},edgeTypes={world:WorldEdge};
type Toast={id:number;text:string;key:boolean;nodeId?:string};
type Transient={token:number;targetId:string|null;ancestorIds:readonly string[];wakeIds:readonly string[]};
const noTransient:Transient={token:0,targetId:null,ancestorIds:[],wakeIds:[]};

/** Screen-space overlay: it stays above all graph nodes and never inherits their scale/filter. */
function WorldHoverCard({nodeId,positions,statuses,initializing,size}:{nodeId:string|null;positions:Record<string,{x:number;y:number}>;statuses:Record<string,NodeStatus>;initializing:boolean;size:{width:number;height:number}}){
 const viewport=useViewport();
 if(!nodeId)return null;
 const node=worldNodes.get(nodeId),detail=worldDetailById.get(nodeId),position=positions[nodeId];
 if(!node||!detail||!position)return null;
 const width=Math.min(264,Math.max(180,size.width-24)),nodeLeft=position.x*viewport.zoom+viewport.x,nodeTop=position.y*viewport.zoom+viewport.y;
 if(nodeLeft+100*viewport.zoom<0||nodeLeft>size.width||nodeTop+100*viewport.zoom<0||nodeTop>size.height)return null;
 const preferredLeft=nodeLeft+100*viewport.zoom+16;
 const left=Math.max(12,Math.min(preferredLeft+width>size.width-12?nodeLeft-width-16:preferredLeft,size.width-width-12));
 const top=Math.max(54,Math.min(nodeTop,size.height-170));
 return <div className="world-node-tooltip" role="status" aria-label={`${node.canonicalName}节点信息`} style={{left,top,width}}>
  <strong>{node.canonicalName}</strong><small>{node.achievementName}</small><em>{initializing?'点击加入进度':statusLabels[statuses[nodeId]]}</em><p>{detail.overview}</p>
 </div>;
}

function WorldToasts({toasts,inDrawer=false,onDismiss}:{toasts:Toast[];inDrawer?:boolean;onDismiss:(id:number)=>void}){
 return <div className={`world-toasts${inDrawer?' world-toasts--drawer':''}`} aria-live="polite">{toasts.map(t=><MotionToast key={t.id} important={t.key} onDismiss={()=>onDismiss(t.id)}>{t.nodeId?<><MathCraftIcon nodeId={t.nodeId} decorative width={36} height={36}/><span><strong>{t.key?'关键成就达成':'知识解锁'}</strong><b>{t.text}</b><small>{worldNodes.get(t.nodeId)?.achievementName}</small></span></>:<span>{t.text}</span>}</MotionToast>)}</div>;
}

function WorldDrawer({detail,status,toasts,onDismiss,onClose,onNavigate,onUnlock,onPath}:{detail:KnowledgeNodeDetail;status:NodeStatus;toasts:Toast[];onDismiss:(id:number)=>void;onClose:()=>void;onNavigate:(id:string)=>void;onUnlock:(id:string)=>void;onPath:(query:PathQuery)=>void}){
 const dialog=useRef<HTMLDialogElement>(null),id=detail.identity.nodeId;
 const close=useAnimatedDrawer(dialog,onClose);
 useEffect(()=>{if(dialog.current)dialog.current.scrollTop=0;},[id]);
 return <dialog ref={dialog} className="world-drawer" aria-label={`${detail.identity.knowledgeName}知识详情`} onCancel={event=>{event.preventDefault();close();}} onClose={onClose}>
  <WorldToasts toasts={toasts} inDrawer onDismiss={onDismiss}/>
  <div className="world-drawer-head"><span>Knowledge Detail · {detail.metadata.gateStatus}</span><button aria-label="关闭详情" onClick={close}>关闭</button></div>
  <h2>{detail.identity.knowledgeName}</h2><p className="world-achievement">{detail.identity.achievementName} · {detail.identity.englishName}</p>
  <div className="world-detail-meta"><span>{statusLabels[status]}</span><span>重要度 {detail.metadata.importance}/5</span><span>难度 {detail.metadata.difficulty}/5</span><span>证据 {detail.metadata.evidenceStatus}</span></div>
  {detail.metadata.gateStatus==='REVIEW_REQUIRED'&&<p className="world-evidence-warning">教材证据仅覆盖该概念的部分使用情境。完整定义来源尚待复核；当前质量状态未提升。</p>}
  <p className="world-overview">{detail.overview}</p>
  <section><h3>定义</h3><p>{detail.definition}</p></section>
  <section><h3>核心概念</h3><ul>{detail.coreConcepts.map(x=><li key={x}>{x}</li>)}</ul></section>
  <section><h3>公式与适用范围</h3>{detail.formulas.map(f=><div key={f.id} className="world-formula"><Suspense fallback={<p>公式加载中…</p>}><Formula latex={f.latex}/></Suspense><p>{f.conditions}</p></div>)}</section>
  <section><h3>性质与直觉</h3><ul>{detail.properties.map((x,i)=><li key={i}>{x}</li>)}</ul><p>{detail.intuition}</p></section>
  <section><h3>推理与技能</h3><p>{detail.derivation}</p><ul>{detail.skills.map(x=><li key={x}>{x}</li>)}</ul></section>
  <section><h3>例题</h3>{detail.examples.map((e,i)=><div className="world-example" key={i}><p><b>问题</b>{e.problem}</p><p><b>识别</b>{e.recognition}</p><p><b>推理</b>{e.reasoning}</p><p><b>计算</b>{e.calculation}</p><p><b>答案</b>{e.answer}</p><p><b>回看</b>{e.insight}</p></div>)}</section>
  <section><h3>常见高考任务</h3><ul>{detail.gaokaoPatterns.map(x=><li key={x}>{x}</li>)}</ul></section>
  <section><h3>易错点</h3>{detail.commonMistakes.map((m,i)=><div key={i} className="world-mistake"><b>{m.mistake}</b><p>原因：{m.why}</p><p>修正：{m.correction}</p></div>)}</section>
  <section><h3>教材出处</h3>{detail.textbookReferences.map((r,i)=><p className="world-reference" key={i}>{r.volume} · {r.chapter} · {r.section??'章内栏目'} · {r.subsection}<br/>印刷页 {r.printedPage??'REVIEW_REQUIRED'} · PDF页 {r.pdfPage??'REVIEW_REQUIRED'} · {r.sourceRef}<br/>{r.evidenceStatus} · {r.scopeNote}</p>)}</section>
  <section><h3>知识关系</h3><p className="world-drawer-note">关系来自 Phase 2B 已启用图；Weak 不参与解锁。</p><h4>前置</h4>{detail.relationships.incoming.length?detail.relationships.incoming.map(r=><div className="world-relation" key={r.edgeId}><span><b>{r.dependencyType.toUpperCase()}</b> {r.knowledgeName}<small>{r.rationale}</small></span><button onClick={()=>onNavigate(r.nodeId)}>定位并查看</button></div>):<p>本切片的入口节点。</p>}<h4>后继</h4>{detail.relationships.outgoing.length?detail.relationships.outgoing.map(r=><div className="world-relation" key={r.edgeId}><span><b>{r.dependencyType.toUpperCase()}</b> {r.knowledgeName}<small>{r.rationale}</small></span><button onClick={()=>onNavigate(r.nodeId)}>定位并查看</button></div>):<p>当前没有后继节点。</p>}</section>
  <div className="world-drawer-actions"><button onClick={()=>onPath({mode:'to',nodeId:id})}>我怎样学到这里？</button><button onClick={()=>onPath({mode:'from',nodeId:id})}>学会它以后能去哪？</button>{status==='available'&&<button className="world-primary" onClick={()=>onUnlock(id)}>解锁这个知识</button>}</div>
 </dialog>;
}

export default function FunctionWorld(){
 const flow=useReactFlow();
 const [progress,setProgress]=useState<WorldProgress>(()=>{try{return parseWorldProgress(localStorage.getItem(worldProgressStorageKey));}catch{return emptyWorldProgress();}});
 const progressRef=useRef(progress),clickAudioRef=useRef<HTMLAudioElement|null>(null),completeAudioRef=useRef<HTMLAudioElement|null>(null),toastCounter=useRef(0);
 const [storageError,setStorageError]=useState(false),[showWeak,setShowWeak]=useState(false);
 const [positions,setPositions]=useState(fallbackWorldPositions),[layoutWarning,setLayoutWarning]=useState('');
 const [selectedId,setSelectedId]=useState<string|null>(null),[focusedId,setFocusedId]=useState<string|null>(null),[hoveredId,setHoveredId]=useState<string|null>(null);
 const focusedIdRef=useRef(focusedId);focusedIdRef.current=focusedId;
 const graphRef=useRef<HTMLElement>(null),feedbackCounter=useRef(0),feedbackTimers=useRef(new Set<number>());
 useSmoothGraphWheel(graphRef);
 const [graphSize,setGraphSize]=useState({width:1000,height:600});
 const [activeModule,setActiveModule]=useState<string|null>(null),[search,setSearch]=useState('');
 const activeModuleRef=useRef(activeModule);activeModuleRef.current=activeModule;
 const [betweenFrom,setBetweenFrom]=useState(''),[betweenTo,setBetweenTo]=useState(''),[pathQuery,setPathQuery]=useState<PathQuery|null>(null);
 const [transient,setTransient]=useState<Transient>(noTransient),[toasts,setToasts]=useState<Toast[]>([]);
 const unlocked=useMemo(()=>new Set(progress.unlockedNodeIds),[progress.unlockedNodeIds]);
 const statuses=useMemo(()=>worldStatuses(progress),[progress]);
 const counts=useMemo(()=>worldProgressCounts(progress),[progress]);
 const searchResult=useMemo(()=>searchWorld(search),[search]);
 const pathResult=useMemo(()=>pathQuery?worldPath(pathQuery,showWeak):null,[pathQuery,showWeak]);
 const pathIds=useMemo(()=>new Set(pathResult?.nodeIds??[]),[pathResult]);
 const pathEdgeIds=useMemo(()=>new Set(pathResult?.edgeIds??[]),[pathResult]);
 const selectedDetail=selectedId?worldDetailById.get(selectedId):undefined;
 const connected=useMemo(()=>new Set(hoveredId?[hoveredId,...(worldIndex.directConnections.get(hoveredId)??[])]:[]),[hoveredId]);

 useEffect(()=>{const element=graphRef.current;if(!element)return;const observer=new ResizeObserver(([entry])=>setGraphSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>()=>{for(const timer of feedbackTimers.current)window.clearTimeout(timer);feedbackTimers.current.clear();},[]);
 useEffect(()=>{const task=startLayout(worldGraph,{direction:'DOWN',nodeWidth:100,nodeHeight:100,nodeSpacing:54,layerSpacing:110});let active=true;task.result.then(value=>{if(active)setPositions(value);}).catch(()=>{if(active)setLayoutWarning('自动布局不可用，已使用稳定 DAG 布局。');});return()=>{active=false;task.cancel();};},[]);
 useEffect(()=>{try{localStorage.setItem(worldProgressStorageKey,JSON.stringify(progress));setStorageError(false);}catch{setStorageError(true);}},[progress]);
 useEffect(()=>{const timer=window.setTimeout(()=>{const module=activeModuleRef.current,id=focusedIdRef.current,p=id?positions[id]:null;if(module)void flow.fitView({nodes:(worldModuleIds.get(module)??[]).map(nodeId=>({id:nodeId})),padding:.35,duration:0});else if(p)void flow.setCenter(p.x+50,p.y+50,{zoom:1.08,duration:0});else void flow.fitView({padding:.18,duration:0});},80);return()=>window.clearTimeout(timer);},[positions,flow,graphSize.width,graphSize.height]);

 const commit=useCallback((next:WorldProgress)=>{progressRef.current=next;setProgress(next);},[]);
 const scheduleFeedback=useCallback((callback:()=>void,duration:number)=>{const timer=window.setTimeout(()=>{feedbackTimers.current.delete(timer);callback();},duration);feedbackTimers.current.add(timer);},[]);
 const addToast=useCallback((text:string,key=false,nodeId?:string)=>{const id=++toastCounter.current;setToasts(v=>[...v,{id,text,key,nodeId}].slice(-3));},[]);
 const markTransient=useCallback((targetId:string|null,ancestorIds:readonly string[],wakeIds:readonly string[])=>{const token=++feedbackCounter.current;setTransient({token,targetId,ancestorIds,wakeIds});scheduleFeedback(()=>setTransient(v=>v.token===token?noTransient:v),1250);},[scheduleFeedback]);
 const playClickSound=useCallback(()=>{const audio=clickAudioRef.current??new Audio('/audio/click_stereo.ogg');clickAudioRef.current=audio;audio.preload='auto';try{audio.currentTime=0;}catch{/* Asset metadata may still be loading. */}void audio.play().catch(()=>{/* Audio must never block node interaction. */});},[]);
 const playSound=useCallback((key:boolean)=>{if(!key)return;const audio=completeAudioRef.current??new Audio('/audio/Challenge_complete.ogg');completeAudioRef.current=audio;audio.preload='auto';try{audio.currentTime=0;}catch{/* Asset metadata may still be loading. */}void audio.play().catch(()=>{/* Unlock state must not depend on audio playback. */});},[]);
 const initialize=useCallback((id:string)=>{const result=initializeWorldTarget(progressRef.current,id),feedback=summarizeInitializationFeedback(result.addedTargetId,result.addedAncestorIds);commit(result.next);setFocusedId(id);markTransient(result.addedTargetId,feedback.ancestorPulseIds,[]);if(feedback.toastText)addToast(feedback.toastText,!!result.addedTargetId&&worldKeys.has(id),id);if(result.addedTargetId)playSound(worldKeys.has(id));},[commit,markTransient,addToast,playSound]);
 const unlock=useCallback((id:string)=>{const before=progressRef.current,beforeStatuses=worldStatuses(before),result=unlockWorldNode(before,id);if(!result.unlocked)return;commit(result.next);const afterStatuses=worldStatuses(result.next);const wakeIds=Object.keys(afterStatuses).filter(nodeId=>beforeStatuses[nodeId]==='locked'&&afterStatuses[nodeId]==='available');markTransient(id,[],wakeIds);const key=worldKeys.has(id);addToast(worldNodes.get(id)?.canonicalName??id,key,id);playSound(key);},[commit,markTransient,addToast,playSound]);
 const flyTo=useCallback((id:string)=>{setFocusedId(id);const p=positions[id];if(p)void flow.setCenter(p.x+50,p.y+50,{zoom:1.08,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:420});},[positions,flow]);
 const navigateTo=useCallback((id:string)=>{flyTo(id);setSelectedId(id);},[flyTo]);
 const showPath=useCallback((query:PathQuery)=>{setPathQuery(query);setSelectedId(null);},[]);
 const activateNode=useCallback((id:string)=>{setHoveredId(null);if(!progressRef.current.initialized){initialize(id);return;}unlock(id);setFocusedId(id);setSelectedId(id);},[initialize,unlock]);
 const onNodeClick=useCallback((_:unknown,node:{id:string})=>activateNode(node.id),[activateNode]);
 const moduleFocus=useCallback((module:string|null)=>{setActiveModule(module);if(!module){void flow.fitView({padding:.18,duration:300});return;}const ids=worldModuleIds.get(module)??[];void flow.fitView({nodes:ids.map(id=>({id})),padding:.35,duration:300});},[flow]);

 const nodes=useMemo<FlowNode[]>(()=>worldGraph.nodes.map(n=>{const o=worldNodes.get(n.id)!,detail=worldDetailById.get(n.id)!;const tier:Tier=worldKeys.has(n.id)?'key':o.importance>=4?'core':'normal';const dim=hoveredId?!connected.has(n.id):pathResult?!pathIds.has(n.id):activeModule?o.module!==activeModule:false;return {id:n.id,type:'world',position:positions[n.id]??{x:0,y:0},width:100,height:100,data:{nodeId:n.id,name:o.canonicalName,achievement:o.achievementName,summary:detail.overview,module:o.module,status:statuses[n.id] as NodeStatus,tier,dim,focused:focusedId===n.id,targetPulse:transient.targetId===n.id,particleToken:transient.token,ancestorPulse:transient.ancestorIds.includes(n.id),wake:transient.wakeIds.includes(n.id),initializing:!progress.initialized,reviewRequired:detail.metadata.gateStatus==='REVIEW_REQUIRED',onActivate:activateNode} satisfies CardData,ariaLabel:`${o.canonicalName}，${statusLabels[statuses[n.id] as NodeStatus]}${tier==='key'?'，Key Achievement':''}`,style:{opacity:dim?.35:1}};}),[positions,statuses,focusedId,hoveredId,connected,pathResult,pathIds,activeModule,transient,progress.initialized,activateNode]);
 const edges=useMemo<FlowEdge[]>(()=>worldGraph.edges.filter(e=>showWeak||e.dependencyType==='strong').map(e=>{const weak=e.dependencyType==='weak',completed=unlocked.has(e.sourceNodeId),highlight=hoveredId?e.sourceNodeId===hoveredId||e.targetNodeId===hoveredId:pathResult?pathEdgeIds.has(e.id):false;const dim=hoveredId?!highlight:pathResult?!highlight:activeModule?worldNodes.get(e.sourceNodeId)?.module!==activeModule&&worldNodes.get(e.targetNodeId)?.module!==activeModule:false;return {id:e.id,type:'world',source:e.sourceNodeId,target:e.targetNodeId,markerEnd:{type:MarkerType.ArrowClosed,color:weak?'#7e97a5':completed?'#62cb91':'#82938a'},data:{weak,completed,dim,highlight,energy:!weak&&transient.targetId===e.sourceNodeId&&transient.wakeIds.includes(e.targetNodeId)} satisfies EdgeData};}),[showWeak,unlocked,hoveredId,pathResult,pathEdgeIds,activeModule,transient]);
 const focusedName=focusedId?worldNodes.get(focusedId)?.canonicalName:null;
 return <div className="function-world" onClickCapture={playClickSound} data-feedback-token={transient.token} data-feedback-active={!!transient.targetId}>
  <header className="world-header"><div><KnowledgeWorldBrand compact href="/function-world"/><a className="world-back" href="/">← Phase 1 Legacy</a><h1>函数 · Function Knowledge World</h1><p>按知识关系探索函数，从基础走向应用。</p></div><div className="world-header-actions"><div className="world-global-progress" aria-label={`函数知识世界进度 ${counts.unlocked} / ${counts.total}`}><strong>{counts.unlocked} / {counts.total}</strong><span>{counts.percentage}% 已掌握</span><div className="world-progress-track"><i style={{width:`${counts.percentage}%`}}/></div></div></div></header>
  <aside className="world-wiki-nav" aria-label="知识世界导航"><KnowledgeWorldBrand href="/function-world"/><section><h2>导航</h2><button onClick={()=>moduleFocus(null)}>知识图谱总览</button><a href="#world-search-input">搜索知识</a><a href="#world-progress-panel">学习进度</a></section><section><h2>知识模块</h2>{counts.modules.map(m=><button key={m.id} aria-pressed={activeModule===m.id} onClick={()=>moduleFocus(m.id)}>{m.label}<small>{m.unlocked}/{m.total}</small></button>)}</section><section><h2>知识工具</h2><button onClick={()=>void flow.fitView({padding:.18,duration:300})}>显示全图</button><button disabled={!focusedId} onClick={()=>focusedId&&flyTo(focusedId)}>定位当前知识</button><button disabled={!focusedId} onClick={()=>focusedId&&setSelectedId(focusedId)}>打开知识详情</button></section></aside>
  <div className="world-wiki-content">
  {!progress.initialized&&<section className="world-init" aria-label="快速建立我的知识进度"><div><strong>快速建立我的知识进度</strong><p>点击已经掌握的目标节点，系统只补齐它的 Strong 前置与目标；可以连续选择。Weak 与旁支不会自动点亮。</p></div><button className="world-primary" onClick={()=>{commit(finishWorldInitialization(progressRef.current));addToast('我的数学知识地图已生成');}}>生成我的数学知识地图</button></section>}
  {storageError&&<p className="world-storage-warning" role="alert">浏览器无法保存本机进度；当前操作仅在此页面有效。</p>}
  <nav className="world-modules" aria-label="模块导航"><button aria-pressed={activeModule===null} onClick={()=>moduleFocus(null)}>全部 · {counts.unlocked}/{counts.total}</button>{counts.modules.map(m=><button key={m.id} aria-pressed={activeModule===m.id} onClick={()=>moduleFocus(m.id)}>{m.label} <small>{m.unlocked}/{m.total}</small></button>)}</nav>
  <section className="world-toolbar" aria-label="图谱操作"><div className="world-search"><label htmlFor="world-search-input">搜索知识</label><input id="world-search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="名称 / 拼音 / English / 公式 / 常用说法" maxLength={100}/>{search&&<div className="world-search-results" role="listbox" aria-label="搜索结果">{searchResult.nodes.slice(0,10).map(d=><button role="option" aria-selected={focusedId===d.identity.nodeId} key={d.identity.nodeId} onClick={()=>{flyTo(d.identity.nodeId);setSearch('');}}><MathCraftIcon nodeId={d.identity.nodeId} decorative width={28} height={28}/><span>{d.identity.knowledgeName}<small>{d.identity.achievementName} · {statusLabels[statuses[d.identity.nodeId] as NodeStatus]}</small></span></button>)}{searchResult.pendingScope&&<p>“左右平移”等图象变换仍在范围审核中，尚未进入 32 节点图。</p>}{!searchResult.nodes.length&&!searchResult.pendingScope&&<p>没有匹配的 Active Node。</p>}</div>}</div><button onClick={()=>void flow.fitView({padding:.18,duration:350})}>Fit View</button><button disabled={!focusedId} onClick={()=>focusedId&&flyTo(focusedId)}>Center</button><label className="world-switch"><input type="checkbox" checked={showWeak} onChange={e=>setShowWeak(e.target.checked)}/>显示完整知识关系</label></section>
  <section className="world-pathbar" aria-label="知识路径"><span>{focusedName?`当前：${focusedName}`:'点击或搜索节点以定位'}</span><button disabled={!focusedId} onClick={()=>focusedId&&showPath({mode:'to',nodeId:focusedId})}>我怎样学到这里？</button><button disabled={!focusedId} onClick={()=>focusedId&&showPath({mode:'from',nodeId:focusedId})}>学会它以后能去哪？</button><label>A 到 B <select aria-label="路径起点" value={betweenFrom} onChange={e=>setBetweenFrom(e.target.value)}><option value="">起点</option>{worldGraph.nodes.map(n=><option key={n.id} value={n.id}>{worldNodes.get(n.id)?.canonicalName}</option>)}</select><select aria-label="路径终点" value={betweenTo} onChange={e=>setBetweenTo(e.target.value)}><option value="">终点</option>{worldGraph.nodes.map(n=><option key={n.id} value={n.id}>{worldNodes.get(n.id)?.canonicalName}</option>)}</select></label><button disabled={!betweenFrom||!betweenTo} onClick={()=>showPath({mode:'between',source:betweenFrom,target:betweenTo})}>显示路径</button>{pathQuery&&<><span className="world-path-summary" role="status">{pathResult?.reachable?`${pathResult.nodeIds.length} 节点 · ${pathResult.edgeIds.length} 关系`:'未找到可达路径'}</span><button onClick={()=>setPathQuery(null)}>退出路径</button></>}<button disabled={!focusedId} onClick={()=>focusedId&&setSelectedId(focusedId)}>查看详情</button></section>
  <div className="world-main">
   <main ref={graphRef} className="world-graph" aria-label="函数知识图谱">
    <ReactFlow zoomOnScroll={false} nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} edgesFocusable={false} minZoom={.04} maxZoom={1.8} onNodeClick={onNodeClick} onNodeMouseEnter={(_,node)=>setHoveredId(node.id)} onNodeMouseLeave={()=>setHoveredId(null)} fitViewOptions={{padding:.18}} proOptions={{hideAttribution:false}}>
     <Background color="#505461" gap={32} size={1}/>
     <MotionControls/>
     <MiniMap position="top-right" pannable zoomable nodeColor={n=>n.data.status==='unlocked'?'#40aa75':n.data.status==='available'?'#d9b563':'#68717e'} maskColor="rgba(32,35,44,.65)"/>
     <WorldHoverCard nodeId={hoveredId} positions={positions} statuses={statuses} initializing={!progress.initialized} size={graphSize}/>
    </ReactFlow>
    <div className="world-legend"><span className="legend-mark legend-locked"/>未解锁<span className="legend-mark legend-available"/>可解锁<span className="legend-mark legend-unlocked"/>已掌握<span className="legend-mark legend-key"/>关键成就</div>
    {layoutWarning&&<p className="world-layout-note">{layoutWarning}</p>}
   </main>
   <aside id="world-progress-panel" className="world-sidebar"><h2>学习进度</h2><p className="world-sidebar-total" aria-label={`${counts.unlocked} / ${counts.total}，${counts.percentage}% 已掌握`}><span>{counts.unlocked} / {counts.total}</span><small>{counts.percentage}% 已掌握</small></p>{counts.modules.map(m=><div className="world-module-progress" key={m.id}><div><span>{m.label}</span><strong>{m.unlocked}/{m.total}</strong></div><div className="world-progress-track"><i style={{width:`${m.total?m.unlocked/m.total*100:0}%`}}/></div></div>)}<p className="world-side-note">进度只计实际已掌握节点。Weak 关系不参与解锁与完成率。</p><p className="world-side-note">当前进度保存在此浏览器的本机存储中。</p></aside>
  </div>
  </div>
  {!selectedDetail&&<WorldToasts toasts={toasts} onDismiss={id=>setToasts(items=>items.filter(t=>t.id!==id))}/>}
  {selectedDetail&&<WorldDrawer detail={selectedDetail} status={statuses[selectedDetail.identity.nodeId] as NodeStatus} toasts={toasts} onDismiss={id=>setToasts(items=>items.filter(t=>t.id!==id))} onClose={()=>setSelectedId(null)} onNavigate={navigateTo} onUnlock={progress.initialized?unlock:initialize} onPath={showPath}/>}
 </div>;
}
