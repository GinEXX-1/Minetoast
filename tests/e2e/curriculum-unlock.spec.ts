import {expect,test} from '@playwright/test';

test('advanced calculus node initializes 20+ real ancestors with bounded feedback',async({page})=>{
 const clickProbe=page.waitForResponse(response=>response.url().endsWith('/audio/click_stereo.ogg')&&response.request().method()==='HEAD');
 await page.goto('/systems/calculus');
 expect((await clickProbe).status()).toBe(200);
 const target=page.getByRole('button',{name:'用导数综合研究函数，未解锁'});
 await expect(target).toBeVisible();
 const clickPlayback=page.waitForResponse(response=>response.url().endsWith('/audio/click_stereo.ogg')&&response.request().method()==='GET');
 const achievementPlayback=page.waitForResponse(response=>response.url().endsWith('/audio/Challenge_complete.ogg')&&response.request().method()==='GET');
 await target.click();
 expect([200,206]).toContain((await clickPlayback).status());
 expect([200,206]).toContain((await achievementPlayback).status());
 await expect(page.getByText('已自动点亮 24 个知识节点')).toBeVisible();
 await expect(page.locator('dialog .world-toasts>div')).toHaveCount(1);
 await expect(page.locator('.curriculum-node.pulse')).toHaveCount(9);
 await expect(page.locator('.curriculum-node .kw-pixel-burst')).toHaveCount(1);
 await expect(page.locator('.curriculum-node .kw-spark')).toHaveCount(24);
 await expect(page.locator('#curriculum-progress-panel').getByText('24 / 41')).toBeVisible();
 const unlocked=await page.evaluate(()=>JSON.parse(localStorage.getItem('kw:curriculum:calculus:v1')??'null')?.unlocked);
 expect(unlocked).toHaveLength(24);
});
