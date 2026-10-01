import {test,expect} from '@playwright/test';

test('isolated Phase 2C search and detail drawer work without calling production APIs',async({page})=>{
 const apiRequests:string[]=[];page.on('request',request=>{if(new URL(request.url()).pathname.startsWith('/api/'))apiRequests.push(request.url());});
 await page.goto('/?phase=2c');
 await expect(page.getByText('32 active nodes · 未发布')).toBeVisible();
 await expect(page.locator('.p2c-card')).toHaveCount(32);
 await page.getByRole('textbox',{name:'搜索知识详情'}).fill('qujian');
 await expect(page.getByRole('button',{name:/区间表示/}).first()).toBeVisible();
 await page.getByRole('button',{name:/区间表示/}).click();
 const drawer=page.getByRole('dialog',{name:'区间表示知识详情'});
 await expect(drawer).toBeVisible();await expect(drawer.locator('.katex')).toBeVisible();
 await expect(drawer.getByText('印刷页：64；PDF页：71')).toBeVisible();
 await expect(drawer.getByText(/Problem|问题/)).toBeVisible();
 await drawer.getByRole('button',{name:'查看'}).first().click();
 await expect(page.getByRole('dialog',{name:'集合的概念知识详情'})).toBeVisible();
 await page.getByRole('button',{name:'关闭详情'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('textbox',{name:'搜索知识详情'}).fill('反比例函数');
 await page.getByRole('button',{name:/反比例函数的图像与性质/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 expect(apiRequests).toEqual([]);
});

test('Phase 2C detail drawer remains usable on narrow viewports',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/?phase=2c');
 await page.getByRole('button',{name:/函数的定义域/}).click();
 const drawer=page.getByRole('dialog',{name:'函数的定义域知识详情'});await expect(drawer).toBeVisible();
 await expect(drawer.getByRole('heading',{name:'例题与完整过程'})).toBeVisible();
 const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
 expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
 await drawer.getByRole('button',{name:'关闭详情'}).click();await expect(drawer).toHaveCount(0);
});
