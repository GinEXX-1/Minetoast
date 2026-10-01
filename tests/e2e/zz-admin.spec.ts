import {test,expect} from '@playwright/test';
// This publication test changes the shared disposable E2E graph head; run after baseline regressions.
test('administrator records an optional human note without bypassing the quality gate',async({page})=>{
 await page.goto('/legacy');await page.getByRole('button',{name:'登录 / 注册'}).click();await page.getByRole('textbox',{name:'用户名',exact:true}).fill('e2e_admin');await page.getByLabel('密码',{exact:true}).fill('isolated-e2e-admin-password');await page.getByRole('button',{name:'登录',exact:true}).click();
 await page.getByRole('button',{name:'管理内容'}).click();await page.getByRole('combobox',{name:'对象',exact:true}).selectOption('HS-FUNC-QUAD-001');
 await page.getByLabel('修改字段 JSON（ID 不可变；退休用 retired）').fill(JSON.stringify({descriptionShort:'浏览器测试中的未发布说明'}));await page.getByRole('button',{name:'保存草稿并重置质量记录'}).click();
 await expect(page.locator('.admin-dialog pre[role="status"]')).toContainText('REVIEW_REQUIRED');
 const live=await(await page.request.get('/api/v1/knowledge/graph')).json();expect(live.nodes.find((n:any)=>n.id==='HS-FUNC-QUAD-001').descriptionShort).not.toBe('浏览器测试中的未发布说明');
 await page.getByLabel('人工备注（可选，不是发布硬门）').fill('自动化隔离环境的人工备注模拟，不是正式质量结论。');await page.getByRole('button',{name:'记录人工备注',exact:true}).click();await expect(page.locator('.admin-dialog pre[role="status"]')).toContainText('APPROVED');
 await page.getByRole('button',{name:'发布质量门快照'}).click();await expect(page.locator('.admin-dialog pre[role="status"]')).toContainText('releaseId');
 expect((await(await page.request.get('/api/v1/knowledge/graph')).json()).releaseId).not.toBe(live.releaseId);
 await page.screenshot({path:'test-results/admin.png'});
});
