import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {openGeometry} from './ponder-helpers';
const evidence=resolve('docs/ponder/evidence');
test.use({trace:'off'});
 test('continuous playback changes exact geometry, pause freezes it, and animation stays responsive',async({page,browser})=>{
 await openGeometry(page,'圆的标准方程');await page.getByRole('button',{name:'下一步',exact:true}).click();
 const line=page.locator('[data-object=movingLine]');await page.getByRole('button',{name:'暂停',exact:true}).click();
 const paused=await line.getAttribute('x1');await page.waitForTimeout(150);expect(await line.getAttribute('x1')).toBe(paused);
 await page.getByRole('button',{name:'播放',exact:true}).click();
 await expect.poll(()=>line.getAttribute('x1')).not.toBe(paused);
 // Measure the mathematical rotation window, after construction and its deliberate hold.
 await expect.poll(async()=>Number(await page.getByTestId('ponder-geometry-renderer').getAttribute('data-elapsed')),{timeout:10000}).toBeGreaterThan(2.2);
 await page.evaluate(()=>{const stats={updates:0,started:performance.now()},observer=new MutationObserver(()=>stats.updates++);observer.observe(document.querySelector('[data-object=movingLine]')!,{attributes:true,attributeFilter:['x1']});(window as any).__ponderAnimationStats={stats,observer};});
 const timings=await page.evaluate(()=>new Promise<number[]>(resolve=>{const intervals:number[]=[];let previous=performance.now();function frame(now:number){intervals.push(now-previous);previous=now;if(intervals.length>=90)resolve(intervals);else requestAnimationFrame(frame);}requestAnimationFrame(frame);}));
 const animation=await page.evaluate(()=>{const record=(window as any).__ponderAnimationStats;record.observer.disconnect();return {updates:record.stats.updates,elapsed:performance.now()-record.stats.started};});
 const sorted=[...timings].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)],p95=sorted[Math.floor(sorted.length*.95)];
 const {writeFile}=await import('node:fs/promises');await writeFile(resolve(evidence,'playback-performance.json'),JSON.stringify({browser:browser.version(),viewport:'1440x900',renderer:'geometry',samples:timings.length,geometryUpdates:animation.updates,geometryUpdatesPerSecond:animation.updates*1000/animation.elapsed,medianRAFms:median,p95RAFms:p95,medianRAFFPS:1000/median,note:'rAF scheduling during mathematical animation, not GPU presentation FPS; target 60fps, local test only; Playwright tracing disabled to avoid DOM snapshot overhead'},null,2));
 expect(animation.updates*1000/animation.elapsed).toBeGreaterThan(45);expect(1000/median).toBeGreaterThan(50);expect(p95).toBeLessThan(100);await page.getByRole('button',{name:'退出思索'}).click();
});
