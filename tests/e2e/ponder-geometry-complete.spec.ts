import {test,expect} from '@playwright/test';
import {geometryCompletionScenes} from '../../content/ponder/geometry-complete';
import {mkdir} from 'node:fs/promises';

for(const scene of geometryCompletionScenes)test(`geometry scene ${scene.id} opens, plays and accepts its parameter`,async({page})=>{
 test.setTimeout(60000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/systems/geometry');
 await page.getByRole('textbox',{name:'搜索几何与空间关系知识'}).fill(scene.title);
 await page.locator('.curriculum-search-results button').filter({hasText:scene.title}).first().click();
 await page.getByRole('button',{name:'查看详情',exact:true}).click();
 await page.getByRole('button',{name:'按下开始思索'}).click();
 await expect(page.locator('.ponder-focus').getByRole('heading',{name:scene.title,exact:true})).toBeVisible();
 await expect(scene.renderer==='solid'?page.getByTestId('ponder-solid-renderer'):page.locator('.ponder-svg')).toBeVisible();
 await page.getByLabel('启用动画',{exact:true}).uncheck();
 for(let i=0;i<scene.steps.length-1;i++)await page.getByRole('button',{name:'下一步',exact:true}).click();
 const key=Object.keys(scene.parameters)[0];
 const slider=page.getByRole('slider',{name:scene.parameters[key].label});
 await page.locator('.ponder-timeline button').nth(3).click();
 await slider.focus();await slider.press('End');
 await expect(page.getByTestId(`value-${key}`)).toHaveText(scene.parameters[key].max.toFixed(2));
 await expect(page.locator('.katex-error')).toHaveCount(0);
 if(['geometry-prism','geometry-solids-of-revolution','geometry-oblique-projection','geometry-pyramid-surface-area','geometry-cone-surface-area','geometry-point-line-distance','geometry-conic-equation-research'].includes(scene.id)){
  await mkdir('docs/ponder/evidence/geometry-complete',{recursive:true});
  for(const width of [1440,768,390]){await page.setViewportSize({width,height:900});await page.screenshot({path:`docs/ponder/evidence/geometry-complete/${scene.id}-${width}.png`});}
 }
 expect(errors).toEqual([]);
 await page.getByRole('button',{name:'退出思索'}).click();
});
