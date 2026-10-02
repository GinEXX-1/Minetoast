import {expect,type Page} from '@playwright/test';
export async function openGeometry(page:Page,name:string){
 await page.goto('/systems/geometry');await page.getByRole('textbox',{name:'搜索几何与空间关系知识'}).fill(name);await page.locator('.curriculum-search-results button').filter({hasText:name}).first().click();await page.getByRole('button',{name:'查看详情',exact:true}).click();await page.getByRole('button',{name:'按下开始思索'}).click();await expect(page.locator('.ponder-focus')).toBeVisible();if(await page.getByRole('button',{name:'暂停',exact:true}).isVisible())await page.getByRole('button',{name:'暂停',exact:true}).click();
}
