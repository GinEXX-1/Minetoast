import {expect,test,type Page} from '@playwright/test';
import {strongAncestors} from '../../packages/graph-core/src/index';
import {worldGraph,worldGraphVersion,worldProgressStorageKey} from '../../apps/web/src/function-world-model';

async function prepareKey(page:Page){
 const id='HS-FUNC-CONCEPT-001';
 const ancestors=[...strongAncestors(worldGraph,[id])].filter(nodeId=>nodeId!==id);
 await page.addInitScript(({key,version,ids})=>localStorage.setItem(key,JSON.stringify({schemaVersion:1,graphVersion:version,initialized:true,unlockedNodeIds:ids})),{key:worldProgressStorageKey,version:worldGraphVersion,ids:ancestors});
 await page.goto('/function-world');
 const frame=page.locator(`[data-testid="world-node-${id}"] .kw-frame`);
 await expect(frame).toHaveAttribute('data-state','available');
 await frame.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 return id;
}

async function zoom(page:Page){return page.locator('.react-flow__viewport').evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).a);}

test('portal navigation captures both pages for a fade transition',async({page})=>{
 await page.addInitScript(()=>window.addEventListener('pagereveal',event=>{
  const transition=(event as Event & {viewTransition?:{ready:Promise<void>}}).viewTransition;
  sessionStorage.setItem('motion-transition',String(!!transition));
  if(transition)void transition.ready.then(()=>sessionStorage.setItem('motion-transition-ready','true')).catch(()=>sessionStorage.setItem('motion-transition-ready','false'));
 }));
 await page.goto('/');await expect(page.locator('.portal-card').first()).toBeVisible();
 await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
 await page.locator('.portal-card[href="/function-world"]').click();await page.waitForURL('**/function-world');
 expect(await page.evaluate(()=>sessionStorage.getItem('motion-transition'))).toBe('true');
 await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('motion-transition-ready'))).toBe('true');
});

test('important unlock produces visible bounded particles and a draggable modal notification',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 const id=await prepareKey(page);
 const drawer=page.getByRole('dialog');
 const timing=await drawer.evaluate(element=>element.getAnimations().map(animation=>animation.effect?.getTiming().easing));
 expect(timing).toContain('linear');
 const opacityFrames=await drawer.evaluate(element=>element.getAnimations().flatMap(animation=>animation.effect instanceof KeyframeEffect?animation.effect.getKeyframes().map(frame=>Number(frame.opacity)):[]));
 expect(opacityFrames).toEqual(expect.arrayContaining([0,1]));
 const toast=drawer.locator('.kw-motion-toast.key');
 await expect(toast).toContainText('关键成就达成');
 await expect(toast.locator('.kw-spark')).toHaveCount(24);
 await drawer.evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
 const box=await toast.boundingBox();expect(box).not.toBeNull();
 await page.mouse.move(box!.x+30,box!.y+25);await page.mouse.down();await page.mouse.move(box!.x+170,box!.y+25,{steps:8});await page.mouse.up();
 await expect(drawer.locator('.kw-motion-toast')).toHaveCount(0);
 await page.getByRole('button',{name:'关闭详情',exact:true}).click();await expect(drawer).toHaveCount(0);
 // Opening an already mastered node never replays achievement feedback.
 await page.locator(`[data-testid="world-node-${id}"] .kw-frame`).click();
 await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('.kw-motion-toast')).toHaveCount(0);
 expect(errors).toEqual([]);
});

test('drawer wheel and graph zoom produce intermediate positions without changing progress',async({page})=>{
 await prepareKey(page);
 const drawer=page.getByRole('dialog');await drawer.evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
 await drawer.hover();await page.mouse.wheel(0,500);
 const scrollSamples=await drawer.evaluate(async element=>{const values:number[]=[];for(let i=0;i<8;i++){await new Promise(requestAnimationFrame);values.push(element.scrollTop);}return values;});
 expect(new Set(scrollSamples).size).toBeGreaterThan(1);expect(scrollSamples.at(-1)).toBeGreaterThan(0);
 await page.keyboard.press('Escape');await expect(drawer).toHaveCount(0);
 const progress=await page.evaluate(key=>localStorage.getItem(key),worldProgressStorageKey);
 const before=await zoom(page);await page.getByRole('button',{name:'Zoom In',exact:true}).click();
 const samples=await page.locator('.react-flow__viewport').evaluate(async element=>{const values:number[]=[];for(let i=0;i<12;i++){await new Promise(requestAnimationFrame);values.push(new DOMMatrix(getComputedStyle(element).transform).a);}return values;});
 expect(new Set(samples).size).toBeGreaterThan(2);expect(samples.at(-1)).toBeGreaterThan(before);
 await expect.poll(()=>zoom(page)).toBeGreaterThan(before+.1);
 const graph=page.locator('.world-graph'),box=await graph.boundingBox();
 await page.mouse.move(box!.x+box!.width*.5,box!.y+box!.height*.5);
 const wheelBefore=await zoom(page);await page.mouse.wheel(0,-90);
 await expect.poll(()=>zoom(page)).toBeGreaterThan(wheelBefore);
 expect(await page.evaluate(key=>localStorage.getItem(key),worldProgressStorageKey)).toBe(progress);
});

test('curriculum hover summary leaves with the pointer and zoom has a visible animated step',async({page})=>{
 await page.goto('/systems/sets-logic');
 const node=page.getByRole('button',{name:'集合的概念，可解锁',exact:true});
 await node.hover();await expect(page.locator('.world-node-tooltip')).toBeVisible();
 await page.locator('.world-toolbar').hover();await expect(page.locator('.world-node-tooltip')).toHaveCount(0);
 const before=await zoom(page);await page.getByRole('button',{name:'Zoom In',exact:true}).click();
 const samples=await page.locator('.react-flow__viewport').evaluate(async element=>{const values:number[]=[];for(let i=0;i<14;i++){await new Promise(requestAnimationFrame);values.push(new DOMMatrix(getComputedStyle(element).transform).a);}return values;});
 expect(new Set(samples).size).toBeGreaterThan(2);
 await expect.poll(()=>zoom(page)).toBeGreaterThan(before+.1);
});

test('curriculum dialog respects reduced motion and notifications remain accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:851});await page.goto('/systems/sets-logic');
 await page.getByRole('button',{name:'集合的概念，可解锁',exact:true}).click();
 const drawer=page.getByRole('dialog');await expect(drawer).toBeVisible();
 expect(await drawer.evaluate(element=>element.getAnimations().some(animation=>animation.playState==='running'))).toBe(false);
 await expect(drawer.locator('.kw-motion-toast')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'关闭通知',exact:true}).click();await expect(drawer.locator('.kw-motion-toast')).toHaveCount(0);
 await page.keyboard.press('Escape');await expect(drawer).toHaveCount(0);
});
