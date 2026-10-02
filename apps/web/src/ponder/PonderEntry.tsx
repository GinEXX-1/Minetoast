import {createPortal} from 'react-dom';
import {Component,lazy,Suspense,useState,type ReactNode} from 'react';
import {demonstrationsForNode} from '../../../../content/ponder/catalog';
import './ponder.css';
const Focus=lazy(()=>import('./PonderFocus'));
class PonderErrorBoundary extends Component<{children:ReactNode;exit:()=>void},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div role="alert" className="ponder-load-error">原理演示加载失败。<button onClick={this.props.exit}>返回知识详情</button></div>:this.props.children;}
}
export default function PonderEntry({nodeId}:{nodeId:string}){
 const demos=demonstrationsForNode(nodeId),[active,setActive]=useState<string|null>(null);
 if(!demos.length)return null;
 const scene=demos.find(d=>d.id===active);
 return <section className="ponder-entry" aria-label="原理演示"><h3>原理演示</h3><p>观察变化，理解数学关系。</p>{demos.map((d,i)=><button className="ponder-start" key={d.id} onClick={()=>setActive(d.id)}>{i===0?'按下开始思索':d.title}</button>)}{scene&&createPortal(<PonderErrorBoundary key={scene.id} exit={()=>setActive(null)}><Suspense fallback={<p className="ponder-loading" role="status">思索场景加载中…</p>}><Focus key={scene.id} definition={scene} onExit={()=>setActive(null)}/></Suspense></PonderErrorBoundary>,document.body)}</section>;
}
