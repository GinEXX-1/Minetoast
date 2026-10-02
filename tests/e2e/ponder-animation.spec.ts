import {test,expect} from '@playwright/test';
import {openGeometry} from './ponder-helpers';
import {resolve} from 'node:path';
const evidence=resolve('docs/ponder/evidence');
test('Minecraft font actually loads across the shell; initial circle is drawn, pause freezes and replay restarts',async({page})=>{
 await openGeometry(page,'圆的标准方程');await page.getByRole('button',{name:'重播本步'}).click();
 const circle=page.locator('[data-object=circle]');await expect.poll(()=>circle.getAttribute('stroke-dashoffset')).not.toBe('0');
 await page.screenshot({path:resolve(evidence,'circle-construction-start.png')});
 await expect.poll(()=>circle.getAttribute('stroke-dashoffset')).toBe('0');
 await page.getByRole('button',{name:'暂停',exact:true}).click();const stopped=await circle.getAttribute('stroke-dashoffset');await page.waitForTimeout(150);expect(await circle.getAttribute('stroke-dashoffset')).toBe(stopped);
 const fonts=await page.evaluate(async()=>{await document.fonts.ready;return {loaded:document.fonts.check('16px KnowledgeMinecraft','思索函数Math'),families:['.ponder-hud h2','.ponder-caption p','.ponder-controls button','.ponder-timeline button'].map(s=>getComputedStyle(document.querySelector(s)!).fontFamily)};});
 expect(fonts.loaded).toBe(true);for(const family of fonts.families)expect(family).toContain('KnowledgeMinecraft');await page.screenshot({path:resolve(evidence,'circle-construction-end.png')});await page.keyboard.press('Escape');
});
test('real Three.js construction and guided camera change across time while the scene stays mounted',async({page})=>{
 await openGeometry(page,'线面垂直判定定理');await page.getByRole('button',{name:'下一步',exact:true}).click();const canvas=page.getByTestId('ponder-webgl-canvas');
 const initial=await canvas.getAttribute('data-camera');await page.screenshot({path:resolve(evidence,'spatial-construction-start.png')});
 await expect.poll(()=>canvas.getAttribute('data-camera')).not.toBe(initial);await page.getByRole('button',{name:'恢复最佳视角'}).click();await expect(canvas).toHaveAttribute('data-camera','6.000,3.000,7.000');await expect.poll(async()=>Number(await canvas.getAttribute('data-elapsed')),{timeout:10000}).toBeGreaterThan(4.5);
 await page.getByRole('button',{name:'暂停',exact:true}).click();const camera=await canvas.getAttribute('data-camera'),end=await canvas.screenshot();await page.waitForTimeout(150);expect(await canvas.getAttribute('data-camera')).toBe(camera);expect((await canvas.screenshot()).equals(end)).toBe(true);
 await expect(page.locator('.ponder-3d-label[data-object=auxA]')).toBeVisible();await expect(page.locator('.ponder-3d-label[data-object=auxB]')).toBeVisible();await page.screenshot({path:resolve(evidence,'spatial-construction-end.png')});await page.keyboard.press('Escape');
});
