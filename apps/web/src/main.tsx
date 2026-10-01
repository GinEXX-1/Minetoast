import {PageMotion,MotionControls} from './KnowledgeMotion';
import React,{useState,useEffect,useMemo,useRef,useCallback,memo,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider,useQuery,useQueryClient} from '@tanstack/react-query';
import {create} from 'zustand';
import {ReactFlow,ReactFlowProvider,Background,MiniMap,Handle,Position,BaseEdge,EdgeLabelRenderer,getBezierPath,useReactFlow,useViewport,MarkerType,type NodeProps,type EdgeProps} from '@xyflow/react';
import type {KnowledgeNode,KnowledgeEdge,NodeStatus,PathQuery} from '../../../packages/domain/src/index';
import {strongParents,indexGraph,projectStatuses,searchNodes,findPath,domainPortals} from '../../../packages/graph-core/src/index';
import {BackupPanel,RegionMap,AdminPanel,useFeedback} from './Extensions';
import '@xyflow/react/dist/style.css';
import './style.css';
import './extensions.css';
import {KnowledgePortal,KnowledgeSystemPage} from './KnowledgePortal';
import {startLayout} from './workers/layout';
import {applyLayoutOverrides} from '../../../packages/graph-core/src/layout';
interface Snapshot{releaseId:string;nodes:KnowledgeNode[];edges:KnowledgeEdge[];notice:string;domains?:{id:string;nameZh:string}[];layouts?:{nodeId:string;x:number;y:number;layoutVersion:string}[];landmarks?:{id:string;nodeId:string;x:number;y:number}[];}
interface Auth{user:{id:string;username:string;role?:string}|null;csrfToken:string|null;}
interface Progress{revision:number;graphReleaseId:string;initializationCompletedAt:string|null;unlocked:{nodeId:string;source:string}[];}
const labels:Record<NodeStatus,string>={locked:'Locked · 未满足前置',available:'Available · 可解锁',unlocked:'Unlocked · 已掌握'};
const glyph:Record<NodeStatus,string>={locked:'🔒',available:'◇',unlocked:'✓'};
const useView=create<{weak:boolean;selected:string|null;setWeak:(v:boolean)=>void;select:(id:string|null)=>void}>(set=>({weak:false,selected:null,setWeak:weak=>set({weak}),select:selected=>set({selected})}));
class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
async function api<T>(path:string,body?:unknown,csrf?:string|null):Promise<T>{
 let response:Response;try{response=await fetch('/api/v1'+path,{credentials:'same-origin',headers:{...(body?{'Content-Type':'application/json'}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})});}catch{throw new HttpError(0,'网络连接中断，进度尚未确认保存。请重试同一操作。');}
 const result=await response.json();if(!response.ok)throw new HttpError(response.status,result.message??'操作失败');return result;
}
const KnowledgeCard=memo(({id,data}:NodeProps)=>{const n=data.node as KnowledgeNode,s=data.status as NodeStatus;return <div className={'knowledge-card '+s} data-testid={'node-'+id} data-status={s} title={n.nameZh+'｜'+n.achievementName+'｜'+n.descriptionShort}>
 <Handle type="target" position={Position.Left}/><span className="node-glyph" aria-hidden>{glyph[s]}</span><div className="node-copy"><strong>{n.nameZh}</strong><small>{n.stage==='middle_school'?'初中前置 · ':''}{n.achievementName}</small><span className="state-label">{labels[s]}</span></div><Handle type="source" position={Position.Right}/>
 </div>});
