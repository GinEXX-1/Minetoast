import {expect,test} from '@playwright/test';

test('compact portal exposes the systems without a duplicate navigation wall',async({browser})=>{
 for(const width of [320,390,768]){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:4187',viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.locator('.portal-rail')).toBeHidden();
  await expect(page.locator('.portal-card').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await context.close();
 }
});

test('mobile knowledge graphs show tappable nodes and a usable detail drawer',async({browser})=>{
 for(const [path,nodeId] of [['/function-world','MS-ALG-LINE-001'],['/systems/sets-logic','HS-SET-CONCEPT-001']] as const){
  const context=await browser.newContext({baseURL:'http://127.0.0.1:4187',viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto(path);
  const node=page.locator(`[data-testid="rf__node-${nodeId}"]`);
  await expect.poll(async()=>Math.round((await node.boundingBox())?.width??0)).toBeGreaterThanOrEqual(80);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await node.locator('[role="button"]').tap();
  await expect(page.locator('dialog.world-drawer[open]')).toBeVisible();
  await expect(page.getByRole('button',{name:'关闭详情'})).toBeVisible();
  await page.getByRole('button',{name:'关闭详情'}).click();
  await expect(page.locator('dialog.world-drawer[open]')).toHaveCount(0);
  await page.getByRole('button',{name:'学习进度 ↓'}).click();
  await expect.poll(async()=>Math.round((await page.locator('.world-sidebar').boundingBox())?.y??9999)).toBeLessThan(844);
  await context.close();
 }
});

test('tablet graph also starts at readable node scale',async({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:4187',viewport:{width:768,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 await page.goto('/systems/sets-logic');
 await expect.poll(async()=>Math.round((await page.locator('[data-testid="rf__node-HS-SET-CONCEPT-001"]').boundingBox())?.width??0)).toBeGreaterThanOrEqual(80);
 expect(Math.round((await page.locator('.world-header').boundingBox())?.height??9999)).toBeLessThan(220);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(768);
 await context.close();
});

test('every curriculum system keeps its graph readable on a phone',async({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:4187',viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();
 for(const system of ['sets-logic','algebra','trigonometry','sequences','vectors','geometry','probability','calculus']){
  await page.goto(`/systems/${system}`);
  const first=page.locator('.react-flow__node').first();
  await expect.poll(async()=>Math.round((await first.boundingBox())?.width??0),{message:`${system} node width`}).toBeGreaterThanOrEqual(80);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),system).toBe(390);
 }
 await context.close();
});
