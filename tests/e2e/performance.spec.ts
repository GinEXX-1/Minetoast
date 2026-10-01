import {test,expect} from '@playwright/test';
import {cpus,platform,arch} from 'node:os';
import {fixture} from '../../content/fixtures/function-slice';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import {writeFile} from 'node:fs/promises';
// Informational trace: report budget failures honestly; not a mathematical fixture.
test('400-node synthetic DAG performance record',async({page,browser},info)=>{
 test.setTimeout(90000);
 const nodes=Array.from({length:400},(_,i)=>({...fixture.nodes[6],id:`HS-TEST-NODE-${String(i).padStart(3,'0')}`,nameZh:`测试节点 ${i}`,isRoot:i<20,formulas:[]}));
 const edges:KnowledgeEdge[]=[];
 for(let layer=0;layer<19;layer++)for(let column=0;column<20;column++)for(let offset=0;offset<3;offset++){
  const a=layer*20+column,b=(layer+1)*20+(column+offset)%20;
  edges.push({...fixture.edges[0],id:`edge-${a}-${b}`,sourceNodeId:nodes[a].id,targetNodeId:nodes[b].id});
 }
 await page.route('**/api/v1/knowledge/graph',route=>route.fulfill({json:{...fixture,nodes,edges,releaseId:'00000000-0000-4000-8000-000000000001'}}));
 await page.addInitScript(()=>{
  const state={longTasks:[] as {start:number;duration:number}[],events:[] as number[],inputToFrame:[] as number[],panActive:false};(window as any).__perf=state;
  document.addEventListener('input',event=>{const start=event.timeStamp;requestAnimationFrame(()=>requestAnimationFrame(()=>state.inputToFrame.push(performance.now()-start)));},true);
  new PerformanceObserver(list=>{for(const e of list.getEntries())state.longTasks.push({start:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())state.events.push(e.duration);}).observe({type:'event',buffered:true,durationThreshold:16} as PerformanceObserverInit);
 });
 const layouts:number[]=[];
 for(let i=0;i<5;i++){await page.goto('/legacy');await expect(page.locator('.knowledge-card')).toHaveCount(400,{timeout:20000});layouts.push(await page.evaluate(()=>performance.getEntriesByName('knowledge-layout').at(-1)!.duration));}
 const pane=page.locator('.react-flow__pane'),bounds=(await pane.boundingBox())!;
 await page.evaluate(()=>{(window as any).__perf.panActive=true;});
 const samples=page.evaluate(()=>new Promise<number[]>(resolve=>{const frames:number[]=[];let last=performance.now();function tick(now:number){frames.push(now-last);last=now;if((window as any).__perf.panActive)requestAnimationFrame(tick);else resolve(frames.slice(2));}requestAnimationFrame(tick);}));
 await page.mouse.move(bounds.x+70,bounds.y+70);await page.mouse.down();for(let i=0;i<60;i++)await page.mouse.move(bounds.x+70+i*3,bounds.y+70+(i%5)*2);await page.mouse.up();
 await page.evaluate(()=>{(window as any).__perf.panActive=false;});
 const frameTimes=await samples;
 for(let i=0;i<30;i++){await page.getByLabel('搜索知识或数学符号').fill('测试节点 '+i);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
 const normalInput=await page.evaluate(()=>(window as any).__perf.inputToFrame) as number[];
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReturnAsStream'});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.reload();await expect(page.locator('.knowledge-card')).toHaveCount(400,{timeout:30000});
 for(let i=0;i<30;i++){await page.getByLabel('搜索知识或数学符号').fill('测试节点 '+i);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
 const measured=await page.evaluate(()=>(window as any).__perf) as {longTasks:{start:number;duration:number}[];events:number[];inputToFrame:number[]};
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
 const traceReady=new Promise<{stream?:string}>(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await traceReady;if(!stream)throw new Error('CDP did not return a trace stream');const chunks:Buffer[]=[];
 for(;;){const chunk=await cdp.send('IO.read',{handle:stream});chunks.push(Buffer.from(chunk.data,chunk.base64Encoded?'base64':'utf8'));if(chunk.eof)break;}await cdp.send('IO.close',{handle:stream});
 const tracePath=info.outputPath('cpu4x-browser-trace.json');await writeFile(tracePath,Buffer.concat(chunks));await info.attach('cpu4x-browser-trace.json',{path:tracePath,contentType:'application/json'});
 const percentile=(values:number[],q:number)=>[...values].sort((a,b)=>a-b)[Math.max(0,Math.ceil(values.length*q)-1)]??0;
 const long=measured.longTasks.filter(t=>t.duration>200),consecutive=long.some((t,i)=>i>0&&t.start-(long[i-1].start+long[i-1].duration)<50);
 const report={environment:{browser:browser.version(),cpu:cpus()[0]?.model,platform:platform(),arch:arch(),viewport:'1440x900'},graph:{nodes:400,edges:edges.length},layoutMs:layouts,layoutP95:percentile(layouts,.95),panMedianFPS:1000/percentile(frameTimes,.5),panFrames:frameTimes.length,cpu4xLongTasks:long,cpu4xConsecutiveOver200ms:consecutive,inputToFrameP95:percentile(normalInput,.95),inputSamples:normalInput.length,cpu4xInputP95:percentile(measured.inputToFrame,.95),eventP95:measured.events.length?percentile(measured.events,.95):null,notes:'5 cold page loads; rAF while actively dragging (not GPU presentation FPS); 30 input events to second rAF per CPU setting. Baseline 100ms budget and CPU4x no consecutive >200ms are separate requirements.'};
 const reportPath=info.outputPath('performance.json');await writeFile(reportPath,JSON.stringify(report,null,2));await info.attach('performance.json',{path:reportPath,contentType:'application/json'});console.log('PERFORMANCE',JSON.stringify(report));
 await page.screenshot({path:'test-results/performance.png'});
 expect.soft(report.layoutP95).toBeLessThanOrEqual(1000);expect.soft(report.panMedianFPS).toBeGreaterThanOrEqual(50);expect.soft(report.inputSamples).toBeGreaterThanOrEqual(30);expect.soft(report.inputToFrameP95).toBeLessThanOrEqual(100);expect.soft(consecutive).toBe(false);
});
