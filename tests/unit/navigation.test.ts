import {describe,it,expect} from 'vitest';
import {fixture} from '../../content/fixtures/function-slice';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import {indexGraph,findPath,searchNodes,normalizeSearch,domainPortals,projectStatuses} from '../../packages/graph-core/src/index';
describe('indexed navigation',()=>{
 const index=indexGraph(fixture),root=fixture.nodes[0].id,target=fixture.nodes[15].id;
 it('To/From/Between are directed Strong-only induced subgraphs',()=>{
  const to=findPath(index,{mode:'to',nodeId:target}),from=findPath(index,{mode:'from',nodeId:root}),between=findPath(index,{mode:'between',source:root,target});
  expect(new Set(between.nodeIds)).toEqual(new Set(to.nodeIds));expect(from.nodeIds.length).toBeGreaterThan(to.nodeIds.length);
  expect(to.nodeIds).not.toContain(fixture.nodes[14].id);expect(findPath(index,{mode:'between',source:target,target:root}).reachable).toBe(false);
  expect(findPath(index,{mode:'between',source:target,target})).toEqual({reachable:true,nodeIds:[target],edgeIds:[]});
 });
 it('matches notation, pinyin, aliases and tolerates one typo without dropping operators',()=>{
  const n={...fixture.nodes[15],nameEn:'quadratic',namePinyin:'ercihanshu',pinyinInitials:'echs',mathNotationAliases:['b^2','f\'','a_{n}']};
  for(const q of ['ECHS','erci','抛物线','b²','f′','a_n','quadrati'])expect(searchNodes([n],q)).toEqual([n]);
  expect(searchNodes([n],'')).toEqual([]);expect(normalizeSearch('x+1')).not.toBe(normalizeSearch('x-1'));
 });
 it('does not cascade revocation, and excludes retired nodes from projection',()=>{expect(projectStatuses(index,new Set([target]))[target]).toBe('unlocked');expect(indexGraph({nodes:[{...fixture.nodes[0],retired:true}],edges:[]}).nodesById.size).toBe(0);});
 it('Portal identities are never graph identities',()=>{const graph={...fixture,nodes:fixture.nodes.map((n,i)=>i===15?{...n,domainId:'other'}:n)};const ix=indexGraph(graph);const portals=domainPortals(ix,'functions');expect(portals.length).toBeGreaterThan(0);for(const p of portals){expect(p.id).toMatch(/^view:portal:/);expect(ix.nodesById.has(p.id)).toBe(false);expect(p.targetNodeId).toBe(target);}});
 it('seeded DAG properties agree with an independent reachability oracle',()=>{
  for(let seed=1;seed<=30;seed++){
   let state=seed;const rnd=()=>{state=(state*1664525+1013904223)>>>0;return state/2**32;};
   const nodes=fixture.nodes.slice(0,12),edges:KnowledgeEdge[]=[];
   for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++)if(rnd()<.2)edges.push({...fixture.edges[0],id:`${a}-${b}`,sourceNodeId:nodes[a].id,targetNodeId:nodes[b].id});
   const ix=indexGraph({nodes,edges}),reach=nodes.map((_,a)=>nodes.map((_,b)=>a===b||edges.some(e=>e.sourceNodeId===nodes[a].id&&e.targetNodeId===nodes[b].id)));
   for(let k=0;k<nodes.length;k++)for(let a=0;a<nodes.length;a++)for(let b=0;b<nodes.length;b++)reach[a][b] ||= reach[a][k]&&reach[k][b];
   for(let a=0;a<nodes.length;a++)for(let b=0;b<nodes.length;b++)expect(new Set(findPath(ix,{mode:'between',source:nodes[a].id,target:nodes[b].id}).nodeIds)).toEqual(new Set(nodes.filter((_,k)=>reach[a][k]&&reach[k][b]).map(n=>n.id)));
  }
 });
});
