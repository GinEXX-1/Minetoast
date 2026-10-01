import {useEffect,useMemo,useRef,useState,lazy,Suspense} from 'react';
import {functionDetailById,functionNodeDetails,searchFunctionDetails} from '../../../content/fixtures/function-details';
import {functionCandidateGraph} from '../../../content/fixtures/function-dependencies';
import type {KnowledgeNodeDetail} from '../../../packages/domain/src/knowledge-node-detail';
import './function-content-preview.css';

const LazyFormula=lazy(()=>import('./Formula'));
function Formula({latex}:{latex:string}){return <Suspense fallback={<p>公式加载中…</p>}><LazyFormula latex={latex}/></Suspense>;}
function Detail({detail,onClose,onSelect}:{detail:KnowledgeNodeDetail;onClose:()=>void;onSelect:(id:string)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!dialog.current?.open)dialog.current?.showModal();},[]);
 const incoming=detail.relationships.incoming,outgoing=detail.relationships.outgoing;
 return <dialog ref={dialog} className="detail-drawer p2c-drawer" aria-label={`${detail.identity.knowledgeName}知识详情`} onCancel={onClose} onClose={onClose}>
  <div className="dialog-heading"><span className="eyebrow">Phase 2C · 内容候选 · {detail.metadata.gateStatus}</span><button aria-label="关闭详情" onClick={onClose}>×</button></div>
  <h2>{detail.identity.knowledgeName}</h2><p className="achievement">{detail.identity.achievementName} · {detail.identity.englishName}</p>
  <p>{detail.overview}</p><h3>定义与范围</h3><p>{detail.definition}</p><h3>核心概念</h3><ul>{detail.coreConcepts.map(x=><li key={x}>{x}</li>)}</ul>
  <h3>公式</h3>{detail.formulas.map(f=><section key={f.id}><Formula latex={f.latex}/><p className="conditions">{f.explanation}。条件：{f.conditions}</p></section>)}
  <h3>直觉与推理</h3><p>{detail.intuition}</p><p>{detail.derivation}</p><h3>应会技能</h3><ul>{detail.skills.map(x=><li key={x}>{x}</li>)}</ul>
  {detail.examples.map((e,i)=><section key={i}><h3>例题与完整过程</h3><p><strong>问题：</strong>{e.problem}</p><p><strong>识别：</strong>{e.recognition}</p><p><strong>推理：</strong>{e.reasoning}</p><p><strong>计算：</strong>{e.calculation}</p><p><strong>答案：</strong>{e.answer}</p><p><strong>洞察：</strong>{e.insight}</p></section>)}
  <h3>常见高考任务</h3><ul>{detail.gaokaoPatterns.map(x=><li key={x}>{x}</li>)}</ul><h3>易错点</h3>{detail.commonMistakes.map((m,i)=><p key={i}><strong>{m.mistake}</strong><br/>原因：{m.why}<br/>修正：{m.correction}</p>)}
  <h3>教材证据</h3>{detail.textbookReferences.map((r,i)=><p className="conditions" key={i}>{r.volume} · {r.chapter} · {r.section??'章内栏目'} · {r.subsection}<br/>印刷页：{r.printedPage??'REVIEW_REQUIRED'}；PDF页：{r.pdfPage??'REVIEW_REQUIRED'}；{r.sourceRef}<br/>证据：{r.evidenceStatus}。范围：{r.scopeNote}</p>)}
  <h3>图谱关系（Phase 2B 候选）</h3><p className="conditions">下列关系只反映当前已通过且启用的候选边；本页不触发掌握状态、解锁或发布。</p>
  <h4>Strong / Weak 前置</h4>{incoming.length?incoming.map(r=><div className="prerequisite" key={r.edgeId}><span>{r.dependencyType.toUpperCase()} · {r.knowledgeName}<small>{r.rationale}</small></span><button onClick={()=>onSelect(r.nodeId)}>查看</button></div>):<p>当前候选图中无已启用前置边。</p>}
  <h4>后继</h4>{outgoing.length?outgoing.map(r=><div className="prerequisite" key={r.edgeId}><span>{r.dependencyType.toUpperCase()} · {r.knowledgeName}<small>{r.rationale}</small></span><button onClick={()=>onSelect(r.nodeId)}>查看</button></div>):<p>当前候选图中无已启用后继边。</p>}
  <p className="conditions">内容置信度：{detail.metadata.confidence}；证据状态：{detail.metadata.evidenceStatus}。</p>
 </dialog>;
}
export default function FunctionContentPreview(){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState<string|null>(null);
 const results=useMemo(()=>query?searchFunctionDetails(query):functionNodeDetails,[query]);
 const detail=selected?functionDetailById.get(selected):undefined;
 return <main className="p2c-preview">
  <header><div><h1>数学 · Knowledge World</h1><p>Phase 2C · Function Detail Content Preview · 隔离候选数据</p></div><span className="p2c-badge">{functionCandidateGraph.nodes.length} active nodes · 未发布</span></header>
  <section className="p2c-notice"><strong>预览模式</strong><span>只读展示 Phase 2B 候选图及 Phase 2C 内容；不会读写账户进度、数据库草稿或生产快照。</span></section>
  <label className="p2c-search">搜索知识<input aria-label="搜索知识详情" value={query} onChange={e=>setQuery(e.target.value)} placeholder="中文 / 拼音 / 首字母 / English / 数学符号 / 学生常用词" maxLength={100}/></label>
  <section className="p2c-list" aria-label="函数知识节点">{results.map(d=><button className="p2c-card" key={d.identity.nodeId} onClick={()=>setSelected(d.identity.nodeId)}><span>{d.identity.knowledgeName}</span><small>{d.identity.nodeId} · {d.metadata.gateStatus} · {d.metadata.evidenceStatus}</small><p>{d.overview}</p></button>)}{!results.length&&<p>没有匹配节点</p>}</section>
  <footer>内容状态 CANDIDATE · 教材页码分别展示印刷页与PDF页 · 不包含 2D 资源或生产发布</footer>
  {detail&&<Detail key={detail.identity.nodeId} detail={detail} onClose={()=>setSelected(null)} onSelect={setSelected}/>}
 </main>;
}
