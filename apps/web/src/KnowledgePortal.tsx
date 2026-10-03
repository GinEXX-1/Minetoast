import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {MinetoastBrand} from './MinetoastBrand';
import {trigonometrySeed} from '../../../content/fixtures/trigonometry-system';
import {sequencesSeed} from '../../../content/fixtures/sequences-system';
import {setsLogicSeed} from '../../../content/fixtures/sets-logic-system';
import {algebraSeed} from '../../../content/fixtures/algebra-system';
import {vectorsSeed} from '../../../content/fixtures/vectors-system';
import {geometrySeed} from '../../../content/fixtures/geometry-system';
import {probabilitySeed} from '../../../content/fixtures/probability-system';
import {calculusSeed} from '../../../content/fixtures/calculus-system';
import {worldGraph} from './function-world-model';
import {createCurriculumAudioController} from './curriculum-audio';
import {CurriculumPixelIcon} from './CurriculumPixelIcon';
import {openSettings} from './settings/preferences';
import './knowledge-portal.css';
import './portal-mobile.css';

const CurriculumSystemWorld = lazy(() => import('./CurriculumSystemWorld'));

type System = {
  id: string;
  name: string;
  english: string;
  description: string;
  status: 'live' | 'candidate' | 'building';
  reviewStatus: 'approved' | 'review';
  count?: number;
  image: number;
  mark: string;
};

const systems: System[] = [
  { id: 'sets-logic', name: '集合与逻辑', english: 'SETS & LOGIC', description: '集合语言、命题与逻辑推理', status: 'candidate', reviewStatus: 'approved', count: setsLogicSeed.concepts.length, image: 6, mark: '∈' },
  { id: 'algebra', name: '代数与不等式', english: 'ALGEBRA', description: '式的运算、方程与大小关系', status: 'candidate', reviewStatus: 'approved', count: algebraSeed.concepts.length, image: 14, mark: '±' },
  { id: 'functions', name: '函数', english: 'FUNCTIONS', description: '从对应关系到函数性质与应用', status: 'live', reviewStatus: 'approved', count: 32, image: 7, mark: 'ƒ' },
  { id: 'trigonometry', name: '三角函数', english: 'TRIGONOMETRY', description: '角、单位圆、周期与图象', status: 'candidate', reviewStatus: 'approved', count: trigonometrySeed.concepts.length, image: 16, mark: 'θ' },
  { id: 'sequences', name: '数列', english: 'SEQUENCES', description: '递推、通项与求和关系', status: 'candidate', reviewStatus: 'approved', count: sequencesSeed.concepts.length, image: 8, mark: 'Σ' },
  { id: 'vectors', name: '平面向量', english: 'VECTORS', description: '方向、坐标与数量积', status: 'candidate', reviewStatus: 'approved', count: vectorsSeed.concepts.length, image: 12, mark: '→' },
  { id: 'geometry', name: '几何与空间向量', english: 'GEOMETRY', description: '立体几何、直线圆与圆锥曲线', status: 'candidate', reviewStatus: 'approved', count: geometrySeed.concepts.length, image: 13, mark: '◇' },
  { id: 'probability', name: '概率与统计', english: 'PROBABILITY', description: '随机现象、数据与统计推断', status: 'candidate', reviewStatus: 'approved', count: probabilitySeed.concepts.length, image: 9, mark: 'P' },
  { id: 'calculus', name: '导数', english: 'CALCULUS', description: '变化率、切线与函数研究', status: 'candidate', reviewStatus: 'approved', count: calculusSeed.concepts.length, image: 10, mark: 'd/dx' },
];
const plannedNodeCount = 350;
const formalNodeCount = worldGraph.nodes.length;
const formalNodeIds = new Set(worldGraph.nodes.map(node => node.id));
const candidateConceptIds = [setsLogicSeed,algebraSeed,trigonometrySeed,sequencesSeed,vectorsSeed,geometrySeed,probabilitySeed,calculusSeed].flatMap(system=>system.concepts.map(concept=>concept.id));
const candidateNodeCount = new Set(candidateConceptIds.filter(id=>!formalNodeIds.has(id))).size;
const systemCount = systems.length;
const liveSystemCount = systems.filter(system => system.status === 'live').length;
const approvedSystemCount = systems.filter(system => system.reviewStatus === 'approved').length;
const reviewSystemCount = systems.filter(system => system.reviewStatus === 'review').length;
const buildingSystemCount = systems.filter(system => system.status === 'building').length;

