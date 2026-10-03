import {test,expect} from '@playwright/test';
import {batchTwoScenes} from '../../content/ponder/batch-two';
import {geometrySystem} from '../../content/fixtures/geometry-system';
import {setsLogicSystem} from '../../content/fixtures/sets-logic-system';
import {probabilitySystem} from '../../content/fixtures/probability-system';
import {sequencesSystem} from '../../content/fixtures/sequences-system';
import {mkdir} from 'node:fs/promises';
const systems=[geometrySystem,setsLogicSystem,probabilitySystem,sequencesSystem];
for(const scene of batchTwoScenes)test(`batch two ${scene.id}: playback, interaction, responsive themes and completion`,async({page})=>{
 test.setTimeout(45000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const system=systems.find(s=>s.concepts.some(n=>n.id===scene.nodeId))!;
 await page.goto(`/systems/${system.id}`);await page.getByRole('textbox',{name:`搜索${system.nameZh}知识`}).fill(scene.title);await page.locator('.curriculum-search-results button').filter({hasText:scene.title}).first().click();await page.getByRole('button',{name:'查看详情',exact:true}).click();await page.getByRole('button',{name:'按下开始思索'}).click();await expect(page.locator('.ponder-focus')).toBeVisible();
 const storage=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('kw:ponder:'))));
 if(await page.getByRole('button',{name:'暂停',exact:true}).isVisible())await page.getByRole('button',{name:'暂停',exact:true}).click();
 const animated=scene.steps.findIndex(s=>s.animate.length>0);await page.locator('.ponder-timeline button').nth(animated).click();await page.getByRole('button',{name:'播放',exact:true}).click();await expect.poll(()=>page.locator('.ponder-svg').getAttribute('data-elapsed')).not.toBe('0.000');await page.waitForTimeout(350);await page.getByRole('button',{name:'暂停',exact:true}).click();const elapsed=await page.locator('.ponder-svg').getAttribute('data-elapsed');await page.waitForTimeout(200);expect(await page.locator('.ponder-svg').getAttribute('data-elapsed')).toBe(elapsed);
 await page.getByLabel('启用动画',{exact:true}).uncheck();await page.locator('.ponder-timeline button').first().click();
 for(let i=0;i<scene.steps.length;i++){
  for(const key of scene.steps[i].interaction){const slider=page.getByRole('slider',{name:scene.parameters[key].label});await slider.focus();await slider.press('End');await expect(page.getByTestId(`value-${key}`)).toHaveText(scene.parameters[key].max.toFixed(2));await slider.press('Home');await expect(page.getByTestId(`value-${key}`)).toHaveText(scene.parameters[key].min.toFixed(2));}
  if(i<scene.steps.length-1)await page.getByRole('button',{name:'下一步',exact:true}).click();
 }
 await expect(page.locator('.katex-error')).toHaveCount(0);await page.getByRole('button',{name:'完成观看'}).click();await expect(page.getByText('已观看原理演示',{exact:true})).toBeVisible();expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('kw:ponder:'))))).toEqual(storage);
 await mkdir('docs/ponder/evidence/batch-two',{recursive:true});
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});await page.locator('.ponder-timeline button').nth(scene.steps.findIndex(s=>s.interaction.length>0)).click();await page.waitForTimeout(100);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const stage=await page.locator('.ponder-stage').boundingBox(),caption=await page.locator('.ponder-caption').boundingBox();expect(stage!.y+stage!.height).toBeLessThanOrEqual(caption!.y+1);
  await page.screenshot({path:`docs/ponder/evidence/batch-two/${scene.id}-${width}-night.png`});
 }
 await page.getByRole('button',{name:'设置',exact:true}).click();await page.getByRole('button',{name:'显示模式：夜间'}).click();await page.getByRole('dialog',{name:'选项',exact:true}).getByRole('button',{name:'完成',exact:true}).click();await page.screenshot({path:`docs/ponder/evidence/batch-two/${scene.id}-390-day.png`});
 expect(errors).toEqual([]);await page.getByRole('button',{name:'退出思索'}).click();await expect(page.getByRole('button',{name:'按下开始思索'})).toBeFocused();
});
