import {expect,test} from '@playwright/test';
import {strongAncestors} from '../../packages/graph-core/src/index';
import {worldGraph,worldGraphVersion,worldProgressStorageKey} from '../../apps/web/src/function-world-model';

test('P3E ordinary unlock has one item toast',async({page})=>{
 await page.addInitScript(({key,version})=>localStorage.setItem(key,JSON.stringify({schemaVersion:1,graphVersion:version,initialized:true,unlockedNodeIds:[]})),{key:worldProgressStorageKey,version:worldGraphVersion});
 await page.goto('/function-world');
 await page.locator('[data-testid="world-node-HS-SET-CONCEPT-001"] .kw-frame').click();
 await expect(page.locator('#world-progress-panel .world-sidebar-total').filter({hasText:'1 / 32'})).toBeVisible();
 const toast=page.locator('.world-toasts>div').filter({hasText:'集合的概念'});
 await expect(toast).toContainText('知识解锁');
 await expect(toast.locator('svg')).toHaveCount(1);
 await expect(page.locator('.world-toasts>div')).toHaveCount(1);
});

test('P3E key achievement has distinct message; reduced motion suppresses animation',async({page})=>{
 const nodeId='HS-FUNC-CONCEPT-001';
 const unlockedNodeIds=[...strongAncestors(worldGraph,[nodeId])].filter(id=>id!==nodeId);
 await page.addInitScript(({key,version,ids})=>localStorage.setItem(key,JSON.stringify({schemaVersion:1,graphVersion:version,initialized:true,unlockedNodeIds:ids})),{key:worldProgressStorageKey,version:worldGraphVersion,ids:unlockedNodeIds});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/function-world');
 const frame=page.locator(`[data-testid="world-node-${nodeId}"] .kw-frame`);
 await expect(frame).toHaveAttribute('data-state','available');
 await frame.click();
 const toast=page.locator('.world-toasts>div.key');
 await expect(toast).toContainText('关键成就达成');
 await expect(toast).toContainText('函数的概念');
 expect(await toast.evaluate(element=>getComputedStyle(element).animationName)).toBe('none');
 await page.screenshot({path:'.tmp/motion-key-achievement.png',animations:'disabled'});
});

test('batch initialization shows one summary toast, one particle burst and bounded ancestor animation',async({page})=>{
 await page.goto('/function-world');
 await page.locator('[data-testid="world-node-HS-FUNC-BISECTION-001"] .kw-frame').click();
 await expect(page.locator('#world-progress-panel .world-sidebar-total').filter({hasText:'9 / 32'})).toBeVisible();
 await expect(page.locator('.world-toasts>div')).toHaveCount(1);
 await expect(page.locator('.world-toasts>div')).toContainText('已自动点亮 9 个知识节点');
 await expect(page.locator('.world-card.ancestor-pulse')).toHaveCount(8);
 await expect(page.locator('.world-card .kw-pixel-burst')).toHaveCount(1);
 await expect(page.locator('.world-card .kw-spark')).toHaveCount(12);
});
