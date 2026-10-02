# Minetoast — Phase 3 UI Visual Bible

状态：`CANONICAL / P3A DESIGN SPEC`  
版本：1.0；日期：2026-09-26  
范围：Phase 2 已冻结的函数知识图谱（32 个 Active Nodes、7 个 Module）的界面视觉系统。本文是**设计规范**；当前实施与验收结果另见 [Phase 3 Final Acceptance](./PHASE-3-FINAL-ACCEPTANCE.md)。

## 1. 产品与边界

**Knowledge Graph is the World. The Advancement Tree is the Product.** 用户在一张可搜索、可定位、可解锁的知识成就树中查看数学关系、学习详情、路径和进度；不存在单独的 World Map、Function Realm/Dimension、地图与图谱切换或领域地貌层。

第一眼读作 Minecraft-style Advancement UI，第二眼识别出节点均为高中数学知识。借鉴的是 Block / Pixel / Square / Inventory / Advancement / Crafting / Progression 的**交互和形态语法**，不是原版游戏资产。严禁复制原始纹理、物品图标、UI 框、字体、音效、角色、Logo 或可识别的特有构件。所有 Math Item、Frame、Panel 与声音必须有项目自己的源文件及来源记录。

禁止 Fantasy RPG、Sci-Fi HUD、玻璃拟态、现代 SaaS Dashboard、手游金框、圆角卡片、世界地图和体素风景背景。数学概念、Strong/Weak 依赖、教材证据、解锁规则及 Detail Content 均沿用 Phase 2，不得由视觉设计推断或改写。

## 2. 版式与设计原语

|原语|P3A 设计基线|约束|
|---|---|---|
|基础网格|4 CSS px 逻辑格；图标原稿采用 32×32 像素网格；边、阴影、内边距优先对齐该格|高密度屏可倍数渲染；避免半像素模糊与非整数缩放图标|
|几何|方形、阶梯形边界；面板使用硬阴影与双层边，圆角半径为 0|不要六边形科技树、圆形徽章、玻璃卡片|
|材质|深石/木/纸质纹理抽象化；纹理只在面板低频出现|不得直接截取或重绘原游戏像素纹理|
|色彩|背景深石色；锁定用中性灰；可解锁用低饱和暖亮；已解锁用明确但克制的绿色/青色；Key 可用少量稀有材质强调|状态同时依靠边框、图标、明度和文字，绝不只依赖色相|
|字体|短标签和数字可用**已获许可**的像素字体；中文 UI、详情正文、辅助说明使用高可读现代字体；公式用 KaTeX|不得复制 Minecraft 字体资产；不得把长篇教材内容像素化|
|图形边缘|Item 图标硬边、统一像素密度、透明背景；面板和连线可以由 CSS 绘制，但须与图标网格对齐|避免发光模糊、拟物渐变、伪像素低清图|
|层级|Canvas < Edge < Node < Hover/Tooltip < HUD/Search < Drawer/Modal < Toast|遮挡时保持键盘焦点、阅读顺序和关闭机制|

此表是 P3A 的系统性约束。具体色值、切片尺寸和素材清单在 P3B/P3C 以可测试 Token 固化，不应把本版方向稿误当已完成的 9 态图片资产。

## 3. Main Canvas 与 Graph 空间

- Graph 是绝对主视觉。背景是低对比暗像素纹理，可有轻微石纹、方块噪声或稀疏网格；不放地貌、建筑、山水、地图标记、独立领域路径或 4K Realm 图。
- 数学 DAG 决定节点和依赖位置；Module 是筛选/导航类别，不是 Biome。Canvas 支持 pan、zoom、fit、搜索飞入、聚焦路径。背景纹理不承担数学坐标或依赖语义。
- 32 个节点同时 Fit View 时要能识别等级、状态和 Strong 主路径；名称可借助 Hover/聚焦标签读取，不得以不可读的小字假装全图可读。设置可用的最小语义缩放，或在低缩放下切换到简化符号密度；最终阈值在集成实测确定。
- 控件与 Mini Map 贴于 Canvas UI 层，绝不烘焙进背景。Canvas 纹理不应与 Strong/Weak 线同亮、同粗或同方向造成误读。

## 4. Node Frame：3 等级 × 3 状态

