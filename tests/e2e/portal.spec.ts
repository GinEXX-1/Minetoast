import {test,expect} from '@playwright/test';
import {fixture} from '../../content/fixtures/function-slice';
test('cross-domain Portal navigates without submitting a progress command',async({page})=>{
 const releaseId='00000000-0000-4000-8000-000000000001';
 const graph={...fixture,releaseId,domains:[...fixture.domains,{id:'other',nameZh:'跨域测试',nameEn:'Other',description:'Synthetic only',displayOrder:1}],nodes:fixture.nodes.map(n=>n.id==='HS-FUNC-QUAD-001'?{...n,domainId:'other'}:n)};
 await page.route('**/api/v1/knowledge/graph',route=>route.fulfill({json:graph}));
 const commands:string[]=[];page.on('request',r=>{if(r.url().endsWith('/progress/commands'))commands.push(r.postData()??'');});
 await page.goto('/legacy');await expect(page.locator('.knowledge-card')).toHaveCount(20);
 const portal=page.locator('.knowledge-card[data-testid^="node-view:portal:"]');await expect(portal).toHaveCount(1);await portal.click();
 await expect(page.getByTestId('node-HS-FUNC-QUAD-001')).toBeVisible();await expect(page.getByRole('combobox',{name:'领域',exact:true})).toHaveValue('other');expect(commands).toEqual([]);
 await page.getByLabel('定位知识').selectOption('HS-FUNC-QUAD-001');await page.getByRole('button',{name:'显示路径',exact:true}).click();
 await expect(page.getByTestId('node-MS-NUM-REAL-001')).toBeVisible();await expect(page.locator('.knowledge-card[data-testid^="node-view:portal:"]')).toHaveCount(0);
});
