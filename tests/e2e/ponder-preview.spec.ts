import {test,expect} from '@playwright/test';
import {openGeometry} from './ponder-helpers';
import {resolve} from 'node:path';
test.use({video:{mode:'on',size:{width:1440,height:900}}});
for(const [name,id] of [['圆的标准方程','circle'],['线面垂直判定定理','spatial']])test(`record actual ${id} construction and playback`,async({page})=>{
 await openGeometry(page,name);await page.getByRole('button',{name:'重播本步'}).click();await page.waitForTimeout(2500);
 await page.getByRole('button',{name:'下一步',exact:true}).click();
 const renderer=page.getByTestId(id==='circle'?'ponder-geometry-renderer':'ponder-webgl-canvas');
 await expect.poll(async()=>Number(await renderer.getAttribute('data-elapsed')),{timeout:12000}).toBeGreaterThan(id==='circle'?10:5);
 await page.getByRole('button',{name:'下一步',exact:true}).click();await page.waitForTimeout(2800);
 if(id==='circle'){await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('slider',{name:'圆周位置 φ'}).focus();await page.keyboard.press('End');await page.waitForTimeout(800);}
 await page.screenshot({path:resolve('docs/ponder/evidence',`${id}-final-theme.png`)});
 const video=page.video();await page.close();await video?.saveAs(resolve('docs/ponder/evidence',`ponder-${id}-playback.webm`));
});