function SystemCard({ system, index }: { system: System; index: number }) {
  const live = system.status === 'live';
  const approved = system.reviewStatus === 'approved';
  return <a className={`portal-card${live ? ' is-live' : approved ? ' is-approved' : ' is-building'}`} href={live ? '/function-world' : `/systems/${system.id}`} style={{ '--card-bg': `url('/backgrounds/knowledge-${system.image}.webp')`, '--card-index': index } as CSSProperties}>
    <span className="portal-card-mark" aria-hidden="true"><CurriculumPixelIcon systemId={system.id}/></span>
    <span className="portal-card-copy">
      <small>{system.english}</small>
      <strong>{system.name}</strong>
      <span>{system.description}</span>
    </span>
    <span className={`portal-card-state ${live || approved ? 'ready' : ''}`}>{live ? `${system.count} 个正式节点 · 已通过审核并接入` : approved ? `${system.count} 个候选节点 · 已通过审核` : '图谱接入中'}</span>
    <span className="portal-card-arrow" aria-hidden="true">{live ? '→' : '↗'}</span>
  </a>;
}

export function KnowledgePortal() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'approved' | 'review' | 'building'>('all');
  const audio = useMemo(createCurriculumAudioController, []);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);
  const visibleSystems = useMemo(() => systems.filter(system => {
    const matchesFilter = filter === 'all' || (filter === 'approved' ? system.reviewStatus === 'approved' : filter === 'review' ? system.reviewStatus === 'review' : system.status === filter);
    const needle = query.trim().toLocaleLowerCase();
    const matchesQuery = !needle || `${system.name} ${system.english} ${system.description}`.toLocaleLowerCase().includes(needle);
    return matchesFilter && matchesQuery;
  }), [filter, query]);

  return <main className="knowledge-portal" onClickCapture={audio.playClick}>
    <header className="portal-header">
      <MinetoastBrand className="portal-brand"/>
      <div className="portal-title"><span>学习总览 / KNOWLEDGE ATLAS</span><h1>数学 · Minetoast</h1><p>从知识关系出发，找到每个体系的学习路径。</p></div>
      <div className="portal-header-actions"><span className="visitor-label">本地浏览</span></div>
    </header>

    <div className="portal-shell">
      <aside className="portal-rail" aria-label="主导航">
        <div className="portal-rail-heading">导航</div>
        <a className="active" href="#systems">知识体系</a>
        <a href="/about">项目说明</a>
        <button className="portal-settings-entry" type="button" onClick={openSettings}>设置</button>
        <div className="portal-rail-heading portal-rail-domains">体系索引 <span>09</span></div>
        <nav>{systems.map(s => <a href={s.status === 'live' ? '/function-world' : `/systems/${s.id}`} key={s.id}><i className={s.reviewStatus === 'approved' ? 'dot live' : 'dot'} />{s.name}</a>)}</nav>
        <div className="portal-rail-note"><b>审核状态</b><span>通过审核 {approvedSystemCount}/{systemCount} · 正式节点 {formalNodeCount} · 候选节点 {candidateNodeCount}</span></div>
      </aside>

      <section className="portal-content" id="systems">
        <div className="portal-overview">
          <div><span className="portal-kicker">HIGH SCHOOL MATHEMATICS</span><h2>选择一个知识世界</h2><p>每个体系独立呈现知识节点、前置关系与学习进度。</p></div>
          <div className="portal-metrics" aria-label="知识库接入统计"><div><b>{String(systemCount).padStart(2,'0')}</b><span>知识体系</span></div><i /><div><b>{String(formalNodeCount).padStart(3,'0')}</b><span>正式节点</span></div><i /><div><b>{String(candidateNodeCount).padStart(3,'0')}</b><span>候选节点</span></div><i /><div><b>{plannedNodeCount}+</b><span>规划规模</span></div></div>
        </div>

        <div className="portal-controls">
          <label className="portal-search"><span aria-hidden="true">⌕</span><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索知识体系" aria-label="搜索知识体系"/><kbd>⌘ K</kbd></label>
          <div className="portal-filters" role="group" aria-label="筛选知识体系">
            <button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>全部 <span>{String(systemCount).padStart(2,'0')}</span></button>
            <button className={filter === 'live' ? 'selected' : ''} onClick={() => setFilter('live')}>已接入 <span>{String(liveSystemCount).padStart(2,'0')}</span></button>
            <button className={filter === 'approved' ? 'selected' : ''} onClick={() => setFilter('approved')}>已通过审核 <span>{String(approvedSystemCount).padStart(2,'0')}</span></button>
            <button className={filter === 'review' ? 'selected' : ''} onClick={() => setFilter('review')}>待审核 <span>{String(reviewSystemCount).padStart(2,'0')}</span></button>
            <button className={filter === 'building' ? 'selected' : ''} onClick={() => setFilter('building')}>构建中 <span>{String(buildingSystemCount).padStart(2,'0')}</span></button>
          </div>
        </div>

        <div className="portal-grid" aria-live="polite">
          {visibleSystems.map((system, index) => <SystemCard key={system.id} system={system} index={index}/>) }
          {visibleSystems.length === 0 && <p className="portal-empty">没有匹配的知识体系。</p>}
        </div>

        <section className="portal-note"><span className="portal-note-icon"><CurriculumPixelIcon systemId="geometry" width={24} height={24}/></span><p><b>体系审核状态</b><br/>{approvedSystemCount} 个知识体系均已通过审核；其中函数体系的 {formalNodeCount} 个节点已正式接入，其他专题的 {candidateNodeCount} 个节点保留候选标识并可在独立页面学习。</p></section>
        <footer className="portal-footer"><span>MINETOAST · HIGH SCHOOL MATHEMATICS</span><span>图谱数据按正式发布版本统计</span></footer>
      </section>
    </div>
  </main>;
}

