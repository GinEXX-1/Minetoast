import {describe,it,expect} from 'vitest';
import {fixture,nodeSpecs} from '../../content/fixtures/function-slice';
import {statusOf,strongAncestors,strongParents,validateGraph} from '../../packages/graph-core/src/index';
const id=(i:number)=>nodeSpecs[i][0];
describe('20-node fixture and state semantics',()=>{
 it('contains exactly 20 test nodes, 3 middle-school nodes and valid reduced DAG',()=>{expect(fixture.nodes).toHaveLength(20);expect(fixture.nodes.filter(n=>n.stage==='middle_school')).toHaveLength(3);expect(validateGraph(fixture)).toEqual([]);});
 it('root is available and children locked with empty progress',()=>{expect(statusOf(fixture,new Set(),id(0))).toBe('available');expect(statusOf(fixture,new Set(),id(6))).toBe('locked');});
 it('requires every direct strong parent',()=>{const parents=strongParents(fixture,id(7));expect(parents).toHaveLength(2);expect(statusOf(fixture,new Set([parents[0]]),id(7))).toBe('locked');expect(statusOf(fixture,new Set(parents),id(7))).toBe('available');});
 it('weak source is not needed for availability or initialization',()=>{expect(statusOf(fixture,new Set([id(10)]),id(15))).toBe('available');const closure=strongAncestors(fixture,[id(15)]);expect(closure.has(id(14))).toBe(false);expect(closure.has(id(7))).toBe(false);expect(closure.has(id(15))).toBe(true);});
 it('non-cascading revoke retains unlocked successor',()=>{const u=strongAncestors(fixture,[id(15)]);u.delete(id(10));expect(statusOf(fixture,u,id(15))).toBe('unlocked');expect(statusOf(fixture,u,id(14))).toBe('locked');});
 it('batch closure is idempotent and excludes weak and siblings',()=>{const a=strongAncestors(fixture,[id(15),id(15)]);expect(a).toEqual(strongAncestors(fixture,[id(15)]));expect(a.has(id(14))).toBe(false);expect(a.has(id(11))).toBe(false);});
 it('detects mixed-edge cycles and transitive redundancies',()=>{const edge={...fixture.edges[0],id:'extra',sourceNodeId:id(15),targetNodeId:id(0),dependencyType:'weak' as const};expect(validateGraph({...fixture,edges:[...fixture.edges,edge]}).some(s=>s.startsWith('CYCLE'))).toBe(true);const redundant={...edge,id:'redundant',sourceNodeId:id(0),targetNodeId:id(15),dependencyType:'strong' as const};expect(validateGraph({...fixture,edges:[...fixture.edges,redundant]})).toContain('TRANSITIVE_REDUNDANCY:redundant');});
});
