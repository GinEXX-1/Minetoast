import {it,expect} from 'vitest';
import {applyLayoutOverrides} from '../../packages/graph-core/src/layout';
it('applies only the current version, reports collisions, and preserves the cached auto layout',()=>{
 const auto={a:{x:0,y:0},b:{x:300,y:0}};
 const result=applyLayoutOverrides(auto,[{nodeId:'b',x:50,y:0,layoutVersion:'v1'},{nodeId:'a',x:999,y:999,layoutVersion:'old'}]);
 expect(result.positions.b.x).toBe(50);expect(result.positions.a.x).toBe(0);expect(auto.b.x).toBe(300);expect(result.warnings).toEqual(['LAYOUT_COLLISION:a:b']);
});
