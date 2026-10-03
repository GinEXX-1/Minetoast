# Ponder DSL v1

第二批扩展：二维新增 `parametric(x,y,domain,end?)`、`polygon(vertices,opacity)`、`label(at)`、`samples(points,count?,connect)`、`region(operation,first,second?,bounds,opacity)`。region 引用 circle 对象，支持 union、intersection、相对 bounds 宇宙区域的 complement。samples 最多 512 点，polygon 为 3–32 个顶点。参数曲线采用固定 241 点采样。位置与动态计数通过安全表达式求值。

`scene.captionPlacement` 可选 overlay（默认）或 below（舞台下方独立说明区）。这是通用布局配置，没有节点特定渲染分支。

表达式新增 `floor(x)` 和 `frequency(n,p,seed)`。frequency 要求 n∈[1,1000]、p∈[0,1]、整数 seed∈[1,10]，按 floor(n) 返回可回放伪随机伯努利前缀频率。每个 p/seed 缓存 1000 次累计结果，最多 32 项；初次 O(1000)，查询 O(1)，空间有界。模拟不构成随机独立性或大数定律的证明。

权威运行时 Schema：`packages/ponder/src/schema.ts`。机器可读版本：`ponder-scene.schema.json`。场景是 JSON 数据，TS fixture 仅包装严格解析；不是代码执行格式。

顶层：id、version、dslVersion、nodeId、title、renderer、pedagogy、duration、scene、parameters、expressions、objects、readouts、constraints、steps、controls、completion、textbook。未知字段拒绝。版本目前仅为 1；duration 30–180 秒；3–8 步。

参数包含 min/max/default/step/label。上下界有限且严格有序，默认值必须位于合法范围。有序约束 `{kind:'ordered',lower:'x1',upper:'x2',gap:0.05}` 保证严格顺序；V1 参数对互不重叠。

表达式支持 `+ - * / ^`、括号、一元正负号、数值、变量、参数、pi、sin/cos/tan/sqrt/abs/exp/log/min/max，以及 `f(x)` 形式的具名表达式。幂右结合，`-2^2=-4`。最长 256 字符，最大解析嵌套 32 层，表达式引用最多 16 层；循环拒绝。未定义、不有限或绝对值超过 1e10 的结果拒绝。Plot 中未定义采样产生断开路径，不把断点两侧相连。

对象：plot(expression/domain)、point(at/draggable)、segment(from/to/dashed)、circle(center/radius)、line(through/direction)、intersections(circle/line)、angleMarker(origin/first/second)、plane(origin/u/v/size)、line3(origin/direction/length/auxiliary)、point3(at)。坐标是表达式数组，避免渲染器持有节点特定数学知识。

首批扩展：plot 可声明表达式 `end`，表示当前轨迹的自变量终点，必须位于 domain 内；segment 的可选布尔 `arrow` 显示有向线段（默认 false）。solid 新增 `segment3(from/to/auxiliary)` 与 `arc3(origin/u/v/radius/angle/auxiliary)`。arc3 的 u、v 是正交单位向量，radius 必须为正，angle 以弧度表示且位于 [0,2π]；端点、基向量和弧上点均在世界坐标计算。未知字段仍拒绝，DSL 版本仍为 1。

每步：id、title、caption、semanticLabel、duration、show、highlight、formula、interaction、animate、camera、readouts、cues、narration。readouts 引用顶层声明的 {id,label,expression} 数值读数；实时值通过相同数学求值器计算，不在 UI 绑定特定变量名。show 为该步完整对象快照，seek 不依赖之前 DOM 状态。animate 指定真实参数的 from/to/start/duration/easing，运行时连续重算；不是像素关键帧。进入 interaction 自动暂停；按钮继续，不需要测验。camera 是可选教学视角，学生始终可以手动旋转。

完成仅记录 principleViewed。supportsScrub 为能力声明；当前播放器未实现 Scrub，场景应设 false。禁用整个相机旋转不是这些 Pilot 的配置。

## 可回放动画轨道

`cues: [{target, kind: "draw"|"reveal"|"pulse", start, duration}]` 引用本步 show 中的对象，时间不得越过本步。`narration: {captionAt, formulaAt}` 控制说明与符号表达出现。`animate` 的 start 默认为 0，duration 默认为本步余时，easing 默认为 linear，可选 smooth。`angleMarker3` 包含 origin/first/second/size/auxiliary，数学校验要求两个方向非退化且正交。readout 可声明有限递增 `range: [min,max]`，用于舞台内的真实值条；数值超出显示范围仅截断条长，不改变原始读数。
