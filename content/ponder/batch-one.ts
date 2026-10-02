import type {z} from 'zod';
import {sceneSchema,objectSchema,type SceneDefinition} from '../../packages/ponder/src/schema';
import {geometrySystem} from '../fixtures/geometry-system';
import {trigonometrySystem} from '../fixtures/trigonometry-system';
import {calculusSystem} from '../fixtures/calculus-system';
import {vectorsSystem} from '../fixtures/vectors-system';
type ObjectInput=z.input<typeof objectSchema>;
type StepInput=z.input<typeof sceneSchema>['steps'][number];
type V3=[string,string,string];type V2=[string,string];
const p=(label:string,min:number,max:number,value:number,step=.05)=>({label,min,max,default:value,step});
const plane=(id:string,label:string,origin:V3=['0','0','0'],u:V3=['1','0','0'],v:V3=['0','0','1'],color='muted'):ObjectInput=>({id,label,kind:'plane',origin,u,v,size:2.7,color:color as 'muted'|'green'});
const line3=(id:string,label:string,origin:V3,direction:V3,color:'cyan'|'gold'|'green'='cyan'):ObjectInput=>({id,label,kind:'line3',origin,direction,length:5,color});
const seg3=(id:string,label:string,from:V3,to:V3,color:'cyan'|'gold'|'green'='cyan'):ObjectInput=>({id,label,kind:'segment3',from,to,color});
const point=(id:string,label:string,at:V2,color:'cyan'|'gold'|'green'='gold',draggable?:string):ObjectInput=>({id,label,kind:'point',at,color,...(draggable?{draggable}:{})});
const plot=(id:string,label:string,expression:string,domain:[number,number],color:'cyan'|'gold'|'green'|'muted'='cyan',end?:string):ObjectInput=>({id,label,kind:'plot',expression,domain,color,...(end?{end}:{})});
const seg=(id:string,from:V2,to:V2,color:'cyan'|'gold'|'green'='gold',dashed=false,arrow=false):ObjectInput=>({id,label:'',kind:'segment',from,to,color,dashed,arrow});
const animate=(parameter:string,from:number,to:number)=>({parameter,from,to,start:2,duration:6,easing:'smooth' as const});
function step(id:string,title:string,caption:string,show:string[],extra:Partial<StepInput>={}):StepInput{
 return {id,title,caption,semanticLabel:caption,duration:10,show,cues:show.map((target,i)=>({target,kind:'draw',start:(i%4)*.35,duration:1.8})),narration:{captionAt:.3,formulaAt:2.5},...extra};
}
const concepts=[...geometrySystem.concepts,...trigonometrySystem.concepts,...calculusSystem.concepts,...vectorsSystem.concepts];
function make(input:{id:string;nodeId:string;renderer:SceneDefinition['renderer'];parameters:SceneDefinition['parameters'];objects:ObjectInput[];steps:StepInput[];expressions?:Record<string,string>;readouts?:SceneDefinition['readouts'];xRange?:[number,number];yRange?:[number,number]}){
 const node=concepts.find(n=>n.id===input.nodeId);if(!node)throw new Error(`Missing approved batch node ${input.nodeId}`);
 return sceneSchema.parse({id:input.id,nodeId:input.nodeId,title:node.canonicalName,version:1,dslVersion:1,renderer:input.renderer,pedagogy:{primary:input.renderer==='solid'?'SPATIAL_REASONING':'PARAMETER_PATTERN',secondary:['OBSERVE_PATTERN','COMPARE_PATTERN']},duration:input.steps.reduce((sum,s)=>sum+s.duration,0),scene:{axes:input.renderer!=='solid',xRange:input.xRange??[-3.5,3.5],yRange:input.yRange??[-3,4],camera:[6,4,7]},parameters:input.parameters,expressions:input.expressions??{},objects:input.objects,readouts:input.readouts??[],constraints:[],steps:input.steps,controls:{allowCameraRotation:true,supportsScrub:false},completion:{principleViewed:true},textbook:{sourceRef:node.sources[0].sourceRef,scope:`${node.canonicalName}：${node.summary} 本场景为可操作的具体构造，条件和结论需结合教材理解。`}});
}
const linePlane=make({id:'line-plane-parallel',nodeId:'HS-GEO-LINE-PLANE-PARALLEL-001',renderer:'solid',parameters:{height:p('直线离面高度 h',.4,2,.8),tilt:p('直线倾斜量 t',-.7,.7,.5)},objects:[plane('alpha','平面 α'),line3('b','b（面内）',['0','0','0'],['1','0','0'],'gold'),line3('a','a（面外）',['0','height','0'],['1','tilt','0'])],readouts:[{id:'heightValue',label:'离面高度 h',expression:'height'},{id:'normalComponent',label:'方向的法向分量 t',expression:'tilt'}],steps:[
 step('plane','找到面内直线','b 位于平面 α 中。先确认作为参照的面内直线。',['alpha','b']),
 step('align','让面外直线平行','把 a 的倾斜量调到零，a 与 b 的方向平行。a 必须在平面外。',['alpha','b','a'],{animate:[animate('tilt',.5,0)],readouts:['normalComponent']}),
 step('translate','改变离面高度','沿法向移动 a。只要 h≠0、倾斜量为零，a 始终与平面平行。',['alpha','b','a'],{animate:[animate('height',.8,1.8)],readouts:['heightValue','normalComponent']}),
 step('experiment','检验判定条件','改变高度保留平行；改变倾斜会破坏 a∥b。观察有限画面，推理中的直线仍无限延伸。',['alpha','b','a'],{interaction:['height','tilt'],readouts:['heightValue','normalComponent']}),
 step('theorem','回到判定定理','条件是面外直线 a 与面内直线 b 平行。不能省略 a 不在 α 内的条件。',['alpha','b','a'],{formula:String.raw`a\not\subset\alpha,\ b\subset\alpha,\ a\parallel b\ \Rightarrow\ a\parallel\alpha`,readouts:['heightValue','normalComponent']})
]});
const planePlane=make({id:'plane-plane-parallel',nodeId:'HS-GEO-PLANE-PLANE-PARALLEL-001',renderer:'solid',parameters:{height:p('两平面间距 h',.5,2.5,1.2),tilt:p('上平面倾角 t',-.7,.7,.45)},objects:[plane('alpha','平面 α'),plane('beta','平面 β',['0','height','0'],['1','0','0'],['0','sin(tilt)','cos(tilt)'],'green'),line3('a','a',['0','height','0'],['1','0','0']),line3('b','b',['0','height','0'],['0','sin(tilt)','cos(tilt)'],'gold')],readouts:[{id:'tiltValue',label:'上平面倾角',expression:'tilt'},{id:'distance',label:'平行时的间距 h',expression:'height'}],steps:[
 step('planes','观察两个平面','β 内的 a、b 相交。只有一个方向平行，还不足以判定面面平行。',['alpha','beta','a','b']),
 step('align','检查第二个方向','将 β 的倾角调到零，使 a、b 两个独立方向都平行于 α。',['alpha','beta','a','b'],{animate:[animate('tilt',.45,0)],readouts:['tiltValue']}),
 step('translate','保持平行地移动','沿法向改变 h，两个平面的方向保持一致；距离改变但平行关系保持。',['alpha','beta','a','b'],{animate:[animate('height',1.2,2)],readouts:['distance']}),
 step('experiment','尝试破坏条件','倾斜 β 时，b 不再平行于 α。显示的是有限平面片，真正的平面无限延伸。',['alpha','beta','a','b'],{interaction:['height','tilt'],readouts:['tiltValue','distance']}),
 step('theorem','两条相交线的作用','判定要检查同一平面内两条相交直线，它们分别平行于另一平面。',['alpha','beta','a','b'],{formula:String.raw`a,b\subset\beta,\ a\cap b=\{P\},\ a\parallel\alpha,\ b\parallel\alpha\ \Rightarrow\ \alpha\parallel\beta`})
]});
const lineAngleObjects:ObjectInput[]=[plane('alpha','平面 α'),seg3('slant','斜线段 OP',['0','0','0'],['2.5*cos(theta)','2.5*sin(theta)','0'],'green'),seg3('projection','射影 OH',['0','0','0'],['2.5*cos(theta)','0','0']),seg3('drop','垂线 PH',['2.5*cos(theta)','0','0'],['2.5*cos(theta)','2.5*sin(theta)','0'],'gold'),{id:'angle',label:'θ',color:'gold',kind:'arc3',origin:['0','0','0'],u:['1','0','0'],v:['0','1','0'],radius:'.7',angle:'theta'},{id:'right',label:'直角',kind:'angleMarker3',color:'cyan',origin:['2.5*cos(theta)','0','0'],first:['-1','0','0'],second:['0','1','0'],size:.25}];
const lineAngle=make({id:'line-plane-angle',nodeId:'HS-GEO-ANGLE-LINE-PLANE-001',renderer:'solid',parameters:{theta:p('线面角 θ（弧度）',.1,1.4,.3)},objects:lineAngleObjects,readouts:[{id:'degrees',label:'线面角（度）',expression:'theta*180/pi'},{id:'projectionLength',label:'射影长度 OH',expression:'2.5*cos(theta)'},{id:'height',label:'垂线长度 PH',expression:'2.5*sin(theta)'}],steps:[
 step('slant','从斜线开始','从斜线段端点 P 向平面作垂线。线面角需要使用正射影。',['alpha','slant']),
 step('project','构造正射影','PH 垂直于 α，H 是 P 的正射影。OH 是斜线段在 α 内的射影。',['alpha','slant','drop','projection','right']),
 step('measure','旋转斜线','斜线与其射影的夹角 θ 改变，OH=OP cosθ、PH=OP sinθ。',['alpha','slant','drop','projection','right','angle'],{animate:[animate('theta',.3,1.2)],readouts:['degrees','projectionLength','height']}),
 step('experiment','自由调节角度','θ 取锐角范围。观察投影缩短与垂线增长；垂直线面的情况对应 90° 极限。',['alpha','slant','drop','projection','right','angle'],{interaction:['theta'],readouts:['degrees','projectionLength','height']}),
 step('meaning','线面角的定义','取斜线和正射影之间的锐角，而不是斜线与平面内任意直线的夹角。',['alpha','slant','drop','projection','right','angle'],{formula:String.raw`\cos\theta=\frac{OH}{OP},\qquad 0<\theta<\frac{\pi}{2}`,readouts:['degrees']})
]});
const dihedral=make({id:'dihedral-angle',nodeId:'HS-GEO-DIHEDRAL-ANGLE-001',renderer:'solid',parameters:{theta:p('二面角 θ（弧度）',.15,2.8,.7)},objects:[plane('alpha','面 α'),plane('beta','面 β',['0','0','0'],['cos(theta)','sin(theta)','0'],['0','0','1'],'green'),line3('hinge','棱 l',['0','0','0'],['0','0','1'],'green'),seg3('rayA','OA',['0','0','0'],['2.4','0','0']),seg3('rayB','OB',['0','0','0'],['2.4*cos(theta)','2.4*sin(theta)','0'],'gold'),{id:'angle',label:'θ',kind:'arc3',color:'gold',origin:['0','0','0'],u:['1','0','0'],v:['0','1','0'],radius:'.8',angle:'theta'},{id:'rightA',label:'OA ⟂ l',kind:'angleMarker3',color:'cyan',origin:['0','0','0'],first:['1','0','0'],second:['0','0','1'],size:.3},{id:'rightB',label:'OB ⟂ l',kind:'angleMarker3',color:'gold',origin:['0','0','0'],first:['cos(theta)','sin(theta)','0'],second:['0','0','1'],size:.42}],readouts:[{id:'degrees',label:'二面角（度）',expression:'theta*180/pi'}],steps:[
 step('hinge','找到公共棱','α、β 沿公共棱 l 形成两个半平面；画面中的平面片用来指示其方向。',['alpha','beta','hinge']),
 step('section','作垂直于棱的截面','在同一棱上点 O，分别在两面内作 OA、OB，且二者都垂直于棱。',['alpha','beta','hinge','rayA','rayB','rightA','rightB']),
 step('rotate','平面角随开合变化','转动 β，OA 与 OB 的夹角随二面角同步变化。黄色弧线指示选定半平面的平面角。',['alpha','beta','hinge','rayA','rayB','angle'],{animate:[animate('theta',.7,2.2)],readouts:['degrees']}),
 step('experiment','自由开合','θ 可在锐角与钝角之间变化。请同时旋转视角，分清平面角与屏幕上的投影角。',['alpha','beta','hinge','rayA','rayB','angle','rightA','rightB'],{interaction:['theta'],readouts:['degrees']}),
 step('meaning','正确测量二面角','必须在同一个棱上点处作两条垂棱射线。它们所成的角才是该二面角的平面角。',['alpha','beta','hinge','rayA','rayB','angle'],{formula:String.raw`OA\perp l,\ OB\perp l,\qquad \theta=\angle AOB`,readouts:['degrees']})
]});
const sine=make({id:'sine-from-circle',nodeId:'HS-TRIG-SIN-GRAPH-001',renderer:'coordinate',xRange:[-4.5,7],yRange:[-1.7,1.7],parameters:{phase:p('角度 φ（弧度）',0,2*Math.PI,0)},objects:[{id:'circle',label:'单位圆',kind:'circle',center:['-3','0'],radius:'1',color:'muted'},point('circlePoint','P',['-3+cos(phase)','sin(phase)']),seg('radius',['-3','0'],['-3+cos(phase)','sin(phase)']),plot('curve','y = sin x','sin(x)',[0,2*Math.PI],'cyan','phase'),point('trace','Q',['phase','sin(phase)'],'green'),seg('connector',['-3+cos(phase)','sin(phase)'],['phase','sin(phase)'],'green',true)],readouts:[{id:'angle',label:'φ',expression:'phase'},{id:'sine',label:'sinφ',expression:'sin(phase)'}],steps:[
 step('circle','单位圆上的纵坐标','点 P 随角 φ 绕单位圆运动。纵坐标始终是 sinφ。',['circle','circlePoint','radius']),
 step('trace','把角度展开到横轴','让 Q 的横坐标等于 φ，纵坐标等于 P 的纵坐标。圆周运动与曲线生成同步。',['circle','circlePoint','radius','curve','trace','connector'],{animate:[animate('phase',0,2*Math.PI)],readouts:['angle','sine']}),
 step('keys','观察关键角','φ=0、π/2、π、3π/2、2π 对应 0、1、0、−1、0。走过一周后纵坐标回到初值。',['circle','circlePoint','radius','curve','trace','connector'],{animate:[animate('phase',0,2*Math.PI)],readouts:['angle','sine']}),
 step('experiment','自己追踪曲线','拖动角度滑块，观察对应点和已描出的曲线。横轴表示弧度，不是圆周上的横坐标。',['circle','circlePoint','radius','curve','trace','connector'],{interaction:['phase'],readouts:['angle','sine']}),
 step('formula','从运动得到图象','单位圆每转一周，正弦值重复一次，所以基本周期为 2π。',['circle','circlePoint','radius','curve','trace','connector'],{formula:String.raw`y=\sin x,\quad y\in[-1,1],\quad T=2\pi`,readouts:['angle','sine']})
]});
const sinusoid=make({id:'sinusoidal-parameters',nodeId:'HS-TRIG-SINUSOIDAL-FAMILY-001',renderer:'coordinate',xRange:[-6.5,6.5],yRange:[-3,3],parameters:{amplitude:p('振幅 A',.3,2.5,1),omega:p('角频率 ω',.4,2.5,1),phase:p('相位 φ',-Math.PI,Math.PI,0)},objects:[plot('reference','sin x','sin(x)',[-6.3,6.3],'muted'),plot('curve','A sin(ωx+φ)','amplitude*sin(omega*x+phase)',[-6.3,6.3])],readouts:[{id:'amplitudeValue',label:'振幅 A',expression:'amplitude'},{id:'period',label:'周期 T',expression:'2*pi/omega'},{id:'shift',label:'横向位移 −φ/ω',expression:'-phase/omega'}],steps:[
 step('reference','比较标准波形','灰线是 sin x，青线是 A sin(ωx+φ)。先保持 A=1、ω=1、φ=0。',['reference','curve']),
 step('amplitude','只改变振幅','A 增大时波峰升高、波谷降低，周期保持不变。',['reference','curve'],{animate:[animate('amplitude',1,2.2)],readouts:['amplitudeValue','period']}),
 step('period','只改变频率','ω 增大时周期 T=2π/ω 缩短。相同横轴区间内出现更多波形。',['reference','curve'],{animate:[animate('omega',1,2)],readouts:['period']}),
 step('phase','只改变相位','增加 φ 会把图象向左平移。横向位移是 −φ/ω，而不是 −φ。',['reference','curve'],{animate:[animate('phase',0,Math.PI)],readouts:['shift','period']}),
 step('experiment','组合三个参数','分别改变 A、ω、φ，并对照振幅、周期和横向位移的实时数值。',['reference','curve'],{interaction:['amplitude','omega','phase'],readouts:['amplitudeValue','period','shift']}),
 step('meaning','读懂参数含义','此场景限制 A>0、ω>0。振幅是 A，周期是 2π/ω，向右平移量是 −φ/ω。',['reference','curve'],{formula:String.raw`y=A\sin(\omega x+\varphi),\quad T=\frac{2\pi}{\omega},\quad \Delta x=-\frac{\varphi}{\omega}`,readouts:['amplitudeValue','period','shift']})
]});
const average=make({id:'average-rate',nodeId:'HS-CALC-RATE-OF-CHANGE-001',renderer:'coordinate',xRange:[-.5,3.5],yRange:[-.5,10],parameters:{x0:p('起点横坐标 x₀',.2,1.8,1),h:p('区间长度 h',.05,1.5,1.3)},expressions:{f:'x^2'},objects:[plot('curve','f(x)=x²','f(x)',[0,3.3]),point('P','P',['x0','f(x0)'],'gold','x0'),point('Q','Q',['x0+h','f(x0+h)'],'green'),seg('secant',['x0','f(x0)'],['x0+h','f(x0+h)'],'gold'),seg('dx',['x0','f(x0)'],['x0+h','f(x0)'],'green'),seg('dy',['x0+h','f(x0)'],['x0+h','f(x0+h)'],'green'),{id:'tangent',label:'切线',kind:'line',color:'muted',through:['x0','f(x0)'],direction:['1','2*x0']}],readouts:[{id:'dxValue',label:'Δx',expression:'h'},{id:'dyValue',label:'Δy',expression:'f(x0+h)-f(x0)'},{id:'rate',label:'平均变化率',expression:'(f(x0+h)-f(x0))/h'},{id:'instant',label:'此例的瞬时变化率',expression:'2*x0'}],steps:[
 step('points','选定两个位置','在 f(x)=x² 上选 P、Q。平均变化率度量整个区间，不是某一点的高度。',['curve','P','Q']),
 step('ratio','比较两种增量','绿色横段表示 Δx，竖段表示 Δy。割线斜率等于 Δy/Δx。',['curve','P','Q','dx','dy','secant'],{readouts:['dxValue','dyValue','rate']}),
 step('shrink','让区间逐渐缩短','保持起点，令 h 趋近于零。此例平均变化率 2x₀+h 趋近于 2x₀。',['curve','P','Q','secant','tangent'],{animate:[animate('h',1.3,.05)],readouts:['rate','instant']}),
 step('experiment','自己选择区间','改变起点与 h。h 保持正数，避免除以零；平均值和瞬时值通常不同。',['curve','P','Q','dx','dy','secant','tangent'],{interaction:['x0','h'],readouts:['dxValue','dyValue','rate','instant']}),
 step('meaning','有限区间与极限','平均变化率使用非零区间长度。瞬时变化率来自 h→0 的极限，不能直接把 h=0 代入差商。',['curve','P','Q','secant','tangent'],{formula:String.raw`\frac{f(x_0+h)-f(x_0)}{h}=2x_0+h\ \xrightarrow{h\to0}\ 2x_0`,readouts:['rate','instant']})
]});
const monotonic=make({id:'derivative-monotonicity',nodeId:'HS-CALC-MONOTONICITY-CRITERION-001',renderer:'coordinate',parameters:{x0:p('观察位置 x₀',-2,2,-1.8)},expressions:{f:'x^3-3*x',df:'3*x^2-3'},objects:[plot('curve','f(x)=x³−3x','f(x)',[-2.1,2.1]),plot('derivative','f′(x)=3x²−3','df(x)',[-1.5,1.5],'green'),point('P','P',['x0','f(x0)'],'gold','x0'),seg('tangent',['x0-.4','f(x0)-.4*df(x0)'],['x0+.4','f(x0)+.4*df(x0)'],'gold')],readouts:[{id:'value',label:'f(x₀)',expression:'f(x0)'},{id:'slope',label:'f′(x₀)',expression:'df(x0)'}],steps:[
 step('observe','观察变化趋势','青线 f(x)=x³−3x 的变化趋势随区间不同而改变。黄色短段是当前点的切线。',['curve','P','tangent']),
 step('positive','导数为正的区间','在 x<−1 的区间，切线斜率为正，函数递增。点处的正斜率不能代替整个区间的条件。',['curve','P','tangent','derivative'],{animate:[animate('x0',-2,-1.1)],readouts:['slope','value']}),
 step('negative','导数为负的区间','在 −1<x<1 的区间，导数为负，函数递减；x=±1 是导数零点。',['curve','P','tangent','derivative'],{animate:[animate('x0',-.9,.9)],readouts:['slope','value']}),
 step('experiment','检查每个区间','沿青线移动 P，对照绿色导数曲线。导数符号在整个区间上的条件才支持区间判定。',['curve','P','tangent','derivative'],{interaction:['x0'],readouts:['slope','value']}),
 step('theorem','条件与结论','对区间内可导的函数，导数恒正可判递增，恒负可判递减；导数零点要结合邻域分析。',['curve','P','tangent','derivative'],{formula:String.raw`f\prime(x)>0\Rightarrow f\text{ 递增};\qquad f\prime(x)<0\Rightarrow f\text{ 递减}`,readouts:['slope']})
]});
function extremum(maximum:boolean){const sign=maximum?'-':'',name=maximum?'极大':'极小';return make({id:maximum?'local-maximum':'local-minimum',nodeId:maximum?'HS-CALC-LOCAL-MAXIMUM-001':'HS-CALC-LOCAL-MINIMUM-001',renderer:'coordinate',parameters:{x0:p('切线位置 x₀',-1.8,1.8,-1.5),delta:p('邻域半径 δ',.1,1.5,.7)},expressions:{f:maximum?'2-x^2':'x^2-1',df:`${sign}2*x`},objects:[plot('curve',maximum?'f(x)=2−x²':'f(x)=x²−1','f(x)',[-2.2,2.2]),point('P','P',['x0','f(x0)'],'gold','x0'),point('center','极值点',['0','f(0)'],'green'),point('left','左邻点',['-delta','f(-delta)']),point('right','右邻点',['delta','f(delta)']),seg('tangent',['x0-.4','f(x0)-.4*df(x0)'],['x0+.4','f(x0)+.4*df(x0)'])],readouts:[{id:'slope',label:'f′(x₀)',expression:'df(x0)'},{id:'centerValue',label:'f(0)',expression:'f(0)'},{id:'neighborValue',label:'邻点函数值',expression:'f(delta)'}],steps:[
 step('observe','观察一个局部转折',`此具体函数在 x=0 附近形成${name}值。先观察曲线，再比较邻近值。`,['curve','P','tangent']),
 step('left','从左侧靠近',maximum?'左侧导数为正，曲线递增地接近极大值点。':'左侧导数为负，曲线递减地接近极小值点。',['curve','P','tangent','center'],{animate:[animate('x0',-1.5,-.05)],readouts:['slope']}),
 step('right','穿过转折点',maximum?'右侧导数变为负，曲线开始递减。观察由正变负的符号变化。':'右侧导数变为正，曲线开始递增。观察由负变正的符号变化。',['curve','P','tangent','center'],{animate:[animate('x0',0,1.5)],readouts:['slope']}),
 step('experiment','比较邻域函数值',`移动切线位置并调节邻域半径，检查 f(0) 与左右邻点。${name}值是局部概念。`,['curve','P','tangent','center','left','right'],{interaction:['x0','delta'],readouts:['slope','centerValue','neighborValue']}),
 step('meaning','从局部变化理解极值','本例导数为零处确有符号变化。一般情况下，只知道导数为零还不足以判定极值。',['curve','P','tangent','center','left','right'],{formula:maximum?String.raw`f\prime:\ +\to-\quad\Rightarrow\quad\text{局部极大值}`:String.raw`f\prime:\ -\to+\quad\Rightarrow\quad\text{局部极小值}`,readouts:['centerValue','neighborValue']})
]});}
const vectorDot=make({id:'vector-dot-product',nodeId:'HS-VECTOR-DOT-PRODUCT-001',renderer:'geometry',xRange:[-3.5,4],yRange:[-1,4],parameters:{lengthA:p('向量 a 的模',.5,3,2.5),lengthB:p('向量 b 的模',.5,3,2),phi:p('夹角 θ（弧度）',0,Math.PI,.7)},objects:[seg('a',['0','0'],['lengthA','0'],'cyan',false,true),seg('b',['0','0'],['lengthB*cos(phi)','lengthB*sin(phi)'],'gold',false,true),point('A','a',['lengthA','0'],'cyan'),point('B','b',['lengthB*cos(phi)','lengthB*sin(phi)'],'gold','phi'),seg('projection',['0','0'],['lengthB*cos(phi)','0'],'green',false,true),seg('drop',['lengthB*cos(phi)','lengthB*sin(phi)'],['lengthB*cos(phi)','0'],'green',true)],readouts:[{id:'degrees',label:'夹角（度）',expression:'phi*180/pi'},{id:'projectionValue',label:'b 在 a 方向的有向投影',expression:'lengthB*cos(phi)'},{id:'dot',label:'a·b',expression:'lengthA*lengthB*cos(phi)'}],steps:[
 step('vectors','先看两条向量','向量 a 与 b 的箭头表示方向。数量积的结果是实数，不是向量。',['a','b','A','B']),
 step('project','作有向投影','b 在 a 方向上的有向投影是 |b|cosθ。数量积等于 |a| 乘这个投影。',['a','b','A','B','projection','drop'],{readouts:['degrees','projectionValue','dot']}),
 step('rotate','从锐角转向钝角','夹角越过 90°，投影由正变负，数量积也由正变负；90° 时为零。',['a','b','A','B','projection','drop'],{animate:[animate('phi',.7,2.5)],readouts:['degrees','projectionValue','dot']}),
 step('experiment','拖动并改变长度','可拖动 b 的端点或使用滑块。同时改变长度，检查符号由夹角决定、大小由长度与夹角共同决定。',['a','b','A','B','projection','drop'],{interaction:['phi','lengthA','lengthB'],readouts:['degrees','projectionValue','dot']}),
 step('formula','回到数量积定义','此场景两向量均非零。锐角数量积为正，直角为零，钝角为负。',['a','b','A','B','projection','drop'],{formula:String.raw`\mathbf a\cdot\mathbf b=|\mathbf a|\,|\mathbf b|\cos\theta`,readouts:['degrees','projectionValue','dot']})
]});
export const batchOneScenes=[linePlane,planePlane,lineAngle,dihedral,sine,sinusoid,average,monotonic,extremum(true),extremum(false),vectorDot];
