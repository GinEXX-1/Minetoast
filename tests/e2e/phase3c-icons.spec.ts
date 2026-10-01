import {expect,test} from '@playwright/test';

test('MathCraft representative inventory keeps twelve unique integer-grid icons',async({page})=>{
 await page.goto('/phase-3c-icons');
 const board=page.getByTestId('p3c-representatives');
 await expect(board.locator('.p3c-inventory__item')).toHaveCount(12);
 const ids=await board.locator('.p3c-inventory__item').evaluateAll(items=>items.map(item=>item.getAttribute('data-node-id')));
 expect(new Set(ids).size).toBe(12);
 const geometry=await board.locator('svg').evaluateAll(items=>items.map(svg=>({viewBox:svg.getAttribute('viewBox'),rects:Array.from(svg.querySelectorAll('rect')).map(rect=>[rect.getAttribute('x'),rect.getAttribute('y'),rect.getAttribute('width'),rect.getAttribute('height')].map(Number))})));
 for(const icon of geometry){
  expect(icon.viewBox).toBe('0 0 32 32');
  expect(icon.rects.length).toBeGreaterThan(4);
  for(const rect of icon.rects)for(const value of rect)expect(Number.isInteger(value)).toBe(true);
 }
 await board.screenshot({path:'assets/phase-3/mathcraft/p3c-representative-board.png'});
});

test('complete MathCraft inventory contains the thirty-two active concepts without duplicate artwork',async({page})=>{
 await page.goto('/phase-3c-icons');
 const board=page.getByTestId('p3c-inventory');
 await expect(board.locator('.p3c-inventory__item')).toHaveCount(32);
 const ids=await board.locator('.p3c-inventory__item').evaluateAll(items=>items.map(item=>item.getAttribute('data-node-id')));
 expect(new Set(ids).size).toBe(32);
 const iconMarkup=await board.locator('svg').evaluateAll(items=>items.map(item=>item.innerHTML));
 expect(new Set(iconMarkup).size).toBe(32);
 await board.screenshot({path:'assets/phase-3/mathcraft/p3c-32-item-inventory.png'});
 await page.locator('.p3c-state-test').screenshot({path:'assets/phase-3/mathcraft/p3c-state-sample.png'});
});
