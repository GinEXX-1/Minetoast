import {openGeometry} from './ponder-helpers';
import {test,expect,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const evidence=resolve('docs/ponder/evidence');
async function openFunction(page:Page){
 await page.goto('/function-world');await page.getByRole('textbox',{name:'搜索知识'}).fill('单调性');await page.getByRole('option',{name:/函数的单调性/}).first().click();await page.getByRole('button',{name:'查看详情',exact:true}).click();await page.getByRole('button',{name:'按下开始思索'}).click();await expect(page.locator('.ponder-focus')).toBeVisible();if(await page.getByRole('button',{name:'暂停',exact:true}).isVisible())await page.getByRole('button',{name:'暂停',exact:true}).click();
}
function errors(page:Page){const collected:string[]=[];page.on('pageerror',e=>collected.push(e.message));page.on('console',m=>{if(m.type()==='error')collected.push(m.text());});return collected;}
test('node -> focus -> real parameter interaction -> complete -> original node without knowledge mutation',async({page})=>{
 const log=errors(page);await openFunction(page);
 const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('kw:ponder:'))));
 await page.getByRole('button',{name:'下一步',exact:true}).click();await expect(page.locator('[data-object=p1]')).toBeVisible();
 await page.getByRole('button',{name:'下一步',exact:true}).click();await expect(page.locator('[data-object=v1]')).toBeAttached();
 await page.getByRole('button',{name:'下一步',exact:true}).click();await expect(page.getByRole('button',{name:'继续思索'})).toBeVisible();
 const slider=page.getByRole('slider',{name:'x₁'});await slider.focus();await slider.press('End');
 const x1=Number(await page.getByTestId('value-x1').textContent()),x2=Number(await page.getByTestId('value-x2').textContent());expect(x1).toBeLessThan(x2);await expect(page.getByTestId('ponder-readouts')).toContainText((x1*x1).toFixed(2));
 const initialPoint=await page.locator('[data-object=p1] circle').first().getAttribute('cx');
 await slider.press('Home');expect(await page.locator('[data-object=p1] circle').first().getAttribute('cx')).not.toBe(initialPoint);
 // Pointer drag uses the same constrained mathematical model.
 const point=page.locator('[data-object=p2] circle').first(),box=await point.boundingBox();expect(box).not.toBeNull();await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2);await page.mouse.down();await page.mouse.move(box!.x-55,box!.y+15,{steps:8});await page.mouse.up();expect(Number(await page.getByTestId('value-x2').textContent())).toBeGreaterThan(Number(await page.getByTestId('value-x1').textContent()));
 await mkdir(evidence,{recursive:true});await page.screenshot({path:resolve(evidence,'monotonicity-desktop.png')});
 const experimentReadout=await page.getByTestId('ponder-readouts').textContent();await page.getByRole('button',{name:'继续思索'}).click();await expect(page.locator('.ponder-caption .katex')).toBeVisible();await expect(page.getByTestId('ponder-readouts')).toHaveText(experimentReadout!);await page.getByRole('button',{name:'完成观看'}).click();await expect(page.getByRole('status').filter({hasText:'已观看原理演示'})).toBeVisible();
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('kw:ponder:v1:local:function-monotonicity:1')!));expect(progress.principleViewed).toBe(true);expect(progress.interactionUsed).toBe(true);
 expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('kw:ponder:'))))).toEqual(before);
 await page.getByRole('button',{name:'退出思索'}).click();await expect(page.getByRole('dialog',{name:'函数的单调性知识详情'})).toBeVisible();await expect(page.getByRole('button',{name:'按下开始思索'})).toBeFocused();
 await page.getByRole('button',{name:'按下开始思索'}).click();await page.getByRole('button',{name:'重新开始'}).click();await expect(page.getByLabel('步骤进度')).toHaveText('1 / 5');await page.keyboard.press('Escape');await expect(page.locator('.ponder-focus')).toHaveCount(0);expect(log).toEqual([]);
});
test('geometry intersects, moves the tangent continuously, and restores the circle node',async({page})=>{
 const log=errors(page);await openGeometry(page,'圆的标准方程');
 await page.getByRole('button',{name:'下一步',exact:true}).click();await expect(page.locator('[data-object=crossings] circle')).toHaveCount(2);
 await page.getByRole('button',{name:'下一步',exact:true}).click();await expect(page.locator('[data-object=crossings] circle')).toHaveCount(1);await expect(page.locator('[data-object=right]')).toBeAttached();
 await page.getByRole('button',{name:'下一步',exact:true}).click();const line=page.locator('[data-object=movingLine]'),before=await line.getAttribute('x1');await page.getByRole('slider',{name:'圆周位置 φ'}).focus();await page.keyboard.press('ArrowRight');expect(await line.getAttribute('x1')).not.toBe(before);
 await page.screenshot({path:resolve(evidence,'circle-tangent-desktop.png')});await page.getByRole('button',{name:'完成观看'}).click();await page.getByRole('button',{name:'退出思索'}).click();await expect(page.getByRole('dialog',{name:'圆的标准方程知识详情'})).toBeVisible();expect(log).toEqual([]);
});
test('true WebGL scene supports camera orbit, auxiliary controls and the plane theorem',async({page})=>{
 const log=errors(page);await openGeometry(page,'线面垂直判定定理');await expect(page.getByTestId('ponder-webgl-canvas')).toBeVisible();
 for(let i=0;i<4;i++)await page.getByRole('button',{name:'下一步',exact:true}).click();
 const canvas=page.getByTestId('ponder-webgl-canvas'),before=await canvas.screenshot(),box=await canvas.boundingBox();
 await page.mouse.move(box!.x+box!.width*.5,box!.y+box!.height*.5);await page.mouse.down();await page.mouse.move(box!.x+box!.width*.7,box!.y+box!.height*.6,{steps:12});await page.mouse.up();expect((await canvas.screenshot()).equals(before)).toBe(false);
 await page.getByRole('checkbox',{name:'显示辅助线'}).uncheck();await page.getByRole('button',{name:'恢复最佳视角'}).click();await page.getByRole('slider',{name:'平面内夹角 β'}).focus();await page.keyboard.press('End');await page.screenshot({path:resolve(evidence,'line-plane-desktop.png')});
 await page.getByRole('button',{name:'完成观看'}).click();await expect(page.getByRole('status').filter({hasText:'已观看原理演示'})).toBeVisible();await page.getByRole('button',{name:'退出思索'}).click();expect(log).toEqual([]);
});
for(const width of [768,390])test(`focus works at ${width}px with keyboard and reduced motion`,async({page})=>{
 const log=errors(page);await page.setViewportSize({width,height:width===768?1024:844});await page.emulateMedia({reducedMotion:'reduce'});await openFunction(page);
 const stage=page.getByRole('main',{name:'数学演示舞台'});await stage.focus();await stage.press('ArrowRight');await expect(page.getByLabel('步骤进度')).toHaveText('2 / 5');await stage.press('ArrowLeft');await expect(page.getByLabel('步骤进度')).toHaveText('1 / 5');await stage.press('Space');await expect(page.getByRole('button',{name:'暂停',exact:true})).toBeVisible();await stage.press('Space');
 await page.getByRole('button',{name:'4 自己拖动'}).click();await expect(page.getByRole('slider',{name:'x₁'})).toBeVisible();
 expect(await page.locator('.ponder-focus').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);await page.screenshot({path:resolve(evidence,`monotonicity-${width}.png`)});
 await page.getByRole('button',{name:'5 得到定义'}).click();await page.getByRole('button',{name:'完成观看'}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('kw:ponder:v1:local:function-monotonicity:1')!).principleViewed)).toBe(false);
 await page.getByRole('button',{name:'退出思索'}).click();await expect(page.getByRole('dialog',{name:'函数的单调性知识详情'})).toBeVisible();expect(log).toEqual([]);
});
const expansions=[
 {route:'/function-world',search:'二次函数的图像与性质',slider:'参数 a',id:'quadratic-parameter'},
 {route:'/function-world',search:'函数的零点',slider:'自变量 x',id:'function-zeros'},
 {route:'/function-world',search:'一次函数的图像与性质',slider:'斜率 k',id:'linear-slope'},
 {route:'/systems/trigonometry',search:'单位圆',slider:'角度 φ（弧度）',id:'unit-circle'},
 {route:'/systems/calculus',search:'导数与切线斜率',slider:'切点横坐标 x₀',id:'derivative-tangent'},
];
for(const demo of expansions)test(`additional HIGH suitability scene: ${demo.id}`,async({page})=>{
 const log=errors(page);await page.goto(demo.route);
 await page.locator(demo.route==='/function-world'?'#world-search-input':'#curriculum-search-input').fill(demo.search);
 await page.locator('.world-search-results button').filter({hasText:demo.search}).first().click();await page.getByRole('button',{name:'查看详情',exact:true}).click();
 await page.getByRole('button',{name:'按下开始思索'}).click();await page.getByRole('button',{name:'暂停',exact:true}).click();
 await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('button',{name:'下一步',exact:true}).click();
 const slider=page.getByRole('slider',{name:demo.slider});await slider.focus();await slider.press('Home');await slider.press('End');
 await page.screenshot({path:resolve(evidence,`${demo.id}.png`)});await page.getByRole('button',{name:'继续思索'}).click();await expect(page.locator('.ponder-caption .katex')).toBeVisible();
 await page.getByRole('button',{name:'完成观看'}).click();expect(await page.evaluate(id=>JSON.parse(localStorage.getItem(`kw:ponder:v1:local:${id}:1`)!).principleViewed,demo.id)).toBe(true);await page.keyboard.press('Escape');expect(log).toEqual([]);
});
for(const name of ['圆的标准方程','线面垂直判定定理'])test(`tablet reduced-motion renderer: ${name}`,async({page})=>{
 const log=errors(page);await page.setViewportSize({width:768,height:1024});await page.emulateMedia({reducedMotion:'reduce'});await openGeometry(page,name);
 await page.getByRole('button',{name:'下一步',exact:true}).click();
 if(name==='圆的标准方程')await expect(page.locator('[data-object=crossings] circle')).toHaveCount(1);else await expect(page.getByTestId('ponder-webgl-canvas')).toBeVisible();
 await page.screenshot({path:resolve(evidence,name==='圆的标准方程'?'circle-tangent-768.png':'line-plane-768.png')});await page.getByRole('button',{name:'退出思索'}).click();expect(log).toEqual([]);
});
