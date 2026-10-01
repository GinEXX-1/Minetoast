import {lazy,memo,Suspense,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {Background,BaseEdge,Handle,MarkerType,MiniMap,Position,ReactFlow,ReactFlowProvider,useReactFlow,useViewport,type Edge as FlowEdge,type EdgeProps,type Node as FlowNode,type NodeProps} from '@xyflow/react';
import {findKnowledgePath,strongAncestors,statusOf,type Graph} from '../../../packages/graph-core/src/index';
import type {CurriculumConcept,CurriculumSystem} from '../../../packages/domain/src/knowledge-system';
import {KnowledgeNodeFrame,frameLevelFor} from './KnowledgeNodeFrame';
import {KnowledgeWorldBrand} from './KnowledgeWorldBrand';
import {CurriculumPixelIcon} from './CurriculumPixelIcon';
import {curriculumFormulas} from './curriculum-formulas';
import {createCurriculumAudioController} from './curriculum-audio';
import {startLayout} from './workers/layout';
import './function-world.css';
import './function-world-p3.css';
import './function-world-wiki.css';
import './curriculum-system-world.css';
import {MotionControls,MotionToast,PixelBurst,useAnimatedDrawer,useSmoothGraphWheel} from './KnowledgeMotion';

const Formula=lazy(()=>import('./Formula'));
type Stage='locked'|'available'|'unlocked';
type CurriculumSystemSeed=CurriculumSystem&{graph:Graph;publicationEligible:boolean};
type Progress={initialized:boolean;unlocked:string[]};
type Path={nodeIds:string[];edgeIds:string[]};
interface NodeData {concept:CurriculumConcept;systemId:string;status:Stage;selected:boolean;dim:boolean;pulse:boolean;particles:boolean;activate:(id:string)=>void;}
interface EdgeData {weak:boolean;completed:boolean;highlight:boolean;dim:boolean;}
const statusLabel:Record<Stage,string>={locked:'未解锁',available:'可解锁',unlocked:'已掌握'};
const emptyProgress=():Progress=>({initialized:false,unlocked:[]});
const mathOperator=/[=<>≤≥∈∉⊆⊊∅∁∀∃⇒⇔¬∪∩√∑πΔ²³^+−]/;
function MathAwareText({text}:{text:string}){
 return <>{text.split(/([\u3400-\u9fff\s，。；：、“”]+)/).map((part,index)=>mathOperator.test(part)?<span className="curriculum-math-inline" key={index}>{part}</span>:part)}</>;
}

function readProgress(system:CurriculumSystemSeed):Progress{
 const key=`kw:curriculum:${system.id}:v1`,ids=new Set(system.concepts.map(concept=>concept.id));
 try{const value=JSON.parse(localStorage.getItem(key)??'null');if(value?.schemaVersion===1&&Array.isArray(value.unlocked))return {initialized:value.initialized===true,unlocked:[...new Set<string>(value.unlocked.filter((id:unknown):id is string=>typeof id==='string'&&ids.has(id)))]};}catch{/* An invalid local record starts fresh. */}
 return emptyProgress();
}
function fallbackPositions(graph:Graph,system:CurriculumSystem){
 const modules=new Map<string,string[]>(),moduleById=new Map(system.concepts.map(c=>[c.id,c.moduleId]));
 for(const node of graph.nodes){const module=moduleById.get(node.id)??'other';if(!modules.has(module))modules.set(module,[]);modules.get(module)!.push(node.id);}
 return Object.fromEntries([...modules.values()].flatMap((ids,column)=>ids.map((id,row)=>[id,{x:column*220,y:row*170}])));
}

const ConceptNode=memo(function ConceptNode({data}:NodeProps){
 const d=data as unknown as NodeData,variant=[...d.concept.id].reduce((sum,char)=>sum+char.charCodeAt(0),0);
 const tier=frameLevelFor(d.concept.importance,d.concept.isKeyAchievement);
 return <div className={`world-card curriculum-node ${d.status} ${tier}${d.selected?' focused':''}${d.dim?' dim':''}${d.pulse?' pulse target-pulse':''}`} data-testid={`curriculum-node-${d.concept.id}`} data-status={d.status} data-tier={tier}>
  <Handle type="target" position={Position.Top}/>
  <KnowledgeNodeFrame level={tier} state={d.status} name={d.concept.canonicalName} ariaLabel={`${d.concept.canonicalName}，${statusLabel[d.status]}`} selected={d.selected} icon={<CurriculumPixelIcon systemId={d.systemId} conceptName={d.concept.canonicalName} variant={variant} width={48} height={48}/>} onClick={()=>d.activate(d.concept.id)}/>
  {d.particles&&<PixelBurst important={d.concept.isKeyAchievement}/>}
  <Handle type="source" position={Position.Bottom}/>
 </div>;
});
const ConceptEdge=memo(function ConceptEdge(props:EdgeProps){
 const d=props.data as unknown as EdgeData,middle=(props.sourceY+props.targetY)/2;
 const path=`M ${props.sourceX} ${props.sourceY} V ${middle} H ${props.targetX} V ${props.targetY}`;
 return <BaseEdge path={path} markerEnd={props.markerEnd} style={{stroke:d.highlight?'#f2d172':d.weak?'#718477':d.completed?'#9fcba2':'#657467',strokeWidth:d.highlight?3:d.weak?1.5:2.2,strokeDasharray:d.weak?'4 6':d.completed?undefined:'5 4',opacity:d.dim?.15:1}}/>;
});
const nodeTypes={concept:ConceptNode},edgeTypes={concept:ConceptEdge};

function ConceptHoverCard({id,positions,statuses,size,concepts}:{id:string|null;positions:Record<string,{x:number;y:number}>;statuses:Record<string,Stage>;size:{width:number;height:number};concepts:Map<string,CurriculumConcept>}){
 const viewport=useViewport();
 if(!id)return null;
 const concept=concepts.get(id),position=positions[id];if(!concept||!position)return null;
 const left0=position.x*viewport.zoom+viewport.x,top0=position.y*viewport.zoom+viewport.y,width=Math.min(264,Math.max(180,size.width-24));
 if(left0+100*viewport.zoom<0||left0>size.width||top0+100*viewport.zoom<0||top0>size.height)return null;
 const preferred=left0+100*viewport.zoom+16,left=Math.max(12,Math.min(preferred+width>size.width-12?left0-width-16:preferred,size.width-width-12));
 const top=Math.max(54,Math.min(top0,size.height-170));
 return <div className="world-node-tooltip" role="status" aria-label={`${concept.canonicalName}节点信息`} style={{left,top,width}}><strong>{concept.canonicalName}</strong><small>{concept.achievementName}</small><em>{statusLabel[statuses[id]]}</em><p><MathAwareText text={concept.summary}/></p></div>;
}

type CurriculumToast={id:number;message:string;important:boolean};
function CurriculumToasts({toasts,onDismiss,inDrawer=false}:{toasts:CurriculumToast[];onDismiss:(id:number)=>void;inDrawer?:boolean}){
 return <div className={`world-toasts${inDrawer?' world-toasts--drawer':''}`} aria-live="polite">{toasts.map(toast=><MotionToast key={toast.id} important={toast.important} onDismiss={()=>onDismiss(toast.id)}><span>{toast.important&&<strong>关键成就达成</strong>}<b>{toast.message}</b></span></MotionToast>)}</div>;
}

function ConceptDrawer({seed,concept,status,toasts,onDismiss,onClose,onNavigate,onPath}:{seed:CurriculumSystemSeed;concept:CurriculumConcept;status:Stage;toasts:CurriculumToast[];onDismiss:(id:number)=>void;onClose:()=>void;onNavigate:(id:string)=>void;onPath:(mode:'to'|'from',id:string)=>void}){
 const dialog=useRef<HTMLDialogElement>(null),relations=seed.graph.edges.filter(edge=>edge.enabled&&(edge.sourceNodeId===concept.id||edge.targetNodeId===concept.id));
 const names=new Map(seed.concepts.map(item=>[item.id,item.canonicalName]));
 const incoming=relations.filter(edge=>edge.targetNodeId===concept.id),outgoing=relations.filter(edge=>edge.sourceNodeId===concept.id);
 const formulas=curriculumFormulas[concept.id]??[];
 const close=useAnimatedDrawer(dialog,onClose);
 useEffect(()=>{if(dialog.current)dialog.current.scrollTop=0;},[concept.id]);
 return <dialog ref={dialog} className="world-drawer curriculum-drawer" aria-label={`${concept.canonicalName}知识详情`} onCancel={event=>{event.preventDefault();close();}} onClose={onClose}>
  <CurriculumToasts toasts={toasts} onDismiss={onDismiss} inDrawer/>
  <div className="world-drawer-head"><span>Knowledge Detail · APPROVED</span><button aria-label="关闭详情" onClick={close}>关闭</button></div>
  <h2>{concept.canonicalName}</h2><p className="world-achievement">{concept.achievementName} · {seed.nameZh}</p>
  <div className="world-detail-meta"><span>{statusLabel[status]}</span><span>重要度 {concept.importance}/5</span><span>难度 {concept.difficulty}/5</span><span>证据 {concept.sources[0]?.evidence.evidenceStatus??'REVIEW_REQUIRED'}</span></div>
  <p className="world-evidence-warning">本知识体系已通过审核。节点保留候选标识，用于区分体系页面与正式发布图谱。</p>
  <p className="world-overview"><MathAwareText text={concept.summary}/></p>
  <section><h3>定义与范围</h3><p><MathAwareText text={concept.summary}/></p></section>
  <section><h3>核心概念</h3><ul><li>{concept.achievementName}</li>{concept.isKeyAchievement&&concept.keyAchievementRationale&&<li>{concept.keyAchievementRationale}</li>}</ul></section>
  <section><h3>公式与适用范围</h3>{formulas.length?formulas.map((item,index)=><div className="world-formula" key={`${concept.id}-${index}`}><Suspense fallback={<p>公式加载中…</p>}><Formula latex={item.latex}/></Suspense><p>{item.conditions}</p></div>):<p>该知识点没有独立记录的公式。</p>}</section>
  <section><h3>学习目标与应用</h3><p>{concept.achievementName}</p>{concept.mathNotationAliases.length>0&&<p>符号：{concept.mathNotationAliases.join('、')}</p>}</section>
  <section><h3>教材出处</h3>{concept.sources.map(source=><p className="world-reference" key={`${source.sourceRef}-${source.printedPage}`}><b>{source.volume} · {source.sourceRef}</b><br/>印刷页 {source.printedPage} · PDF页 {source.pdfPage}<br/>{source.evidence.evidenceStatus} · <MathAwareText text={source.evidence.summary}/><br/>{source.scopeNote}</p>)}</section>
  <section><h3>知识关系</h3><p className="world-drawer-note">Strong 参与解锁，Weak 仅供理解与导航。</p><h4>前置</h4>{incoming.length?incoming.map(edge=><div className="world-relation" key={edge.id}><span><b>{edge.dependencyType.toUpperCase()}</b> {names.get(edge.sourceNodeId)}<small>{edge.rationale}</small></span><button onClick={()=>onNavigate(edge.sourceNodeId)}>定位并查看</button></div>):<p>本体系图谱的入口节点。</p>}<h4>后继</h4>{outgoing.length?outgoing.map(edge=><div className="world-relation" key={edge.id}><span><b>{edge.dependencyType.toUpperCase()}</b> {names.get(edge.targetNodeId)}<small>{edge.rationale}</small></span><button onClick={()=>onNavigate(edge.targetNodeId)}>定位并查看</button></div>):<p>当前没有后继节点。</p>}</section>
  <div className="world-drawer-actions"><button onClick={()=>onPath('to',concept.id)}>我怎样学到这里？</button><button onClick={()=>onPath('from',concept.id)}>学会它以后能去哪？</button></div>
 </dialog>;
}

function SystemGraph({seed}:{seed:CurriculumSystemSeed}){
 const graph=seed.graph,flow=useReactFlow(),audio=useMemo(createCurriculumAudioController,[]),storageKey=`kw:curriculum:${seed.id}:v1`;
 const conceptById=useMemo(()=>new Map(seed.concepts.map(concept=>[concept.id,concept])),[seed]);
 const fallback=useMemo(()=>fallbackPositions(graph,seed),[graph,seed]);
 const [positions,setPositions]=useState(fallback),[progress,setProgress]=useState(()=>readProgress(seed));
 const [focusedId,setFocusedId]=useState<string|null>(null),[selectedId,setSelectedId]=useState<string|null>(null),[hoveredId,setHoveredId]=useState<string|null>(null);
 const [query,setQuery]=useState(''),[activeModule,setActiveModule]=useState<string|null>(null),[showWeak,setShowWeak]=useState(false);
 const [sourceId,setSourceId]=useState(''),[targetId,setTargetId]=useState(''),[path,setPath]=useState<Path|null>(null),[toasts,setToasts]=useState<CurriculumToast[]>([]);
 const toastCounter=useRef(0),progressRef=useRef(progress);
 const [pulseIds,setPulseIds]=useState<string[]>([]),[targetPulse,setTargetPulse]=useState<string|null>(null),[layoutWarning,setLayoutWarning]=useState('');
 const [graphSize,setGraphSize]=useState({width:1000,height:600});const graphRef=useRef<HTMLElement>(null),timer=useRef<number|undefined>(undefined);
 useSmoothGraphWheel(graphRef);
 const unlocked=useMemo(()=>new Set(progress.unlocked),[progress.unlocked]);
 const statuses=useMemo(()=>Object.fromEntries(graph.nodes.map(node=>[node.id,statusOf(graph,unlocked,node.id)] as const)) as Record<string,Stage>,[graph,unlocked]);
 const moduleIds=useMemo(()=>new Map(seed.modules.map(module=>[module.id,seed.concepts.filter(c=>c.moduleId===module.id).map(c=>c.id)])),[seed]);
 const moduleCounts=useMemo(()=>seed.modules.map(module=>{const ids=moduleIds.get(module.id)??[];return {id:module.id,name:module.nameZh,total:ids.length,unlocked:ids.filter(id=>unlocked.has(id)).length,ids};}),[seed,moduleIds,unlocked]);
 const results=useMemo(()=>{const needle=query.trim().toLocaleLowerCase();return needle?seed.concepts.filter(c=>`${c.canonicalName} ${c.achievementName} ${c.summary}`.toLocaleLowerCase().includes(needle)).slice(0,10):[];},[query,seed]);
 const pathIds=useMemo(()=>new Set(path?.nodeIds??[]),[path]),pathEdgeIds=useMemo(()=>new Set(path?.edgeIds??[]),[path]);
 const connected=useMemo(()=>new Set(hoveredId?[hoveredId,...graph.edges.filter(edge=>edge.sourceNodeId===hoveredId||edge.targetNodeId===hoveredId).flatMap(edge=>[edge.sourceNodeId,edge.targetNodeId])]:[]),[graph,hoveredId]);
 const notify=useCallback((message:string,important=false)=>{const id=++toastCounter.current;setToasts(items=>[...items,{id,message,important}].slice(-3));},[]);
 const save=useCallback((next:Progress)=>{progressRef.current=next;setProgress(next);try{localStorage.setItem(storageKey,JSON.stringify({schemaVersion:1,...next}));}catch{notify('本机存储不可用，进度仅保留在当前页面。');}},[storageKey,notify]);
 const focus=useCallback((id:string)=>{setFocusedId(id);setQuery('');const p=positions[id];if(p)void flow.setCenter(p.x+50,p.y+50,{zoom:1.08,duration:320});},[flow,positions]);
 const navigate=useCallback((id:string)=>{focus(id);setSelectedId(id);},[focus]);
 const activate=useCallback((id:string)=>{
  const current=progressRef.current;
  setFocusedId(id);setSelectedId(id);
  if(!current.initialized){const all=[...strongAncestors(graph,[id])],ancestors=all.filter(nodeId=>nodeId!==id);save({initialized:true,unlocked:all});setPulseIds(ancestors.slice(0,8));setTargetPulse(id);notify(`已自动点亮 ${all.length} 个知识节点`,all.some(nodeId=>conceptById.get(nodeId)?.isKeyAchievement));if(all.some(nodeId=>conceptById.get(nodeId)?.isKeyAchievement))audio.playAchievement();}
  else if(statusOf(graph,new Set(current.unlocked),id)==='available'){save({...current,unlocked:[...current.unlocked,id]});setPulseIds([]);setTargetPulse(id);notify(`已掌握 ${conceptById.get(id)?.canonicalName??id}`,!!conceptById.get(id)?.isKeyAchievement);if(conceptById.get(id)?.isKeyAchievement)audio.playAchievement();}
  if(timer.current)window.clearTimeout(timer.current);timer.current=window.setTimeout(()=>{setPulseIds([]);setTargetPulse(null);},1250);
 },[audio,conceptById,graph,notify,save]);
 useEffect(()=>()=>{if(timer.current)window.clearTimeout(timer.current);},[]);
 useEffect(()=>{const element=graphRef.current;if(!element)return;const observer=new ResizeObserver(([entry])=>setGraphSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>{let active=true;const task=startLayout(graph,{direction:'DOWN',nodeWidth:100,nodeHeight:100,nodeSpacing:54,layerSpacing:110});task.result.then(value=>{if(active)setPositions(value);}).catch(()=>{if(active)setLayoutWarning('自动布局不可用，已使用稳定模块布局。');});return()=>{active=false;task.cancel();};},[graph]);
 useEffect(()=>{const timerId=window.setTimeout(()=>{if(activeModule){const ids=moduleIds.get(activeModule)??[];void flow.fitView({nodes:ids.map(id=>({id})),padding:.35,duration:0});}else void flow.fitView({padding:.18,duration:0});},100);return()=>window.clearTimeout(timerId);},[positions,flow,activeModule,moduleIds,graphSize.width,graphSize.height]);
 const nodes=useMemo<FlowNode[]>(()=>graph.nodes.map(node=>{const concept=conceptById.get(node.id)!;const dim=hoveredId?!connected.has(node.id):path?!pathIds.has(node.id):activeModule?concept.moduleId!==activeModule:false;return {id:node.id,type:'concept',position:positions[node.id]??{x:0,y:0},width:100,height:100,data:{concept,systemId:seed.id,status:statuses[node.id],selected:focusedId===node.id,dim,pulse:pulseIds.includes(node.id)||targetPulse===node.id,particles:targetPulse===node.id,activate} satisfies NodeData,ariaLabel:concept.canonicalName,style:{opacity:dim?.35:1}};}),[graph,conceptById,hoveredId,connected,path,pathIds,activeModule,positions,seed.id,statuses,focusedId,pulseIds,targetPulse,activate]);
 const edges=useMemo<FlowEdge[]>(()=>graph.edges.filter(edge=>edge.enabled&&(showWeak||edge.dependencyType==='strong')).map(edge=>{const weak=edge.dependencyType==='weak',highlight=hoveredId?edge.sourceNodeId===hoveredId||edge.targetNodeId===hoveredId:path?pathEdgeIds.has(edge.id):false;const dim=hoveredId?!highlight:path?!highlight:activeModule?conceptById.get(edge.sourceNodeId)?.moduleId!==activeModule&&conceptById.get(edge.targetNodeId)?.moduleId!==activeModule:false;return {id:edge.id,type:'concept',source:edge.sourceNodeId,target:edge.targetNodeId,animated:!!path&&highlight,markerEnd:{type:MarkerType.ArrowClosed,color:weak?'#7e97a5':unlocked.has(edge.sourceNodeId)?'#62cb91':'#82938a'},data:{weak,completed:unlocked.has(edge.sourceNodeId),highlight,dim} satisfies EdgeData};}),[graph,showWeak,hoveredId,path,pathEdgeIds,activeModule,conceptById,unlocked]);
 const selected=selectedId?conceptById.get(selectedId):undefined;
 const showPath=useCallback((mode:'to'|'from'|'between',from:string,to?:string)=>{const result=findKnowledgePath(graph,mode==='between'?{mode:'between',source:from,target:to!}:{mode,nodeId:from});if(!result.reachable){setPath(null);notify('未找到仅由 Strong 关系组成的路径。');return;}const next={nodeIds:[...result.nodeIds],edgeIds:[...result.edgeIds]};setPath(next);setSelectedId(null);void flow.fitView({nodes:next.nodeIds.map(id=>({id})),padding:.32,duration:350});},[graph,flow,notify]);
 const chooseModule=(module:string|null)=>{setActiveModule(module);if(module){const ids=moduleCounts.find(m=>m.id===module)?.ids??[];void flow.fitView({nodes:ids.map(id=>({id})),padding:.35,duration:300});}else void flow.fitView({padding:.18,duration:300});};
 const total=graph.nodes.length,mastered=progress.unlocked.length,percentage=Math.round(mastered/total*100);
 return <div className="function-world curriculum-world" data-testid={`curriculum-${seed.id}-world`} onClickCapture={audio.playClick}>
  <header className="world-header"><div><KnowledgeWorldBrand compact/><a className="world-back" href="/">← 返回知识总览</a><h1>{seed.nameZh} · {seed.nameEn}</h1><p>{seed.description} · {seed.concepts.length} 个候选知识节点 · 体系审核通过</p></div><div className="world-header-actions"><div className="world-global-progress"><strong>{mastered} / {total}</strong><span>{percentage}% 已掌握</span><div className="world-progress-track"><i style={{width:`${percentage}%`}}/></div></div></div></header>
  <aside className="world-wiki-nav" aria-label="知识世界导航"><KnowledgeWorldBrand/><section><h2>导航</h2><button onClick={()=>chooseModule(null)}>知识图谱总览</button><a href="#curriculum-search-input">搜索知识</a><a href="#curriculum-progress-panel">学习进度</a></section><section><h2>知识模块</h2>{moduleCounts.map(module=><button key={module.id} aria-pressed={activeModule===module.id} onClick={()=>chooseModule(module.id)}>{module.name}<small>{module.unlocked}/{module.total}</small></button>)}</section><section><h2>知识工具</h2><button onClick={()=>void flow.fitView({padding:.18,duration:300})}>显示全图</button><button disabled={!focusedId} onClick={()=>focusedId&&focus(focusedId)}>定位当前知识</button><button disabled={!focusedId} onClick={()=>focusedId&&setSelectedId(focusedId)}>打开知识详情</button></section></aside>
  <div className="world-wiki-content">
   <nav className="world-modules" aria-label="模块导航"><button aria-pressed={activeModule===null} onClick={()=>chooseModule(null)}>全部 · {mastered}/{total}</button>{moduleCounts.map(module=><button key={module.id} aria-pressed={activeModule===module.id} onClick={()=>chooseModule(module.id)}>{module.name} <small>{module.unlocked}/{module.total}</small></button>)}</nav>
   <section className="world-toolbar" aria-label="图谱操作"><div className="world-search"><label htmlFor="curriculum-search-input">搜索知识</label><input id="curriculum-search-input" aria-label={`搜索${seed.nameZh}知识`} value={query} onChange={event=>setQuery(event.target.value)} placeholder="名称 / 符号 / 常用说法"/>{query&&<div className="world-search-results curriculum-search-results" role="listbox">{results.map(concept=><button key={concept.id} role="option" aria-selected={focusedId===concept.id} onClick={()=>focus(concept.id)}><CurriculumPixelIcon systemId={seed.id} conceptName={concept.canonicalName} width={28} height={28}/><span>{concept.canonicalName}<small>{concept.achievementName}</small></span></button>)}{results.length===0&&<p>没有匹配知识节点。</p>}</div>}</div><button onClick={()=>void flow.fitView({padding:.18,duration:350})}>Fit View</button><button disabled={!focusedId} onClick={()=>focusedId&&focus(focusedId)}>Center</button><label className="world-switch"><input type="checkbox" checked={showWeak} onChange={event=>setShowWeak(event.target.checked)}/>显示完整知识关系</label></section>
   <section className="world-pathbar" aria-label="知识路径"><span>{focusedId?`当前：${conceptById.get(focusedId)?.canonicalName}`:'点击或搜索节点以定位'}</span><button disabled={!focusedId} onClick={()=>focusedId&&showPath('to',focusedId)}>我怎样学到这里？</button><button disabled={!focusedId} onClick={()=>focusedId&&showPath('from',focusedId)}>学会它以后能去哪？</button><label>A 到 B <select aria-label="路径起点" value={sourceId} onChange={event=>setSourceId(event.target.value)}><option value="">起点</option>{graph.nodes.map(node=><option key={node.id} value={node.id}>{node.nameZh}</option>)}</select><select aria-label="路径终点" value={targetId} onChange={event=>setTargetId(event.target.value)}><option value="">终点</option>{graph.nodes.map(node=><option key={node.id} value={node.id}>{node.nameZh}</option>)}</select></label><button disabled={!sourceId||!targetId} onClick={()=>showPath('between',sourceId,targetId)}>显示路径</button>{path&&<><span className="world-path-summary" role="status">{path.nodeIds.length} 节点 · {path.edgeIds.length} 关系</span><button onClick={()=>setPath(null)}>清除路径</button></>}<button disabled={!focusedId} onClick={()=>focusedId&&setSelectedId(focusedId)}>查看详情</button></section>
   <div className="world-main"><main ref={graphRef} className="world-graph curriculum-world-graph" aria-label={`${seed.nameZh}知识图谱`}><ReactFlow zoomOnScroll={false} nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} edgesFocusable={false} fitView fitViewOptions={{padding:.18}} minZoom={.04} maxZoom={1.8} onNodeClick={(_,node)=>activate(node.id)} onNodeMouseEnter={(_,node)=>setHoveredId(node.id)} onNodeMouseLeave={()=>setHoveredId(null)} proOptions={{hideAttribution:false}}><Background color="#505461" gap={32} size={1}/><MotionControls/><MiniMap position="top-right" pannable zoomable nodeColor={node=>node.data.status==='unlocked'?'#40aa75':node.data.status==='available'?'#d9b563':'#68717e'} maskColor="rgba(32,35,44,.65)"/><ConceptHoverCard id={hoveredId??focusedId} positions={positions} statuses={statuses} size={graphSize} concepts={conceptById}/></ReactFlow><div className="world-legend"><span className="legend-mark legend-locked"/>未解锁<span className="legend-mark legend-available"/>可解锁<span className="legend-mark legend-unlocked"/>已掌握<span className="legend-mark legend-key"/>关键成就</div>{layoutWarning&&<p className="world-layout-note">{layoutWarning}</p>}</main>
    <aside id="curriculum-progress-panel" className="world-sidebar"><h2>学习进度</h2><p className="world-sidebar-total"><span>{mastered} / {total}</span><small>{percentage}% 已掌握</small></p>{moduleCounts.map(module=><div className="world-module-progress" key={module.id}><div><span>{module.name}</span><strong>{module.unlocked}/{module.total}</strong></div><div className="world-progress-track"><i style={{width:`${module.total?module.unlocked/module.total*100:0}%`}}/></div></div>)}{focusedId&&<div className="curriculum-selected-preview"><h3>{conceptById.get(focusedId)?.canonicalName}</h3><p>{conceptById.get(focusedId)&&<MathAwareText text={conceptById.get(focusedId)!.summary}/>}</p><button onClick={()=>setSelectedId(focusedId)}>查看详细说明</button></div>}<p className="world-side-note">本体系已通过审核。Weak 关系不参与解锁与完成率。</p><p className="world-side-note">进度保存在此浏览器的本机存储中。</p><button className="curriculum-reset" onClick={()=>{save(emptyProgress());setPath(null);notify(`已清除${seed.nameZh}本机进度。`);}}>重置本机进度</button></aside>
   </div>
  </div>
  {!selected&&<CurriculumToasts toasts={toasts} onDismiss={id=>setToasts(items=>items.filter(t=>t.id!==id))}/>}
  {selected&&<ConceptDrawer seed={seed} concept={selected} status={statuses[selected.id]} toasts={toasts} onDismiss={id=>setToasts(items=>items.filter(t=>t.id!==id))} onClose={()=>setSelectedId(null)} onNavigate={navigate} onPath={(mode,id)=>showPath(mode,id)}/>}
 </div>;
}
export default function CurriculumSystemWorld({seed}:{seed:CurriculumSystemSeed}){return <ReactFlowProvider><SystemGraph key={seed.id} seed={seed}/></ReactFlowProvider>;}