节点均为可聚焦的方形 Advancement Slot。Normal/Core/Key 表示视觉权重，不修改 Phase 2 的重要度、Key 标记或解锁逻辑。Frame 与 Math Item 分层，图标不会因为 Frame 状态切换而被替换成不相关物品。

|等级|稳定结构|Locked|Available|Unlocked|
|---|---|---|---|---|
|**Normal**|紧凑单层方框，单个数学物品|暗色完整轮廓；可辨图标|内边缘提亮、微弱脉冲|完整图标色，稳定亮边|
|**Core**|加厚外框 + 内衬材质，尺寸/细节略增但不只是放大|双层框均休眠|内层亮、外层克制|双层框稳定激活，允许路径汇聚|
|**Key Achievement**|特殊方形稀有材质框 + 原创像素角饰；远观明显|角饰暗而可见|角饰局部唤醒|完整稀有材质，短暂里程碑反馈后静止|

九态都必须有独立可辨的静帧；Hover、Focus、Selected、Review Required 是**叠加交互标记**，不能伪造第十种数学状态。Locked 仍可打开知识详情，Available 仅指 Strong 前置满足，Unlocked 仅指已掌握；Weak 不参与状态计算。可选框尺寸基线为 Normal 64、Core 72、Key 80 CSS px，P3B 以 32 节点密度、键盘焦点框和不同 DPR 的渲染测试调整，不视为冻结生产尺寸。不可用奖杯、勋章、魔法水晶或金币表达 Key。

## 5. Edge：数学关系优先

- **Strong** 是主要 Advancement Path：正交/阶梯像素线、清楚箭头或端点方向。未完成为较暗的断续/休眠线，完成后为连续明亮线；状态依据真实 source 的掌握情况与现有规则，不依据背景颜色或节点空间距离。交叉、汇聚处须保持来源与目标可辨。
- **Weak** 默认隐藏；用户开启“显示完整知识关系”后以细、点状、低对比线出现，Hover/聚焦时才加强。Weak 永不参与解锁，不能看起来比 Strong 更像主路线。
- 路径高亮仅强调实际图计算所得节点和边；非相关项降亮，但不消失。边状态与节点状态必须可通过 Tooltip/辅助文本解释，不能只靠颜色。尽量移除平滑 Bézier 的默认视觉；布线选择不能改变 DAG 本身。

## 6. MathCraft Item System

32 个 Active Node 最终各有一个统一数学像素物品图标。先在 P3C 用 8–12 个跨 Module、跨抽象层级的代表图标验证，再补完整 32 个。统一 32×32 原稿网格、轮廓厚度、俯视/斜视角、左上或右上固定光源、材质明度阶梯、透明边界、主体占比和小尺寸可识别性。

一个图标只表达一个主概念，最多 1–2 个辅助数学符号；不靠密集公式、文字或随意的 AIGC 画风区分。必须在“32 个同时摆入同一 Inventory”视图中检查统一性与误认率。Icon 的语义名称来自现有 Node，不新造知识点。

## 7. 组件规范

