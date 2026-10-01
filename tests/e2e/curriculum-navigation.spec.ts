import {expect,test} from '@playwright/test';

test('a large mounted curriculum graph supports search fly-to and Strong-path highlighting',async({page})=>{
 await page.goto('/systems/calculus');
 await expect(page.getByTestId('curriculum-calculus-world')).toBeVisible();
 await expect(page.locator('.react-flow__node')).toHaveCount(41);
 await expect(page.locator('.react-flow__edge')).toHaveCount(50);
 await expect(page.locator('.react-flow__minimap')).toBeVisible();
 const viewport=page.locator('.react-flow__viewport'),miniMapWindow=page.locator('.react-flow__minimap-mask');
 const transformBeforeZoom=await viewport.getAttribute('style'),mapBeforeZoom=await miniMapWindow.getAttribute('d');
 await page.getByRole('button',{name:'Zoom In'}).click();
 await expect.poll(()=>viewport.getAttribute('style')).not.toBe(transformBeforeZoom);
 await expect.poll(()=>miniMapWindow.getAttribute('d')).not.toBe(mapBeforeZoom);
 await page.getByRole('region',{name:'图谱操作'}).getByRole('button',{name:'Fit View'}).click();

 const search=page.getByRole('textbox',{name:'搜索导数知识'});
 await search.fill('用导数综合研究函数');
 await page.locator('.curriculum-search-results button').filter({hasText:'用导数综合研究函数'}).click();
 await expect(page.getByRole('heading',{name:'用导数综合研究函数'})).toBeVisible();

 await page.getByRole('combobox',{name:'路径起点'}).selectOption('HS-CALC-DERIVATIVE-DEFINITION-001');
 await page.getByRole('combobox',{name:'路径终点'}).selectOption('HS-CALC-FUNCTION-ANALYSIS-001');
 await page.getByRole('button',{name:'显示路径'}).click();
 const highlighted=page.locator('.react-flow__edge.animated');
 await expect(highlighted).toHaveCount(24);
 await expect.poll(()=>highlighted.first().locator('.react-flow__edge-path').evaluate(path=>getComputedStyle(path).stroke)).toBe('rgb(242, 209, 114)');
 await expect(page.getByRole('button',{name:'清除路径'})).toBeVisible();
});
