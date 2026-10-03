import {MinetoastBrand} from './MinetoastBrand';
import {openSettings} from './settings/preferences';
import './project-about.css';

// Production deployments: initial 2a41e02, then 4f2012f, e3a3cad, 1f6cb93.
// Increment after a verified production revision; local changes do not count.
const productionRevision=3;

export default function ProjectAbout(){
 return <main className="knowledge-portal project-about">
  <header className="portal-header"><MinetoastBrand className="portal-brand"/><div className="portal-title"><span>项目说明 / ABOUT</span><h1>关于 Minetoast</h1><p>交互式高中数学知识图谱</p></div></header>
  <div className="portal-shell"><aside className="portal-rail" aria-label="主导航"><div className="portal-rail-heading">导航</div><a href="/">知识体系</a><a className="active" href="/about" aria-current="page">项目说明</a><button className="portal-settings-entry" type="button" onClick={openSettings}>设置</button></aside>
   <article className="project-about-content"><p className="portal-kicker">MINETOAST · HIGH SCHOOL MATHEMATICS</p><h2>项目说明</h2><p>Minetoast 以知识节点和前置关系组织高中数学内容。学习者可以查看九个知识体系的图谱、节点说明与学习进度，并通过“思索”观察部分知识点的数学原理。</p><p>知识图谱区分强前置关系与辅助理解的弱关系。思索的观看记录和节点掌握进度分别保存；当前知识体系进度保存在此浏览器的本机存储中。</p>
    <dl><div><dt>作者</dt><dd>GinEXX-1</dd></div><div><dt>版本号</dt><dd>v1.{productionRevision}<small>首次生产部署后第 {productionRevision} 次改版；本地未部署改动不计入。</small></dd></div><div><dt>GitHub</dt><dd><a href="https://github.com/GinEXX-1/Minetoast" target="_blank" rel="noopener noreferrer">GinEXX-1/Minetoast ↗</a></dd></div></dl>
    <a className="project-about-back" href="/">← 返回知识体系</a>
   </article></div>
 </main>;
}
