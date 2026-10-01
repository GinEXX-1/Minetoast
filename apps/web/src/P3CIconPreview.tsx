import {worldGraph,worldNodes} from './function-world-model';
import {KnowledgeNodeFrame} from './KnowledgeNodeFrame';
import {MathCraftIcon,mathCraftDesigns,representativeIconIds} from './MathCraftIcon';
import './p3c-icon-preview.css';

const allIds=worldGraph.nodes.map(node=>node.id).filter(id=>mathCraftDesigns[id]);
function Inventory({ids,title,testId}:{ids:readonly string[];title:string;testId:string}){
 return <section className="p3c-inventory" data-testid={testId}>
  <h2>{title} <small>{ids.length} ITEMS</small></h2>
  <div className="p3c-inventory__grid">{ids.map(id=>{
   const name=worldNodes.get(id)?.canonicalName??id;
   return <div className="p3c-inventory__item" data-node-id={id} key={id}>
    <KnowledgeNodeFrame level="normal" state="unlocked" name={name} icon={<MathCraftIcon nodeId={id} name={name} decorative/>}/>
    <strong>{name}</strong><small>{id}</small>
   </div>;
  })}</div>
 </section>;
}

export default function P3CIconPreview(){
 const sample='HS-FUNC-GRAPH-001';
 return <main className="p3c-page">
  <header className="p3c-header"><div><p>KNOWLEDGE WORLD / PHASE 3C</p><h1>MathCraft Item System</h1><span>32×32 整数网格 · 同一材质与光源 · 原创数学语义 · 透明 SVG。仅为图标资产审阅，不改学习进度。</span></div><a href="/phase-3b-frames">查看九态 Frame</a></header>
  <Inventory ids={representativeIconIds} title="代表图标验证" testId="p3c-representatives"/>
  <section className="p3c-state-test"><h2>同一图标 × 三种状态</h2><div>{(['locked','available','unlocked'] as const).map(state=><figure key={state}><KnowledgeNodeFrame level="core" state={state} name="函数的图像" icon={<MathCraftIcon nodeId={sample} decorative/>}/><figcaption>{state.toUpperCase()}</figcaption></figure>)}</div></section>
  <Inventory ids={allIds} title="完整 Inventory 检查" testId="p3c-inventory"/>
 </main>;
}
