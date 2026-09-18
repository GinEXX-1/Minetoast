# Graph Engine 架构与语义

## 1. 状态模型

记 U 为当前用户的已掌握节点集合；P(n) 为当前发布图中 n 的直接 Strong 前置。

```
status(n) = unlocked     当 n ∈ U（最高优先级）
          = available    当 n ∉ U 且 P(n) ⊆ U
          = locked       其他情况
```

Root 的 P(n) 为空，故可解锁。只要求直接强前置满足，不额外要求祖先全部仍解锁：这是非级联回退的自然结果。已解锁节点即使缺失前置仍保持 Unlocked，可在详情提示补基础。连线是否满足仅取决于 source 是否在 U，不依赖 target 是否点亮。

游客 U 为空用于展示入口依赖；个人进度显示“登录后建立”，不显示游客有一份持久化 0% 进度。

|场景|行为|
|---|---|
|所有状态 Hover|只显示正式名、成就名、一句话解释|
|普通模式 Available 点击|账户发送解锁命令；游客提示登录，同时保留“查看详情”入口|
|Locked / Unlocked 点击|打开右侧详情抽屉，禁止以锁阻止阅读|
|初始化模式点击目标 X|后端求 StrongAncestors(X) ∪ {X}，一次事务批量增量写入|
|撤销 X|仅删除 X 的掌握行；已点亮后继不删除|
|Available 想先读内容|上下文操作、键盘详情键及触屏长按/更多菜单提供详情入口|

初始化可能推断掌握事实，不等同考试验证；source 明确区分 initialization_target 与 initialization_ancestor。既有记录不覆盖来源，重复点击不重写 unlockedAt。自评掌握不是能力测量，产品不输出伪精确考分概率。

## 2. 图核心

输入是审核后的全局图，而非当前 Domain 可见子图；跨域 Strong 仍参与解锁和祖先闭包。一次建立 nodesById、incomingStrong、outgoingStrong、directConnections、domainIndex；O(V+E)。用户进度变更只更新受影响节点、直接后继的 available 状态和领域计数，不重新布局。撤销已点亮节点只影响其未点亮的直接后继状态。

算法模块纯函数，既用于服务端权威校验，也用于前端即时预览。不得把 XYFlow 类型传播到 domain；Portal 是 ViewNode，ID 用 view:portal 前缀，与正式 NodeId 分离，不入进度表，不入探索度。

## 3. 路径语义

全部基于 enabled 且已发布 Strong 边，Weak 开关只改变显示。

- Path To(X)：X 与所有强祖先构成的子图，包含全部必要先修，不只是一条最短链。
- Path From(X)：X 与全部强后继形成的可达子图。表示可继续探索，不表示只会 X 就满足后继全部条件。
- Path Between(A,B)：若 A 可达 B，节点为 (Descendants(A) ∪ {A}) ∩ (Ancestors(B) ∪ {B})；边取两端均在集合内的 Strong 边。可在 O(V+E) 内求所有有效路径的并集，不枚举指数数量的路径。
- A=B 返回自身与空边；A 不可达 B 返回 reachable=false，显示“没有有向强依赖路径”，不反向搜索冒充结果。

Between 内的节点可能还有路径外先修；详情列出这些先修，但不伪称 Between 是完整学习计划。路径跨领域时进入临时全局路径视图，再 Fit Path；退出恢复原领域镜头。

## 4. 图谱、进度、视图分层

|层|持有内容|更新触发|
|---|---|---|
|GraphRepository / Query cache|只读图谱摘要与按节点详情|release 变更|
|ProgressRepository / Query cache|revision、掌握集合与初始化时间|命令成功、重新聚焦拉取|
|GraphCore|邻接索引、状态、路径与进度计数|图或进度改变|
|ViewStore（Zustand）|领域、hover、drawer、弱边开关、镜头、路径模式|用户浏览动作|
|XYFlowAdapter|ViewNode/ViewEdge、位置、样式状态|仅受影响对象改变|
|FeedbackController|有上限的动画/音频队列|收到确认的新增掌握事件|