|组件|视觉与内容|行为边界|
|---|---|---|
|Hover Card|紧凑方框像素 Tooltip；只显示 Canonical Math Name、Achievement Name、一句解释、当前状态|不塞定义、例题或整段 Detail；离开/失焦关闭，键盘聚焦也能获取同等信息|
|Tooltip|短说明、状态或控件含义，硬边小面板；与 Hover Card 同材质|不可遮住当前目标或成为唯一的信息渠道|
|Search|Inventory/Command 风格的方形搜索槽；结果是图标 + 名称 + 状态的像素列表|保留中文、拼音、首字母、英文、数学别名、学生别名；点击/回车 Fly-to Node；空结果与待审核范围明确显示|
|Module Tabs|7 个既有 Module 的 Inventory Category Tab，正式中文数学名称优先|只做知识分类/聚焦，不重命名为区域、地貌或第八模块|
|Progress HUD|显示 Function、已解锁/32、百分比及各 Module Progress，使用方形条/刻度|仅按实际 Unlocked Node 计数；不引入 XP、Level、Coins、Stars|
|Mini Map|低噪声像素边框，显示图谱全局位置/视窗|小屏可折叠；不显示世界地图或另一套领域坐标|
|Detail Drawer|外壳为像素面板和硬边，内部是高可读知识文档|保留 Definition、Formula、Concept、Properties、Examples、Gaokao Patterns、Mistakes、Relationships、Textbook Reference；公式继续 KaTeX；证据 `REVIEW_REQUIRED` 不可被美术隐藏|
|Knowledge Path|在当前 Advancement Tree 直接高亮“我怎样学到这里”“学会后能去哪”“A 到 B”；相关项显亮，旁支降亮|沿用现有路径算法和 Strong/Weak 语义；用户可一键退出并恢复全图|
|Buttons|Primary/Secondary/Danger/Disabled 均用方形像素边、按下位移或硬阴影变化|解锁、定位、关闭等动作有文本与焦点反馈；不可仅凭物品图标识别|
|Toggle|像素轨道/方块指示器，开关位置与文字同时表达|“显示 Weak”“声音”保持现有语义，默认状态明确|
|Scrollbar|方形轨道与滑块；读长文时尽量低噪声|支持系统滚动、触控与键盘，不强制隐藏原生可用性|
|Achievement Toast|原创方框 + Math Item Icon +“知识解锁”+ Canonical Name + Achievement Name；Key 稍强|短暂出现后退出；不使用原版游戏音效、Logo、成就文案或金币雨；不得阻塞读屏/交互|
|Modal|方形遮罩面板、明确标题/操作、硬阴影|仅用于需要决定的操作；焦点限制、Esc 关闭、返回焦点|
|Loading|低动效像素进度块或骨架|告知实际加载状态；避免无限闪烁|
|Empty|原生方框说明、下一步操作|搜索无结果、路径不可达、模块暂无内容分别说明原因|
|Error|醒目但不依赖红色的像素警示框|保留错误详情与恢复动作；存储失败不得伪报进度已保存|

## 8. 交互、响应式与可访问性

- Hover、Focus、Selected、Locked、Available、Unlocked、Review Required 必须可独立区分。所有交互有键盘路径与可见 Focus 框；图标提供可读名称；完成/失败与边类型提供文字等价说明。
- 动画用于反馈：按下 → Item 闪烁 → 少量方形粒子 → Frame 状态改变 → Strong 路径点亮 → 后继唤醒 → Toast。普通解锁目标约 500–900ms；Key 可稍强但不全屏表演。支持 `prefers-reduced-motion`，禁止持续闪烁。
- 桌面优先保障全图、搜索、模块与进度并存；窄屏保留可平移/缩放树，不改成地图。Search、Module、Path 工具可折叠，Drawer 可全屏阅读；Mini Map 可隐藏但需有返回全图/定位入口。
- UI 文本和控件须在最终配色上做对比度与缩放实测；可点击目标、焦点顺序、遮挡和中文长名称在 P3D 验收。P3A 不凭设计稿宣称已满足可访问性。

## 9. 与现有实现的差距（待 P3D，不在 P3A 改码）

当前 Phase 2D 界面保留完整功能，但视觉仍有 `210×100` 圆角 Node Card、较平滑的连线、Emoji/文字符号图标、常规搜索框和进度侧栏；这些是 P3D 的迁移目标，**不是 Phase 2 功能缺陷或数据缺陷**。迁移必须保持搜索召回、路径、解锁、证据提示、详情与本地进度行为。任何视觉层改造都不得使 `REVIEW_REQUIRED` 依赖自动变 Strong。

## 10. 新流水线与 P3A 退出条件

`P3A UI Visual Bible → P3B 9 态 Node Frame → P3C MathCraft Icon Bible（先代表图标，再 32 个）→ P3D Full UI Integration → P3E Motion / Particle / Toast / Sound → Phase 3 Final Acceptance`。

P3A 退出需逐项确认：20 类组件规则齐备；3×3 Node Matrix 可由设计和工程独立实施；Strong/Weak 与解锁语义不混淆；Canvas 不依赖地图/4K 背景；Detail 保持数学阅读质量；原创资产与许可路径明确；桌面/窄屏/键盘/低动效有验收用例。本文完成的是**规范编写**，不是视觉资产或运行界面的最终验收。

旧 `PHASE-3-VISUAL-BIBLE.md`、Function Realm 母图和 P3A.1 审计只保留历史记录，统一为 `DEPRECATED / NOT FOR PRODUCTION`。禁止继续制作 World Map、Realm Background、Voxel Landscape、Biome、Landmark、Fog-of-Knowledge Map 或 3840×2160 Production Master。Phase 3 不扩展 350 节点、不修改 Phase 2 Ontology/Dependency/Detail、不做生产部署。