const DependencyEdge=memo((props:EdgeProps)=>{const[path,x,y]=getBezierPath(props);const weak=props.data?.weak as boolean,satisfied=props.data?.satisfied as boolean;return <><BaseEdge path={path} markerEnd={props.markerEnd} style={{stroke:weak?'#7a8e9c':satisfied?'#55b78a':'#718096',strokeWidth:weak?1.5:satisfied?2.5:1.8,strokeDasharray:weak?'6 5':undefined}}/>{!weak&&<EdgeLabelRenderer><span title={String(props.data?.rationale)} data-testid={'edge-'+props.id} className="edge-label nodrag nopan" style={{transform:`translate(-50%, -50%) translate(${x}px,${y}px)`}}>{satisfied?'✅':'❌'}</span></EdgeLabelRenderer>}</>});
const nodeTypes={knowledge:KnowledgeCard},edgeTypes={dependency:DependencyEdge};
// Keep unrelated toolbar/search state out of the expensive graph subtree.
function CanvasLegend(){const {zoom}=useViewport();return <div className="canvas-legend"><span>◇ Available</span><span>✓ Unlocked</span><span>🔒 Locked</span><span>{Math.round(zoom*100)}%</span></div>;}
const GraphCanvas=memo(function GraphCanvas({nodes,edges,onNodeClick,select,onHover}:{nodes:any[];edges:any[];onNodeClick:(_:unknown,node:{id:string})=>void;select:(id:string|null)=>void;onHover:(id:string|null)=>void}){
 return <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} edgesFocusable={false} minZoom={0.03} maxZoom={1.8} onNodeClick={onNodeClick} onNodeContextMenu={(e,n)=>{e.preventDefault();if(n.id.startsWith('view:portal:'))onNodeClick(e,n);else select(n.id);}} onNodeMouseEnter={(_,n)=>onHover((n.data.node as KnowledgeNode).id)} onNodeMouseLeave={()=>onHover(null)} fitViewOptions={{padding:0.12}} proOptions={{hideAttribution:false}}>
  <Background color="#34453f" gap={28} size={1}/><MotionControls position="bottom-left"/><MiniMap pannable zoomable nodeColor={n=>n.data.status==='unlocked'?'#55b78a':n.data.status==='available'?'#d8ae5b':'#52616a'} maskColor="rgba(8,17,14,.55)"/><CanvasLegend/>
 </ReactFlow>;
});
const LazyFormula=lazy(()=>import('./Formula'));
function Formula({latex}:{latex:string}){return <Suspense fallback={<p>公式加载中…</p>}><LazyFormula latex={latex}/></Suspense>;}
function App(){
 const qc=useQueryClient();const flow=useReactFlow();
 const {weak,selected,setWeak,select}=useView();
 const graphQuery=useQuery({queryKey:['graph'],queryFn:()=>api<Snapshot>('/knowledge/graph')});
 const authQuery=useQuery({queryKey:['auth'],queryFn:()=>api<Auth>('/auth/me'),retry:false});
 const auth=authQuery.data;const userId=auth?.user?.id;
 const progressQuery=useQuery({queryKey:['progress',userId],queryFn:()=>api<Progress>('/me/progress'),enabled:!!userId,retry:false,refetchOnWindowFocus:true});
 const graph=graphQuery.data,progress=progressQuery.data;
 const unlocked=useMemo(()=>new Set(progress?.unlocked.map(n=>n.nodeId)??[]),[progress]);
 const [positions,setPositions]=useState<Record<string,{x:number;y:number}>>({});
 const [layoutError,setLayoutError]=useState('');const [busy,setBusy]=useState(false);const busyRef=useRef(false);
 const [message,setMessage]=useState('');const [error,setError]=useState('');const [authOpen,setAuthOpen]=useState(false);const [register,setRegister]=useState(false);
 const [locate,setLocate]=useState('');const [hovered,setHovered]=useState<string|null>(null);
 const [search,setSearch]=useState(''),[path,setPath]=useState<PathQuery|null>(null),[pathMode,setPathMode]=useState<'to'|'from'|'between'>('to'),[pathTarget,setPathTarget]=useState(''),[domain,setDomain]=useState('functions'),[view,setView]=useState<'tree'|'map'>('tree');
 const previousCamera=useRef<ReturnType<typeof flow.getViewport>|null>(null),feedback=useFeedback();
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const index=useMemo(()=>graph?indexGraph(graph):null,[graph]);
 const results=useMemo(()=>searchNodes(graph?.nodes??[],search),[graph,search]);
 const pathResult=useMemo(()=>{if(!path||!index)return null;const ids=path.mode==='between'?[path.source,path.target]:[path.nodeId];return ids.every(id=>index.nodesById.has(id))?findPath(index,path):{nodeIds:[],edgeIds:[],reachable:false};},[index,path]);
 const visibleIds=useMemo(()=>new Set(pathResult?.nodeIds??index?.domainIndex.get(domain)??[]),[pathResult,index,domain]);
 const portals=useMemo(()=>index&&!path?domainPortals(index,domain):[],[index,path,domain]);
 const portalViews=useMemo(()=>[...new Map(portals.map(p=>[p.targetNodeId,p])).values()],[portals]);
 const viewId=useMemo(()=>new Map(portalViews.map(p=>[p.targetNodeId,p.id])),[portalViews]);
 const pending=useRef<{envelope:any;userId:string}|null>(null);const [hasPending,setHasPending]=useState(false);
 const initializationQueue=useRef(new Set<string>());const [queuedCount,setQueuedCount]=useState(0);
 const dialogRef=useRef<HTMLDialogElement>(null);const drawerRef=useRef<HTMLDialogElement>(null);
 const initial=userId&&progress&&!progress.initializationCompletedAt;
 useEffect(()=>{
  if(!graph)return;
  let active=true;setPositions({});setLayoutError('');
  const task=startLayout(graph);
  task.result.then(value=>{const projection=applyLayoutOverrides(value,graph.layouts??[]);if(active){setPositions(projection.positions);if(projection.warnings.length)setError('人工布局存在冲突：'+projection.warnings.join('，'));}}).catch(reason=>{
   if(active){console.error('Graph layout failed',reason);setLayoutError('布局加载失败，请刷新重试。');}
  });
  return()=>{active=false;task.cancel();};
 },[graph]);
 useEffect(()=>{if(Object.keys(positions).length){const t=setTimeout(()=>flow.fitView({padding:0.12,duration:0}),80);return()=>clearTimeout(t);}},[positions,flow,domain]);
 useEffect(()=>{const dialog=dialogRef.current;if(authOpen&&!dialog?.open)dialog?.showModal();else if(!authOpen&&dialog?.open)dialog.close();},[authOpen]);
 useEffect(()=>{const drawer=drawerRef.current;if(selected&&!drawer?.open)drawer?.showModal();else if(!selected&&drawer?.open)drawer.close();},[selected]);
 useEffect(()=>{pending.current=null;initializationQueue.current.clear();setQueuedCount(0);setHasPending(false);setError('');setMessage('');},[userId]);
 const statuses=useMemo(()=>index?projectStatuses(index,unlocked):{},[index,unlocked]);
 const connected=useMemo(()=>{const s=new Set<string>();if(hovered&&graph){s.add(hovered);for(const e of graph.edges.filter(e=>e.sourceNodeId===hovered||e.targetNodeId===hovered)){s.add(e.sourceNodeId);s.add(e.targetNodeId);}}return s;},[hovered,graph]);
 const viewNodes=useMemo(()=>graph?.nodes.filter(n=>visibleIds.has(n.id)||viewId.has(n.id)).map(n=>({id:viewId.get(n.id)??n.id,type:'knowledge',position:positions[n.id]??{x:0,y:0},width:210,height:100,data:{node:viewId.has(n.id)?{...n,nameZh:'跨域 ↗ '+n.nameZh}:n,status:statuses[n.id]},ariaLabel:`${viewId.has(n.id)?'跨域入口：':''}${n.nameZh}，${labels[statuses[n.id]]}`,style:{opacity:hovered&&!connected.has(n.id)?0.32:1}}))??[],[graph,visibleIds,viewId,positions,statuses,hovered,connected]);
 const viewEdges=useMemo(()=>graph?.edges.filter(e=>e.enabled&&(visibleIds.has(e.sourceNodeId)||viewId.has(e.sourceNodeId))&&(visibleIds.has(e.targetNodeId)||viewId.has(e.targetNodeId))&&(visibleIds.has(e.sourceNodeId)||visibleIds.has(e.targetNodeId))&&(path?pathResult?.edgeIds.includes(e.id):weak||e.dependencyType==='strong')).map(e=>({id:e.id,type:'dependency',source:viewId.get(e.sourceNodeId)??e.sourceNodeId,target:viewId.get(e.targetNodeId)??e.targetNodeId,markerEnd:{type:MarkerType.ArrowClosed,color:e.dependencyType==='weak'?'#7a8e9c':unlocked.has(e.sourceNodeId)?'#55b78a':'#718096'},data:{weak:e.dependencyType==='weak',satisfied:unlocked.has(e.sourceNodeId),rationale:e.rationale},style:{opacity:hovered&&e.sourceNodeId!==hovered&&e.targetNodeId!==hovered?0.18:1}}))??[],[graph,visibleIds,viewId,path,pathResult,weak,unlocked,hovered]);
 async function submitCommand(command?:any){
  if(!auth?.user){setAuthOpen(true);return;}if(!progress||busyRef.current)return;
  if(pending.current&&command){setError('上一项保存尚未确认，请先重试。');return;}
  const envelope=pending.current?.envelope??{idempotencyKey:crypto.randomUUID(),graphReleaseId:progress.graphReleaseId,expectedRevision:progress.revision,command};
  busyRef.current=true;setBusy(true);setError('');
  feedback.gesture();
  try{const result=await api<Progress&{addedNodeIds:string[];removedNodeIds:string[]}>('/me/progress/commands',envelope,auth.csrfToken);qc.setQueryData(['progress',userId],result);pending.current=null;setHasPending(false);if(envelope.command.kind==='unlock'&&result.addedNodeIds.length)feedback.confirm(envelope.idempotencyKey,index?.nodesById.get(envelope.command.nodeId)?.nameZh??'知识');setMessage(envelope.command.kind==='initialize'?'已批量保存掌握记录。':envelope.command.kind==='finish_initialization'?'初始化已完成，可以逐步解锁知识。':'进度已保存');}
  catch(e){const err=e as HttpError;setError(err.message);if(err.status===0||err.status>=500){pending.current={envelope,userId:auth.user.id};setHasPending(true);}else{pending.current=null;setHasPending(false);}if(err.status===409){await progressQuery.refetch();await graphQuery.refetch();}if(err.status===401){await authQuery.refetch();setAuthOpen(true);}}
  finally{busyRef.current=false;setBusy(false);}
 }
 useEffect(()=>{
  if(!queuedCount||!initial||busy||hasPending)return;
  const timer=setTimeout(()=>{const targets=[...initializationQueue.current].slice(0,25);for(const id of targets)initializationQueue.current.delete(id);setQueuedCount(initializationQueue.current.size);void submitCommand({kind:'initialize',targetNodeIds:targets});},150);
  return()=>clearTimeout(timer);
 },[queuedCount,initial,busy,hasPending,progress,userId]);
 const onNodeClick=useCallback((_:unknown,node:{id:string})=>{const portal=portalViews.find(p=>p.id===node.id);if(portal){setDomain(portal.targetDomainId);setLocate(portal.targetNodeId);return;}if(initial&&statuses[node.id]!=='unlocked'){initializationQueue.current.add(node.id);setQueuedCount(initializationQueue.current.size);return;}if(statuses[node.id]==='available'){if(!userId){setAuthOpen(true);return;}void submitCommand({kind:'unlock',nodeId:node.id});}else select(node.id);},[statuses,userId,initial,progress,busy,portalViews]);
 async function authenticate(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError('');const form=new FormData(event.currentTarget);try{const result=await api<Auth>(register?'/auth/register':'/auth/login',{username:form.get('username'),password:form.get('password')});qc.removeQueries({queryKey:['progress']});qc.setQueryData(['auth'],result);setAuthOpen(false);setMessage('已登录，进度将保存在账户中。');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function logout(){if(busy||hasPending)return;setBusy(true);try{await api('/auth/logout',{},auth?.csrfToken);qc.removeQueries({queryKey:['progress']});qc.setQueryData(['auth'],{user:null,csrfToken:null});select(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 function fly(){if(!locate||!positions[locate])return;setView('tree');setPath(null);setDomain(index?.nodesById.get(locate)?.domainId??domain);flow.setCenter(positions[locate].x+105,positions[locate].y+50,{zoom:1.1,duration:reduced()?0:450});}
 function showPath(){if(!locate||(pathMode==='between'&&!pathTarget))return;if(!path)previousCamera.current=flow.getViewport();setView('tree');setPath(pathMode==='between'?{mode:'between',source:locate,target:pathTarget}:{mode:pathMode,nodeId:locate});}
 useEffect(()=>{if(pathResult?.reachable){const timer=setTimeout(()=>flow.fitView({nodes:pathResult.nodeIds.map(id=>({id})),padding:.15,duration:0}),80);return()=>clearTimeout(timer);}},[pathResult,flow]);
 function exitPath(){setPath(null);if(previousCamera.current)void flow.setViewport(previousCamera.current,{duration:0});previousCamera.current=null;}
 const detailQuery=useQuery({queryKey:['node',graph?.releaseId,selected],queryFn:()=>api<{node:KnowledgeNode}>(`/knowledge/nodes/${selected}?releaseId=${graph!.releaseId}`),enabled:!!selected&&!!graph});
 const selectedNode=detailQuery.data?.node??graph?.nodes.find(n=>n.id===selected);
 const high=graph?.nodes.filter(n=>n.stage==='high_school'&&!n.retired)??[],completed=high.filter(n=>unlocked.has(n.id)).length;
 const loadError=graphQuery.error||authQuery.error;
 return <div className="app-shell">
  <header><div className="brand"><span className="brand-mark">◇</span><div><h1>数学 · Knowledge World</h1><p>函数领域 <span>Phase 1 · 20 个测试节点</span></p></div></div><div className="account"><a className="world-entry" href="/function-world">进入函数知识世界 →</a>{auth?.user?<><span>{auth.user.username}</span><button disabled={busy||hasPending} onClick={logout}>退出登录</button></>:<><span>游客浏览</span><button className="primary" disabled={busy} onClick={()=>{setRegister(false);setAuthOpen(true);}}>登录 / 注册</button></>}</div></header>
  <section className="toolbar" aria-label="画布操作"><div className="locator"><label htmlFor="locate-node">定位知识</label><select id="locate-node" value={locate} onChange={e=>setLocate(e.target.value)}><option value="">选择节点</option>{graph?.nodes.filter(n=>!n.retired).map(n=><option key={n.id} value={n.id}>{n.nameZh}</option>)}</select><button onClick={fly} disabled={!locate||!positions[locate]}>Fly-to</button><button onClick={()=>{if(locate)select(locate);}} disabled={!locate}>查看详情</button></div><div className="canvas-tools"><label className="switch"><input type="checkbox" checked={weak} onChange={e=>setWeak(e.target.checked)}/>显示 Weak 弱依赖</label><button onClick={()=>flow.fitView({padding:0.12,duration:reduced()?0:350})}>Fit View</button><button aria-pressed={feedback.muted} onClick={feedback.toggle}>{feedback.muted?'声音已关闭':'声音已开启'}</button></div></section>
  <section className="toolbar extended-tools"><label>领域<select value={domain} onChange={e=>{exitPath();setDomain(e.target.value);}}>{(graph?.domains??[{id:'functions',nameZh:'函数'}]).map(d=><option key={d.id} value={d.id}>{d.nameZh}</option>)}</select></label><button aria-pressed={view==='tree'} onClick={()=>setView('tree')}>知识树</button><button aria-pressed={view==='map'} onClick={()=>setView('map')}>区域地图</button><label>搜索<input aria-label="搜索知识或数学符号" value={search} onChange={e=>setSearch(e.target.value)} placeholder="名称 / 拼音 / 别名 / 符号" maxLength={100}/></label>{search&&<div className="search-results" aria-label="搜索结果">{results.length?results.slice(0,8).map(n=><button key={n.id} onClick={()=>{setLocate(n.id);select(n.id);}}>{n.nameZh}</button>):<span>没有匹配节点</span>}</div>}<label>路径<select aria-label="路径模式" value={pathMode} onChange={e=>setPathMode(e.target.value as typeof pathMode)}><option value="to">To · 所有强前置</option><option value="from">From · 所有强后继</option><option value="between">Between · 两点之间</option></select></label>{pathMode==='between'&&<select aria-label="路径终点" value={pathTarget} onChange={e=>setPathTarget(e.target.value)}><option value="">选择终点</option>{graph?.nodes.filter(n=>!n.retired).map(n=><option key={n.id} value={n.id}>{n.nameZh}</option>)}</select>}<button disabled={!locate||(pathMode==='between'&&!pathTarget)} onClick={showPath}>显示路径</button>{path&&<><button onClick={()=>flow.fitView({padding:.15,duration:0})}>Fit Path</button><button onClick={exitPath}>退出路径</button><span role="status">{pathResult?.reachable?`${pathResult.nodeIds.length} 个路径节点`:'无可达强依赖路径'}</span></>}{auth?.user?.role==='admin'&&auth.csrfToken&&graph&&<AdminPanel api={api} csrf={auth.csrfToken} releaseId={graph.releaseId} onPublish={()=>{void graphQuery.refetch();void progressQuery.refetch();}}/>}</section>
  {!!portals.length&&<nav aria-label="跨域入口">{portals.map(p=><button key={p.id} data-testid={p.id} onClick={()=>{setDomain(p.targetDomainId);setLocate(p.targetNodeId);}}>{index?.nodesById.get(p.targetNodeId)?.nameZh} → {p.targetDomainId}</button>)}</nav>}
  {auth?.user&&auth.csrfToken&&<BackupPanel key={userId} api={api} csrf={auth.csrfToken} submit={submitCommand} disabled={busy||hasPending}/>}
  <section className="progress-strip"><div><strong>{userId?`${completed} / ${high.length}`:'登录后记录掌握情况'}</strong><span>{userId?'高中测试节点已掌握':'全部知识内容均可查看'}</span></div><div className="progress-track"><div style={{width:`${high.length?completed/high.length*100:0}%`}}/></div><span className="save-status" role="status">{busy?'正在保存…':message||'拖动画布平移 · 滚轮缩放'}</span></section>
  {!!initial&&<section className="initialization"><div><strong>建立我的数学世界</strong><span>点击已会的知识，自动补齐强前置；弱依赖和旁支不会点亮。{queuedCount>0?` · ${queuedCount} 个目标待批量保存`:''}</span></div><button className="primary" disabled={busy||hasPending||queuedCount>0} onClick={()=>submitCommand({kind:'finish_initialization'})}>完成初始化</button></section>}
  {(error||progressQuery.error)&&<div className="error" role="alert">{error||(progressQuery.error as Error)?.message}{hasPending?<button disabled={busy} onClick={()=>submitCommand()}>重试保存</button>:<button onClick={()=>{setError('');void progressQuery.refetch();}}>刷新进度</button>}</div>}
  {view==='map'&&graph&&<RegionMap nodes={graph.nodes} unlocked={unlocked} landmarks={graph.landmarks??[]} onEnter={()=>setView('tree')} onSelect={select}/>}
  <main className="graph-space" aria-label="函数知识图谱" style={{display:view==='tree'?'block':'none'}}>
   {loadError?<div className="loading error">加载失败：{loadError.message}<button onClick={()=>{void graphQuery.refetch();void authQuery.refetch();}}>重试</button></div>:!graph||!Object.keys(positions).length?<div className="loading">{layoutError||'正在整理知识图谱…'}</div>:
   <GraphCanvas nodes={viewNodes} edges={viewEdges} onNodeClick={onNodeClick} select={select} onHover={setHovered}/>}
  </main>
  <div className="unlock-toasts" aria-live="polite">{feedback.toasts.map(t=><div key={t.id}>✓ 已掌握 {t.name}</div>)}</div>
  <footer><span>Strong 连线：✅ 前置已掌握 / ❌ 前置未掌握</span><span>右键节点可查看详情 · 初中前置不计入高中进度</span><span className="test-note">测试内容，尚未正式教研审核</span></footer>
  <dialog ref={dialogRef} onCancel={()=>setAuthOpen(false)} onClose={()=>setAuthOpen(false)} className="auth-dialog"><form onSubmit={authenticate}><div className="dialog-heading"><h2>{register?'创建账户':'欢迎回来'}</h2><button type="button" aria-label="关闭登录" onClick={()=>setAuthOpen(false)}>×</button></div><p>将掌握记录保存在你的账户中。</p><label>用户名<input name="username" required pattern="[A-Za-z0-9_]{3,32}" minLength={3} maxLength={32} autoComplete="username" placeholder="3–32 位字母、数字或下划线"/></label><label>密码<input name="password" type="password" required minLength={12} maxLength={128} autoComplete={register?'new-password':'current-password'} placeholder="至少 12 个字符"/></label>{error&&<p role="alert" className="form-error">{error}</p>}<button className="primary full" disabled={busy} type="submit">{busy?'请稍候…':register?'创建并登录':'登录'}</button><button className="text-button" type="button" onClick={()=>{setRegister(!register);setError('');}}>{register?'已有账户？登录':'还没有账户？注册'}</button></form></dialog>
  <dialog ref={drawerRef} className="detail-drawer" onCancel={()=>select(null)} onClose={()=>select(null)}>{selectedNode&&<><div className="dialog-heading"><span className="eyebrow">知识详情 · 测试版</span><button aria-label="关闭详情" onClick={()=>select(null)}>×</button></div><h2>{selectedNode.nameZh}</h2><p className="achievement">{selectedNode.achievementName}</p><span className={'detail-state '+statuses[selectedNode.id]}>{labels[statuses[selectedNode.id]]}</span><p>{selectedNode.contentDetailed}</p>{selectedNode.formulas.map(f=><React.Fragment key={f.id}><Formula latex={f.latex}/><p className="conditions">{f.conditions}</p></React.Fragment>)}<h3>教材出处</h3><p className="conditions">{selectedNode.reviewStatus==='APPROVED'?'已签审记录；教材版本见下方。':'候选位置，尚未逐页核实及人工签审。'}</p>{selectedNode.textbookReferences.map((r,i)=><p className="conditions" key={i}>{r.publisher} · {r.series} · {r.edition}<br/>{r.volume} · {r.chapter} · {r.section}{r.page?` · 第 ${r.page} 页`:null}{r.sourceUrl&&/^https?:/.test(r.sourceUrl)&&<> · <a href={r.sourceUrl} target="_blank" rel="noreferrer">来源入口</a></>}</p>)}{detailQuery.error&&<p role="alert">详情加载失败。<button onClick={()=>void detailQuery.refetch()}>重试详情</button></p>}<h3>Strong 强前置</h3>{strongParents(graph!,selectedNode.id).length?strongParents(graph!,selectedNode.id).map(id=><div className="prerequisite" key={id}><span>{unlocked.has(id)?'✅':'❌'} {graph!.nodes.find(n=>n.id===id)?.nameZh}</span><button onClick={()=>select(id)}>查看</button></div>):<p>这是本测试切片的入口节点。</p>}<h3>Weak 弱依赖</h3>{graph!.edges.filter(e=>e.targetNodeId===selectedNode.id&&e.dependencyType==='weak').map(e=><p key={e.id}>{graph!.nodes.find(n=>n.id===e.sourceNodeId)?.nameZh}：{e.rationale}</p>)}<p className="conditions">弱依赖帮助理解，但不决定是否可解锁。</p>{userId&&statuses[selectedNode.id]==='unlocked'?<button className="revoke" disabled={busy||hasPending} onClick={()=>submitCommand({kind:'revoke',nodeId:selectedNode.id})}>标记为未掌握（保留后继进度）</button>:userId&&(initial||statuses[selectedNode.id]==='available')?<button className="primary full" disabled={busy||hasPending} onClick={()=>submitCommand(initial?{kind:'initialize',targetNodeIds:[selectedNode.id]}:{kind:'unlock',nodeId:selectedNode.id})}>标记已掌握</button>:null}</>}</dialog>
 </div>;
}
const client=new QueryClient({defaultOptions:{queries:{staleTime:30000,retry:1}}});
const phase2cPreview=new URLSearchParams(window.location.search).get('phase')==='2c';
const functionWorldRoute=window.location.pathname==='/function-world';
const systemMatch=window.location.pathname.match(/^\/systems\/([a-z0-9-]+)\/?$/);
const legacyRoute=window.location.pathname==='/legacy';
const p3bFrameRoute=window.location.pathname==='/phase-3b-frames';
const p3cIconRoute=window.location.pathname==='/phase-3c-icons';
const FunctionContentPreview=lazy(()=>import('./FunctionContentPreview'));
const FunctionWorld=lazy(()=>import('./FunctionWorld'));
const P3BFramePreview=lazy(()=>import('./P3BFramePreview'));
const P3CIconPreview=lazy(()=>import('./P3CIconPreview'));
const browserRoot=window as Window & {knowledgeWorldRoot?:ReturnType<typeof createRoot>};
const appRoot=browserRoot.knowledgeWorldRoot??createRoot(document.getElementById('root')!);
browserRoot.knowledgeWorldRoot=appRoot;
appRoot.render(<React.StrictMode><PageMotion/>{p3cIconRoute?<Suspense fallback={<div className="loading">加载 Phase 3C 图标预览…</div>}><P3CIconPreview/></Suspense>:p3bFrameRoute?<ReactFlowProvider><Suspense fallback={<div className="loading">加载 Phase 3B 节点框预览…</div>}><P3BFramePreview/></Suspense></ReactFlowProvider>:functionWorldRoute?<ReactFlowProvider><Suspense fallback={<div className="loading">加载函数知识世界…</div>}><FunctionWorld/></Suspense></ReactFlowProvider>:systemMatch?<KnowledgeSystemPage systemId={systemMatch[1]}/>:phase2cPreview?<Suspense fallback={<div className="loading">加载 Phase 2C 内容候选…</div>}><FunctionContentPreview/></Suspense>:legacyRoute?<QueryClientProvider client={client}><ReactFlowProvider><App/></ReactFlowProvider></QueryClientProvider>:<KnowledgePortal/>}</React.StrictMode>);