export function KnowledgeSystemPage({ systemId }: { systemId: string }) {
  const system = systems.find(item => item.id === systemId);
  if (!system) return <main className="system-empty"><p>未找到该知识体系。</p><a href="/">返回知识总览</a></main>;
  const seed = systemId === 'trigonometry' ? trigonometrySeed
    : systemId === 'sequences' ? sequencesSeed
    : systemId === 'sets-logic' ? setsLogicSeed
    : systemId === 'algebra' ? algebraSeed
    : systemId === 'vectors' ? vectorsSeed
    : systemId === 'geometry' ? geometrySeed
    : systemId === 'probability' ? probabilitySeed
    : systemId === 'calculus' ? calculusSeed
    : null;
  if (seed) return <Suspense fallback={<div className="loading">加载知识世界…</div>}><CurriculumSystemWorld seed={seed}/></Suspense>;
  return <main className="system-page" style={{ '--system-bg': `url('/backgrounds/knowledge-${system.image}.webp')` } as CSSProperties}>
    <header><a href="/">← 返回知识总览</a><span>KNOWLEDGE WORLD / {system.english}</span></header>
    <section className="system-page-panel"><span className="portal-kicker">HIGH SCHOOL MATHEMATICS</span><h1>{system.name}</h1><p>{system.description}</p><div className="system-status"><i className="dot"/>该体系尚未接入正式知识图谱</div><p className="system-explanation">此页面已建立独立入口。正式节点、前置关系和学习进度将在完成内容审核并发布后显示。</p><a className="portal-account" href="/">返回知识体系目录 <b>↗</b></a></section>
  </main>;
}
