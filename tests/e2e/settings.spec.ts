import {test,expect} from '@playwright/test';
import {openGeometry} from './ponder-helpers';
import {mkdir} from 'node:fs/promises';
const settings=(page:import('@playwright/test').Page)=>page.getByRole('dialog',{name:'选项',exact:true});
test('settings persist day mode, comfortable reading and actual SVG colors across reload',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'设置',exact:true}).click();
 await settings(page).getByRole('button',{name:'显示模式：夜间'}).click();await settings(page).getByRole('button',{name:'舒适阅读：关闭'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','day');await settings(page).getByRole('button',{name:'思索线条颜色…'}).click();
 await page.getByLabel('青色线条',{exact:true}).fill('#234567');await page.getByRole('button',{name:'完成',exact:true}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-comfort','true');await expect(page.locator('html')).toHaveAttribute('data-theme','day');
 await openGeometry(page,'圆的标准方程');await page.getByRole('button',{name:'4 寻找不变量'}).click();
 await expect(page.locator('circle[data-object=circle]')).toHaveAttribute('stroke','#234567');
 await page.getByRole('button',{name:'设置',exact:true}).click();await expect(settings(page)).toBeVisible();await settings(page).getByRole('button',{name:'思索线条颜色…'}).click();await page.getByRole('button',{name:'恢复默认线条颜色'}).click();await page.getByRole('button',{name:'完成',exact:true}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();await expect(page.locator('circle[data-object=circle]')).toHaveAttribute('stroke','#126276');
});
test('reset is scoped, confirmed and reversible without changing preferences',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{localStorage.setItem('kw:curriculum:geometry:v1',JSON.stringify({mastered:['x']}));localStorage.setItem('kw:curriculum:vectors:v1','{"mastered":["y"]}');localStorage.setItem('kw:settings:v1','{"theme":"day","comfort":true,"colors":{}}');});await page.reload();
 await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'节点重置…'}).click();await page.getByRole('button',{name:'重置所选记录…'}).click();await page.getByRole('button',{name:'取消',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('kw:curriculum:geometry:v1'))).not.toBeNull();
 await page.getByRole('button',{name:'重置所选记录…'}).click();await page.getByRole('button',{name:'确认重置所选记录'}).click();expect(await page.evaluate(()=>localStorage.getItem('kw:curriculum:geometry:v1'))).toBeNull();expect(await page.evaluate(()=>localStorage.getItem('kw:curriculum:vectors:v1'))).toContain('y');await expect(page.locator('html')).toHaveAttribute('data-theme','day');
 await page.getByRole('button',{name:'撤销本次重置'}).click();expect(await page.evaluate(()=>localStorage.getItem('kw:curriculum:geometry:v1'))).toContain('x');
});
test('real account service supports register, persisted session, logout and login in settings',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'账户…'}).click();await page.getByRole('button',{name:'创建账户',exact:true}).click();
 const username=`settings_${Date.now()}`;await page.getByLabel('用户名',{exact:true}).fill(username);await page.getByLabel('密码',{exact:true}).fill('isolated-settings-test-password');await page.getByRole('button',{name:'创建并登录'}).click();await expect(page.getByText(`当前账户：${username}`)).toBeVisible();await page.reload();
 await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'账户…'}).click();await expect(page.getByText(`当前账户：${username}`)).toBeVisible();await page.getByRole('button',{name:'退出登录',exact:true}).click();await expect(page.getByRole('button',{name:'登录',exact:true})).toBeVisible();
 await page.getByLabel('用户名',{exact:true}).fill(username);await page.getByLabel('密码',{exact:true}).fill('isolated-settings-test-password');await page.getByRole('button',{name:'登录',exact:true}).click();await expect(page.getByText(`当前账户：${username}`)).toBeVisible();
 await page.goto('/legacy');await expect(page.locator('.account')).toContainText(username);await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'账户…'}).click();await page.getByRole('dialog',{name:'账户',exact:true}).getByRole('button',{name:'退出登录',exact:true}).click();await page.getByRole('button',{name:'完成',exact:true}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();await expect(page.locator('.account')).toContainText('游客浏览');
});
for(const width of [1440,768,390])test(`settings day and night stay usable at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('.portal-rail .portal-settings-entry')).toBeVisible();await expect(page.locator('.kw-settings-entry')).toBeHidden();await mkdir('docs/ponder/evidence',{recursive:true});await page.screenshot({path:`docs/ponder/evidence/portal-settings-night-${width}.png`});await page.getByRole('button',{name:'设置',exact:true}).click();await expect(settings(page)).toBeVisible();expect(await settings(page).evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);await page.screenshot({path:`docs/ponder/evidence/settings-night-${width}.png`});
 await settings(page).getByRole('button',{name:'显示模式：夜间'}).click();const done=await settings(page).getByRole('button',{name:'完成',exact:true}).boundingBox();expect(done).not.toBeNull();expect(done!.y+done!.height).toBeLessThanOrEqual(900);await page.screenshot({path:`docs/ponder/evidence/settings-day-${width}.png`});await settings(page).getByRole('button',{name:'完成',exact:true}).click();
 const contrasts=()=>page.locator('.portal-filters button:not(:disabled)').evaluateAll(elements=>elements.map(el=>{const style=getComputedStyle(el),luminance=(color:string)=>{const rgb=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{const s=v/255;return s<=.04045?s/12.92:Math.pow((s+.055)/1.055,2.4);});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};const a=luminance(style.color),b=luminance(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}));await expect.poll(async()=>Math.min(...await contrasts())).toBeGreaterThanOrEqual(4.5);expect((await contrasts()).length).toBeGreaterThan(0);await page.screenshot({path:`docs/ponder/evidence/portal-day-${width}.png`});
});
for(const route of ['/systems/sets-logic','/function-world'])test(`day graph nodes and minimap use warm status colors on ${route}`,async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'显示模式：夜间'}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();await page.goto(route);
 const graph=page.locator('.world-graph');await expect(graph.locator('.kw-frame--available').first()).toBeVisible();
 await expect(graph.locator('.kw-frame--available').first()).toHaveCSS('background-color','rgb(241, 228, 191)');
 const miniMap=graph.locator('.react-flow__minimap');await expect(miniMap).toHaveCSS('background-color','rgb(233, 223, 203)');
 await expect.poll(()=>miniMap.locator('.react-flow__minimap-node').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).fill))).toContain('rgb(153, 107, 35)');
 await expect(miniMap.locator('.react-flow__minimap-mask')).toHaveCSS('fill','rgba(233, 223, 203, 0.42)');
 await mkdir('docs/ponder/evidence',{recursive:true});await page.screenshot({path:`docs/ponder/evidence/${route.includes('sets-logic')?'sets':'functions'}-warm-graph.png`});
});
for(const width of [1440,768,390])test(`warm day mode keeps curriculum labels and function formulas readable at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'显示模式：夜间'}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();
 await page.goto('/systems/sets-logic');await expect(page.getByRole('textbox',{name:'搜索集合与逻辑知识'})).toBeVisible();
 const searchLabel=page.locator('.world-search label');await expect.poll(async()=>{const colors=await searchLabel.evaluate(el=>[getComputedStyle(el).color,getComputedStyle(el.closest('.world-toolbar')!).backgroundColor]);return contrast(colors[0],colors[1]);}).toBeGreaterThanOrEqual(4.5);
 const searchInput=page.getByRole('textbox',{name:'搜索集合与逻辑知识'});const placeholderColors=await searchInput.evaluate(el=>[getComputedStyle(el,'::placeholder').color,getComputedStyle(el).backgroundColor]);expect(contrast(placeholderColors[0],placeholderColors[1])).toBeGreaterThanOrEqual(4.5);
 await mkdir('docs/ponder/evidence',{recursive:true});await page.screenshot({path:`docs/ponder/evidence/curriculum-day-${width}.png`});
 await page.goto('/function-world');await page.getByRole('textbox',{name:'搜索知识'}).fill('单调性');await page.getByRole('option',{name:/函数的单调性/}).first().click();await page.getByRole('button',{name:'查看详情',exact:true}).click();
 const formula=page.locator('.world-drawer .formula .katex').first();await expect(formula).toBeVisible();
 await expect.poll(async()=>{const colors=await formula.evaluate(el=>[getComputedStyle(el).color,getComputedStyle(el.closest('.formula')!).backgroundColor]);return contrast(colors[0],colors[1]);}).toBeGreaterThanOrEqual(4.5);
 if(width<=700)await expect(page.locator('.world-drawer-head')).toHaveCSS('background-color','rgb(255, 250, 240)');
 await page.screenshot({path:`docs/ponder/evidence/function-drawer-day-${width}.png`});
});

