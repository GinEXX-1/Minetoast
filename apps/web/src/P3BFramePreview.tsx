import {useEffect,useMemo,useState} from 'react';
import {Background,BaseEdge,Handle,MarkerType,MiniMap,Position,ReactFlow,useReactFlow,useViewport,type Edge as FlowEdge,type EdgeProps,type Node as FlowNode,type NodeProps} from '@xyflow/react';
import {fallbackWorldPositions,worldGraph,worldKeys,worldNodes} from './function-world-model';
import {KnowledgeNodeFrame,frameLevelFor,frameLevelLabels,frameLevels,frameStateLabels,frameStates,type FrameLevel,type FrameState} from './KnowledgeNodeFrame';
import './p3b-frame-preview.css';

const previewPosition=Object.fromEntries(Object.entries(fallbackWorldPositions()).map(([id,point])=>[id,{x:Math.round(point.x*130/270),y:Math.round(point.y*150/210)}]));
const previewBounds=Object.values(previewPosition);
const graphCenter={x:previewBounds.reduce((sum,point)=>sum+point.x,0)/previewBounds.length+50,y:previewBounds.reduce((sum,point)=>sum+point.y,0)/previewBounds.length+50};
const levelById=new Map(worldGraph.nodes.map(node=>{
 const metadata=worldNodes.get(node.id)!;
 return [node.id,frameLevelFor(metadata.importance,worldKeys.has(node.id))] as const;
}));

/** Deliberate display fixtures; never read/write Phase 2 progress. */
export const previewStateById=(()=>{
 const result=new Map<string,FrameState>();
 for(const level of frameLevels){
  const ids=worldGraph.nodes.filter(node=>levelById.get(node.id)===level).map(node=>node.id);
  ids.forEach((id,index)=>result.set(id,frameStates[index<3?index:0]));
 }
 return result;
})();
const keyLockedId=worldGraph.nodes.find(node=>levelById.get(node.id)==='key'&&previewStateById.get(node.id)==='locked')?.id;

interface PreviewNodeData{nodeId:string;name:string;level:FrameLevel;state:FrameState;selected:boolean;onSelect:(id:string)=>void}
function PreviewNode({data}:NodeProps){
 const d=data as unknown as PreviewNodeData;
 return <div className="p3b-graph-node" data-testid={`p3b-node-${d.nodeId}`} data-level={d.level} data-state={d.state}>
  <Handle type="target" position={Position.Top}/>
  <KnowledgeNodeFrame level={d.level} state={d.state} name={d.name} selected={d.selected} onClick={()=>d.onSelect(d.nodeId)}/>
  <Handle type="source" position={Position.Bottom}/>
 </div>;
}
function PreviewEdge({sourceX,sourceY,targetX,targetY,markerEnd}:EdgeProps){
 const halfway=Math.round((sourceY+targetY)/2);
 const path=`M ${sourceX} ${sourceY} V ${halfway} H ${targetX} V ${targetY}`;
 return <BaseEdge path={path} markerEnd={markerEnd} style={{stroke:'#70867b',strokeWidth:2}}/>;
}
const nodeTypes={preview:PreviewNode};
const edgeTypes={preview:PreviewEdge};

function GraphToolbar(){
 const flow=useReactFlow(),{zoom}=useViewport();
 return <div className="p3b-graph-toolbar" aria-label="图谱缩放验证">
  <span>当前缩放 {Math.round(zoom*100)}%</span>
  {[1,.75,.5].map(value=><button key={value} type="button" onClick={()=>void flow.setCenter(graphCenter.x,graphCenter.y,{zoom:value,duration:0})}>{Math.round(value*100)}%</button>)}
  <button type="button" onClick={()=>void flow.fitView({padding:.12,duration:0})}>Fit View</button>
  {keyLockedId&&<button type="button" onClick={()=>{const position=previewPosition[keyLockedId];void flow.setCenter(position.x+50,position.y+50,{zoom:.75,duration:0});}}>定位 Key Locked</button>}
 </div>;
}

