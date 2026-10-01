import {expect,test} from '@playwright/test';

test('P3D uses the MathCraft nine-state system in the live function graph',async({page})=>{
 await page.goto('/function-world');
 await expect(page.locator('.world-card')).toHaveCount(32);
 await expect(page.locator('.world-card .kw-frame')).toHaveCount(32);
 await expect(page.locator('.world-card .kw-frame svg')).toHaveCount(32);
 await expect(page.locator('.world-card.key')).toHaveCount(5);
 const size=await page.locator('.world-card').first().evaluate(element=>({width:getComputedStyle(element).width,height:getComputedStyle(element).height}));
 expect(size).toEqual({width:'100px',height:'100px'});
 await expect(page.locator('.react-flow__edge')).toHaveCount(40);
 await page.waitForTimeout(300);
 await page.screenshot({path:'assets/phase-3/p3d-full-graph-overview.png',fullPage:true,animations:'disabled'});
 const path=await page.locator('.react-flow__edge path').first().getAttribute('d');
 expect(path).toMatch(/^M .* V .* H .* V /);
 await page.getByRole('textbox',{name:'搜索知识'}).fill('monotonicity');
 expect(await page.locator('.world-search-results svg').count()).toBeGreaterThan(0);
 await page.getByRole('option',{name:/函数的单调性/}).first().click();
 await expect(page.locator('[data-testid="world-node-HS-FUNC-MONO-001"] .kw-frame')).toHaveAttribute('data-selected','true');
 await expect.poll(()=>page.locator('.react-flow__viewport').evaluate(element=>Number(getComputedStyle(element).transform.match(/^matrix\(([^,]+)/)?.[1]??0))).toBeGreaterThan(1);
 await page.screenshot({path:'assets/phase-3/p3d-live-world-desktop.png',fullPage:true,animations:'disabled'});
});

test('P3D pixel frame stays keyboard-operable and mobile layout has no overflow',async({page})=>{
 await page.goto('/function-world');
 await page.getByRole('button',{name:'生成我的数学知识地图'}).click();
 const root=page.locator('[data-testid="world-node-HS-SET-CONCEPT-001"] .kw-frame');
 await root.focus();await page.keyboard.press('Enter');
 await expect(page.locator('[data-testid="world-node-HS-SET-CONCEPT-001"]')).toHaveAttribute('data-status','unlocked');
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'关闭详情'}).click();
 await page.getByRole('checkbox',{name:'显示完整知识关系'}).check();
 await expect(page.locator('.react-flow__edge')).toHaveCount(51);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
 await page.screenshot({path:'assets/phase-3/p3d-live-world-mobile.png',fullPage:true,animations:'disabled'});
});