function contrast(foreground:string,background:string){
 const luminance=(color:string)=>{const channels=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(value=>{const s=value/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});return .2126*channels[0]+.7152*channels[1]+.0722*channels[2];};
 const a=luminance(foreground),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
test('resetting another system preserves the current curriculum path',async({page})=>{
 await page.goto('/systems/calculus');await page.getByRole('combobox',{name:'路径起点'}).selectOption('HS-CALC-DERIVATIVE-DEFINITION-001');await page.getByRole('combobox',{name:'路径终点'}).selectOption('HS-CALC-FUNCTION-ANALYSIS-001');await page.getByRole('button',{name:'显示路径'}).click();await expect(page.getByRole('button',{name:'清除路径'})).toBeVisible();const pathSummary=page.locator('.world-path-summary');await expect(pathSummary).toBeVisible();const pathText=await pathSummary.textContent();
 await page.evaluate(()=>localStorage.setItem('kw:curriculum:geometry:v1','{}'));await page.getByRole('button',{name:'设置',exact:true}).click();await settings(page).getByRole('button',{name:'节点重置…'}).click();await page.getByRole('button',{name:'重置所选记录…'}).click();await page.getByRole('button',{name:'确认重置所选记录'}).click();await page.getByRole('button',{name:'完成',exact:true}).click();await settings(page).getByRole('button',{name:'完成',exact:true}).click();await expect(page.getByRole('button',{name:'清除路径'})).toBeVisible();await expect(pathSummary).toHaveText(pathText!);
});