export default function P3BFramePreview(){
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [ready,setReady]=useState(false);
 const nodes=useMemo<FlowNode[]>(()=>worldGraph.nodes.map(node=>{
  const name=worldNodes.get(node.id)?.canonicalName??node.id;
  return {id:node.id,type:'preview',position:previewPosition[node.id],width:100,height:100,data:{nodeId:node.id,name,level:levelById.get(node.id)!,state:previewStateById.get(node.id)!,selected:selectedId===node.id,onSelect:setSelectedId} satisfies PreviewNodeData};
 }),[selectedId]);
 const edges=useMemo<FlowEdge[]>(()=>worldGraph.edges.filter(edge=>edge.dependencyType==='strong').map(edge=>({id:edge.id,type:'preview',source:edge.sourceNodeId,target:edge.targetNodeId,markerEnd:{type:MarkerType.ArrowClosed,color:'#70867b'}})),[]);
 const counts=useMemo(()=>Object.fromEntries(frameLevels.map(level=>[level,worldGraph.nodes.filter(node=>levelById.get(node.id)===level).length])) as Record<FrameLevel,number>,[]);
 useEffect(()=>{document.title='P3B Node Frame Preview · Minetoast';},[]);
 return <main className="p3b-page">
  <header className="p3b-header"><div><p>KNOWLEDGE WORLD / PHASE 3B</p><h1>9-State Knowledge Node Frame System</h1><span>仅验证节点框。下方 32 节点图谱使用 Phase 2 真实节点与 Strong 边；九态为内存中的展示覆盖，不代表学生进度。</span></div><a href="/function-world">返回 Phase 2 Function Graph</a></header>
  <section className="p3b-matrix" id="p3b-matrix" aria-labelledby="p3b-matrix-title">
   <div className="p3b-matrix__head"><div><h2 id="p3b-matrix-title">FRAME MATRIX / 3 × 3</h2><p>同一测试占位符 · 同一画布 · 同一比例</p></div><div className="p3b-matrix__legend"><span>□ 未解锁</span><span>▦ 可解锁</span><span>▣ 已掌握</span></div></div>
   <div className="p3b-matrix__grid" role="table" aria-label="九态节点框对照板">
    <div className="p3b-matrix__axis" role="columnheader">LEVEL / STATE</div>
    {frameStates.map(state=><div className="p3b-matrix__axis" role="columnheader" key={state}>{state.toUpperCase()}<small>{frameStateLabels[state]}</small></div>)}
    {frameLevels.flatMap(level=>[
     <div className="p3b-matrix__axis p3b-matrix__axis--row" role="rowheader" key={`${level}-label`}>{level==='key'?'KEY ACHIEVEMENT':level.toUpperCase()}<small>{frameLevelLabels[level]}</small></div>,
     ...frameStates.map(state=><div className="p3b-matrix__cell" role="cell" data-combination={`${level}_${state}`} key={`${level}-${state}`}><KnowledgeNodeFrame level={level} state={state}/><span>{level.toUpperCase()}_{state.toUpperCase()}</span></div>)
    ])}
   </div>
  </section>
  <section className="p3b-graph-section" aria-labelledby="p3b-graph-title">
   <div className="p3b-graph-intro"><div><h2 id="p3b-graph-title">真实 32 节点图谱预览</h2><p>Normal {counts.normal} · Core {counts.core} · Key {counts.key}。每级前三个节点依次覆盖 Locked、Available、Unlocked；其余为 Locked。名称通过聚焦/悬停读取；只验证视觉密度，不改解锁语义。</p></div><div className="p3b-graph-intro__tags"><span>HOVER = 点状外框</span><span>SELECTED = 连续外框</span><span>FOCUS = 高对比外框</span></div></div>
   {selectedId&&<div className="p3b-selected" role="status">选中：{worldNodes.get(selectedId)?.canonicalName} · {frameLevelLabels[levelById.get(selectedId)!]} · {frameStateLabels[previewStateById.get(selectedId)!]}</div>}
   <div className="p3b-graph-stage" data-ready={ready}>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} minZoom={.1} maxZoom={1.5} onInit={flow=>{setReady(true);window.setTimeout(()=>void flow.fitView({padding:.12,duration:0}),0)}} proOptions={{hideAttribution:false}}>
     <Background color="#3f5049" gap={32} size={1}/><MiniMap pannable zoomable nodeColor={node=>{const level=(node.data as unknown as PreviewNodeData).level;return level==='key'?'#d4bd7f':level==='core'?'#88a99b':'#657970'}} maskColor="rgba(8,16,13,.62)"/>
    </ReactFlow>
    <GraphToolbar/>
   </div>
  </section>
 </main>;
}
