import {expect,test} from '@playwright/test';

test('P3B matrix uses one placeholder and nine independent level/state combinations',async({page})=>{
 await page.goto('/phase-3b-frames');
 const matrix=page.locator('#p3b-matrix');
 await expect(matrix.locator('.p3b-matrix__cell')).toHaveCount(9);
 const combinations=['normal_locked','normal_available','normal_unlocked','core_locked','core_available','core_unlocked','key_locked','key_available','key_unlocked'];
 for(const combination of combinations)await expect(matrix.locator(`[data-combination="${combination}"] .kw-frame`)).toHaveCount(1);
 const placeholders=await matrix.locator('.kw-frame__placeholder').evaluateAll(items=>items.map(item=>item.innerHTML));
 expect(new Set(placeholders).size).toBe(1);
 const iconSafe=await matrix.locator('.kw-frame__icon-safe').first().evaluate(element=>({width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height}));
 expect(iconSafe).toEqual({width:48,height:48});
 await matrix.screenshot({path:'assets/phase-3/node-frames/p3b-9-state-board.png'});
 await matrix.evaluate(element=>{(element as HTMLElement).style.filter='grayscale(1)';});
 await matrix.screenshot({path:'assets/phase-3/node-frames/p3b-9-state-board-grayscale.png'});
});

test('P3B real graph preview keeps 32 nodes, nine showcase states, zooms and interaction overlays',async({page})=>{
 await page.goto('/phase-3b-frames');
 const stage=page.locator('.p3b-graph-stage');
 await expect(stage).toHaveAttribute('data-ready','true');
 await expect(stage.locator('.p3b-graph-node')).toHaveCount(32);
 await expect(stage.locator('.p3b-graph-node[data-level="normal"]')).toHaveCount(4);
 await expect(stage.locator('.p3b-graph-node[data-level="core"]')).toHaveCount(23);
 await expect(stage.locator('.p3b-graph-node[data-level="key"]')).toHaveCount(5);
 for(const level of ['normal','core','key'])for(const state of ['locked','available','unlocked'])await expect(stage.locator(`.p3b-graph-node[data-level="${level}"][data-state="${state}"]`).first()).toBeAttached();
 await page.getByRole('button',{name:'100%',exact:true}).click();
 await expect(stage.getByText('当前缩放 100%')).toBeVisible();
 await stage.screenshot({path:'assets/phase-3/node-frames/p3b-graph-100.png'});
 await page.getByRole('button',{name:'75%',exact:true}).click();
 await expect(stage.getByText('当前缩放 75%')).toBeVisible();
 await stage.screenshot({path:'assets/phase-3/node-frames/p3b-graph-75.png'});
 await page.getByRole('button',{name:'50%',exact:true}).click();
 await expect(stage.getByText('当前缩放 50%')).toBeVisible();
 await stage.screenshot({path:'assets/phase-3/node-frames/p3b-graph-50.png'});
 await page.getByRole('button',{name:'定位 Key Locked'}).click();
 const frame=stage.locator('.p3b-graph-node[data-level="key"][data-state="locked"] .kw-frame').first();
 await frame.click();
 await expect(frame).toHaveAttribute('data-selected','true');
 await expect(frame).toHaveAttribute('data-level','key');
 await expect(frame).toHaveAttribute('data-state','locked');
 await frame.focus();
 await expect(frame).toBeFocused();
 await expect(frame).toHaveAttribute('aria-label',/关键成就，未解锁/);
 await page.getByRole('button',{name:'Fit View'}).click();
 await expect.poll(async()=>Number((await stage.getByText(/当前缩放/).innerText()).match(/\d+/)?.[0])).toBeLessThan(100);
 await stage.screenshot({path:'assets/phase-3/node-frames/p3b-graph-fit.png'});
});