服务端 mutation 回应是权威状态。快速初始化可展示 pending 预览，失败移除预览；按每用户顺序提交请求，短时间多次点击合并 targetIds，客户端不能堆积无限并发命令。重复响应按 idempotencyKey 不重播。

树和地图使用同一个 progress selector：高中探索度=当前快照高中 U 交集 / 当前快照高中节点数；分母 0 显示“暂无内容”而非 NaN。领域主体统计也排除初中；基础前置区域单列。关键成就数采用同一高中口径，避免混入初中。

地图雾程度是计数的表现函数，不单独存 fogProgress。例如 opacity=0.55×(1-progress)，始终保留名称和轮廓；Landmark 由对应节点 U 决定。数值为初始可调设计参数，不是教育结论。

## 5. 布局与镜头

ELK layered 在 Worker 计算，使用 Strong 主骨架布局，Weak 不改变坐标。默认统一节点尺寸，短数学名可换行；显式 node width/height 输入布局，避免字体加载导致测量抖动。中文/公式字体完成加载后再确认尺寸。

缓存键：releaseId + domainId + layoutVersion + engineOptionsHash + nodeSizeHash。Worker 回传 requestId，域切换或版本变化时丢弃旧任务结果。普通学生 nodesDraggable=false、nodesConnectable=false；可拖画布平移，不能改变知识结构。

自动坐标为基线，再应用 node_layouts.source=manual 的覆盖坐标。人工覆盖后做碰撞和边交叉告警，管理员处理，不能靠重新布局覆盖人工决定。人工移动节点后的连线由 XYFlow 按端点重新计算，不使用已经失效的 ELK 折线路由。变更需要新 layoutVersion。

统一 NavigationController：resolve canonical NodeId → 切换目标领域 → 等待该布局完成 → fly-to/center → 短暂高亮。搜索、Portal、地图 Landmark 使用同一个命令，避免三套不同镜头逻辑。Fit View、MiniMap、Fit Path 为独立镜头操作，不修改掌握记录。

## 6. 搜索

V1 约 400 节点，先用客户端轻量加权索引，不引入 Elasticsearch。索引来自已发布名称、拼音、首字母、英文、口语和符号别名。先精确匹配再前缀/包含，最后模糊匹配；数学正式名优先于成就名。

NFKC、英文小写、合并空白；数学表达保留原串并生成明确的规范化变体，例如 b²-4ac ↔ b^2-4ac，f′(x) ↔ f'(x)，a_n ↔ a_{n}。不全局删除 +、-、下划线或撇号，以免混淆数学概念。拼音多音字以审核后的 namePinyin 为准。图谱版本变更重建索引；空搜索不扫描全部内容。

## 7. 反馈、性能与可访问性

正常解锁可以短暂弹起、边点亮、有限粒子、Toast 与音效；每次仅作用于本次新增集合。快速初始化禁止 Toast 和重粒子，用户目标主反馈、祖先轻量 ripple，单帧批量状态提交。屏外节点不播放粒子，最多同时 3 个反馈序列，积压合并为一条结果。

默认音效偏好为 On，但 AudioContext 必须在首次用户手势后解锁；不保证打开页面就播放。缺少合法资源时用静音/合法占位资源。支持全局静音及 prefers-reduced-motion；关闭动画仍应清楚辨别三种状态，不能仅靠颜色。

节点与边组件 memo，稳定回调，窄 selector；缩放平移不触发全部知识内容 render。详情公式按需渲染；背景按领域懒加载，字体子集与许可并行管理。触屏用点击/菜单替代 Hover，键盘可搜索、定位、打开详情、关闭抽屉并恢复焦点。

Phase 1 必须测量而非承诺：基准桌面 1440×900/当前 Chromium/记录 CPU，400 合成节点约 1000 边，拖拽中位帧率≥50 FPS、输入到可视反馈 p95≤100ms，Worker 布局 p95≤1s；4× CPU 降速时无连续超过 200ms 主线程阻塞。若未达标，先减少可见边/动画、缓存与按领域分段，再讨论渲染引擎替换。
