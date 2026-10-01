import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {describe,expect,it} from 'vitest';
import {mathCraftDesigns,representativeIconIds} from '../../apps/web/src/MathCraftIcon';
import {worldGraph} from '../../apps/web/src/function-world-model';

describe('MathCraft pixel assets',()=>{
 it('covers exactly the 32 current nodes with 32×32 integer-aligned geometry',()=>{
  const graphIds=new Set(worldGraph.nodes.map(node=>node.id));
  expect(Object.keys(mathCraftDesigns).sort()).toEqual([...graphIds].sort());
  expect(representativeIconIds).toHaveLength(12);
  for(const design of Object.values(mathCraftDesigns))for(const [x,y,width,height] of [...design.base,...(design.accent??[]),...(design.light??[])]){
   expect([x,y,width,height].every(Number.isInteger)).toBe(true);
   expect(x).toBeGreaterThanOrEqual(0);expect(y).toBeGreaterThanOrEqual(0);
   expect(width).toBeGreaterThan(0);expect(height).toBeGreaterThan(0);
   expect(x+width).toBeLessThanOrEqual(32);expect(y+height).toBeLessThanOrEqual(32);
  }
 });

 it('keeps exported files identical to the SHA-256 manifest',async()=>{
  const directory=join(process.cwd(),'assets','phase-3','mathcraft','icons');
  const manifest=JSON.parse(await readFile(join(directory,'manifest.json'),'utf8')) as {count:number;icons:{nodeId:string;file:string;sha256:string}[]};
  expect(manifest.count).toBe(32);
  expect(new Set(manifest.icons.map(icon=>icon.nodeId)).size).toBe(32);
  for(const icon of manifest.icons){
   const svg=await readFile(join(directory,icon.file),'utf8');
   expect(createHash('sha256').update(svg).digest('hex')).toBe(icon.sha256);
   expect(svg).toContain('viewBox="0 0 32 32"');
   expect(svg).not.toMatch(/<image\b|data:image|<foreignObject\b/i);
  }
 });
});
