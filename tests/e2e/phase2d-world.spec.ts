import {expect,test} from '@playwright/test';

test.describe('Phase 2D Minetoast Function World',()=>{
 test.beforeEach(async({page})=>{await page.goto('/function-world');await expect(page.getByRole('heading',{name:'函数 · Minetoast'})).toBeVisible();});

 test('keeps the legacy entry and renders the frozen graph with search and details',async({page})=>{
  await expect(page.locator('.world-card')).toHaveCount(32);
  await expect(page.locator('.world-card.key')).toHaveCount(5);
  await expect(page.getByLabel('函数知识世界进度 0 / 32')).toBeVisible();
  await page.getByRole('textbox',{name:'搜索知识'}).fill('monotonicity');
  await page.getByRole('option',{name:/函数的单调性/}).first().click();
  await expect(page.locator('[data-testid="world-node-HS-FUNC-MONO-001"]')).toHaveClass(/focused/);
  await page.getByRole('button',{name:'查看详情'}).click();
  await expect(page.getByRole('dialog',{name:/函数的单调性知识详情/})).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading',{name:'教材出处'})).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading',{name:'知识关系'})).toBeVisible();
  await page.getByRole('dialog').locator('.world-relation button').first().click();
  await expect(page.getByRole('dialog',{name:/函数的概念知识详情/})).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading',{name:'函数的概念'})).toBeVisible();
  await page.getByRole('button',{name:'关闭详情'}).click();
  await page.goto('/legacy');
  await expect(page.getByRole('link',{name:'进入函数知识世界 →'})).toBeVisible();
 });

 test('quick initialization uses only Strong ancestors and persists progress',async({page})=>{
  const target=page.locator('[data-testid="world-node-HS-FUNC-APPLY-001"]');
  await target.click();
  await expect(target).toHaveAttribute('data-status','unlocked');
  await expect(page.locator('[data-testid="world-node-HS-FUNC-LINEAR-001"]')).not.toHaveAttribute('data-status','unlocked');
  await page.getByRole('button',{name:'生成我的数学知识地图'}).click();
  await expect(page.getByRole('region',{name:'快速建立我的知识进度'})).toHaveCount(0);
  const saved=await page.evaluate(()=>localStorage.getItem('kw:function-world:phase2d-v1'));
  expect(JSON.parse(saved!).initialized).toBe(true);
  await page.reload();
  await expect(page.locator('[data-testid="world-node-HS-FUNC-APPLY-001"]')).toHaveAttribute('data-status','unlocked');
 });

 test('ordinary unlock, Weak relationship toggle, and path query stay distinct',async({page})=>{
  await page.getByRole('button',{name:'生成我的数学知识地图'}).click();
  const root=page.locator('[data-testid="world-node-HS-SET-CONCEPT-001"]');
  await expect(root).toHaveAttribute('data-status','available');
  await root.click();
  await expect(root).toHaveAttribute('data-status','unlocked');
  await expect(page.getByLabel('函数知识世界进度 1 / 32')).toBeVisible();
  await page.getByRole('button',{name:'关闭详情'}).click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(40);
  await page.getByRole('checkbox',{name:'显示完整知识关系'}).check();
  await expect(page.locator('.react-flow__edge')).toHaveCount(51);
  await expect(page.getByLabel('函数知识世界进度 1 / 32')).toBeVisible();
  await page.getByRole('combobox',{name:'路径起点'}).selectOption('HS-FUNC-LINEAR-001');
  await page.getByRole('combobox',{name:'路径终点'}).selectOption('HS-FUNC-APPLY-001');
  await page.getByRole('button',{name:'显示路径'}).click();
  await expect(page.getByRole('status').filter({hasText:'关系'})).toBeVisible();
 });

 test('narrow layout remains navigable and drawer is usable',async({page})=>{
  for(const width of [1440,1024,768,390]){
   await page.setViewportSize({width,height:844});
   await expect(page.getByRole('navigation',{name:'模块导航'})).toBeVisible();
   await expect(page.locator('.world-graph')).toBeVisible();
   await expect(page.getByRole('textbox',{name:'搜索知识'})).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
  }
  await page.getByRole('textbox',{name:'搜索知识'}).fill('函数单调性');
  await page.getByRole('option',{name:/函数的单调性/}).first().click();
  await page.getByRole('button',{name:'查看详情'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const width=await page.getByRole('dialog').evaluate(el=>el.getBoundingClientRect().width);
  expect(width).toBeLessThanOrEqual(390);
  await page.getByRole('button',{name:'关闭详情'}).click();
 });
});
