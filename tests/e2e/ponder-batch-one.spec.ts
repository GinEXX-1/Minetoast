import {test,expect} from '@playwright/test';
import {batchOneScenes} from '../../content/ponder/batch-one';
import {geometrySystem} from '../../content/fixtures/geometry-system';
import {trigonometrySystem} from '../../content/fixtures/trigonometry-system';
import {calculusSystem} from '../../content/fixtures/calculus-system';
import {vectorsSystem} from '../../content/fixtures/vectors-system';
import {mkdir} from 'node:fs/promises';
for(const scene of batchOneScenes)test(`approved scene ${scene.id}: real animation, parameters, completion and return`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));const system=[geometrySystem,trigonometrySystem,calculusSystem,vectorsSystem].find(s=>s.concepts.some(n=>n.id===scene.nodeId))!;
 const titlePattern=new RegExp('^'+scene.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 await page.goto(`/systems/${system.id}`);await page.getByRole('textbox',{name:`搜索${system.nameZh}知识`}).fill(scene.title);await page.locator('.curriculum-search-results button').filter({hasText:titlePattern}).click();await page.getByRole('button',{name:'查看详情',exact:true}).click();await page.getByRole('button',{name:'按下开始思索'}).click();await expect(page.locator('.ponder-focus')).toBeVisible();
 const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>!key.startsWith('kw:ponder:'))));
 if(await page.getByRole('button',{name:'暂停',exact:true}).isVisible())await page.getByRole('button',{name:'暂停',exact:true}).click();
 const animated=scene.steps.findIndex(s=>s.animate.length>0);await page.locator('.ponder-timeline button').nth(animated).click();await page.getByRole('button',{name:'播放',exact:true}).click();
 await expect.poll(()=>page.locator('.ponder-timeline button').nth(animated).getAttribute('style'),{timeout:5000}).not.toContain('--step-progress: 0%');await page.getByRole('button',{name:'暂停',exact:true}).click();
 await page.locator('.ponder-timeline button').nth(0).click();
 for(let i=0;i<scene.steps.length;i++){
  for(const key of scene.steps[i].interaction){const slider=page.getByRole('slider',{name:scene.parameters[key].label});await slider.focus();await slider.press('End');const high=Number(await page.getByTestId(`value-${key}`).textContent());expect(high).toBeGreaterThanOrEqual(scene.parameters[key].max-scene.parameters[key].step-.005);expect(high).toBeLessThanOrEqual(scene.parameters[key].max+.005);await slider.press('Home');await expect(page.getByTestId(`value-${key}`)).toHaveText(scene.parameters[key].min.toFixed(2));}
  if(i<scene.steps.length-1)await page.getByRole('button',{name:'下一步',exact:true}).click();
 }
 await expect(page.locator('.katex-error')).toHaveCount(0);await page.getByRole('button',{name:'完成观看'}).click();await expect(page.getByText('已观看原理演示',{exact:true})).toBeVisible();expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>!key.startsWith('kw:ponder:'))))).toEqual(before);
 await mkdir('docs/ponder/evidence',{recursive:true});await page.screenshot({path:`docs/ponder/evidence/batch-${scene.id}-night.png`});
 const completedRecord=await page.evaluate(id=>localStorage.getItem(`kw:ponder:v1:local:${id}:1`),scene.id);
 await page.getByRole('button',{name:'设置',exact:true}).click();await page.getByRole('button',{name:'思索观看记录…'}).click();await page.getByRole('button',{name:'重置所选记录…'}).click();await page.getByRole('button',{name:'确认重置所选记录'}).click();expect(await page.evaluate(id=>JSON.parse(localStorage.getItem(`kw:ponder:v1:local:${id}:1`)!).principleViewed,scene.id)).toBe(false);
 await page.getByRole('button',{name:'撤销本次重置'}).click();expect(await page.evaluate(id=>JSON.parse(localStorage.getItem(`kw:ponder:v1:local:${id}:1`)!).principleViewed,scene.id)).toBe(true);await expect.poll(()=>page.evaluate(id=>localStorage.getItem(`kw:ponder:v1:local:${id}:1`),scene.id)).toBe(completedRecord);await page.getByRole('button',{name:'完成',exact:true}).click();await page.getByRole('button',{name:'显示模式：夜间'}).click();await page.getByRole('dialog',{name:'选项',exact:true}).getByRole('button',{name:'完成',exact:true}).click();await page.locator('.ponder-timeline button').last().click();await page.getByLabel('启用动画',{exact:true}).uncheck();await page.screenshot({path:`docs/ponder/evidence/batch-${scene.id}-day.png`});
 await page.getByRole('button',{name:'退出思索'}).click();await expect(page.getByRole('button',{name:'按下开始思索'})).toBeFocused();expect(errors).toEqual([]);
});
