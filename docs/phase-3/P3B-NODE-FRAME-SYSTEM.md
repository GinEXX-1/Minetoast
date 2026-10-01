# Phase 3B — Knowledge Node Frame System

状态：`P3B HISTORICAL SNAPSHOT`；后续已在 P3D 集成，见 [P3D 验收](./P3D-UI-INTEGRATION-ACCEPTANCE.md)。  
日期：2026-09-27  
上游：[P3A UI Visual Bible](./PHASE-3-UI-VISUAL-BIBLE.md)（已确认）。本文件仅定义 Node Frame，不包含正式 Math Icon、完整 UI 改版、动画或声音。

## 1. 二维模型与来源

`Level × State = 3 × 3 = 9`。Level 来自冻结的节点元数据：已确认 Key Achievement → `key`；否则 `importance >= 4` → `core`；其余 → `normal`。State 来自学习进度算法的 `locked / available / unlocked`，绝不反推 Level。映射函数为 `frameLevelFor(importance, isKeyAchievement)`，每个 Node 独立计算，时间/空间均为 O(1)。当前 32 个 Active Node 分布为 Normal 4、Core 23、Key 5。

|组合|Locked|Available|Unlocked|
|---|---|---|---|
|Normal|`normal_locked`|`normal_available`|`normal_unlocked`|
|Core|`core_locked`|`core_available`|`core_unlocked`|
|Key Achievement|`key_locked`|`key_available`|`key_unlocked`|

预览页故意给每级前三个真实节点依次覆盖三种状态，其余为 Locked。覆盖只存在预览内存中，不读写 `kw:function-world:phase2d-v1`，**不能被理解为真实学生进度**。Phase 2 图谱节点/Strong 边的数据结构和语义均未修改。

## 2. 可复用几何与视觉规则

源文件：[KnowledgeNodeFrame.tsx](../../apps/web/src/KnowledgeNodeFrame.tsx)、[knowledge-node-frame.css](../../apps/web/src/knowledge-node-frame.css)。同一个 DOM/CSS/SVG 结构产生全部九态；不存在九张大 PNG。统一测试占位符是 16×16 整数坐标的原创方块十字/环形符号，显示在全部九格相同的 48×48 安全区；它不是任何正式 Math Item。

|几何|Normal|Core|Key|
|---|---:|---:|---:|
|Outer Bounds|72×72 CSS px|80×80 CSS px|88×88 CSS px|
|黑色外框|4 px|4 px|4 px|
|层级结构|单主边|主边 + 内衬 + 4 个方角|主边 + 双内衬 + 4 个 12 px 特殊方角|
|共同 Icon Safe Area|48×48|48×48|48×48|

外框按 4 px 整数网格构建；三等级通过边框层数、角结构和 8 px 级差区分，**不通过状态改变等级**。状态标记位于框体右侧中央的 16×16 区域，避开连接点和图标安全区；Hover/Selected/Focus 使用框体外轮廓叠加，不增加永久九态资产的组合数。

|State|边框/材质|上沿模式|右侧 Pixel Marker|语义|
|---|---|---|---|---|
|Locked|去饱和、低亮、休眠|4 px 明暗断续|空心方框|前置尚未满足，Icon 仍可辨|
|Available|局部暖亮、较高对比|8 px 分段亮带|两条水平像素|前置已满足，可学习/解锁|
|Unlocked|稳定完整材质|连续亮带|实心带暗芯方块|已掌握，不持续闪烁|

因此灰度下仍可依据边框构造、亮度、上沿模式和 Marker 识别 Level 与 State；彩色仅辅助。Key Locked 保留双内衬和特殊四角，不会退化成 Normal。Icon 本身在九格内容完全一致，避免由内容掩盖 Frame 差异。

## 3. Interaction Overlay 与可访问性

- `:hover`：框外 4 px 点状轮廓；`selected`：框外 4 px 连续轮廓；`:focus-visible`：更外层高对比 4 px 轮廓。三者不改变 `data-level` / `data-state`。
- Graph 中 Frame 是键盘可聚焦按钮，Enter/Space 与点击触发同一选择；`aria-label` 同时包含 Canonical Name、Level、State，`aria-pressed` 表示选择。Matrix 里的静态对照 Frame 为 `role="img"`，不制造无动作的 Tab 停靠点。
- 当前只有静态状态和交互轮廓；Available 呼吸、解锁粒子/声音均留给 P3E。`prefers-reduced-motion` 关闭未来动画入口。本阶段不把 Hover/Selected/Focus 乘入九态资产数。

## 4. 真实 Graph 预览与素材策略

预览路由：`/phase-3b-frames`。使用 Phase 2 的 32 个真实 Node 与 40 条 Strong Edge；只把旧 210×100 卡片替换为 Preview 内的方形 Frame，位置从稳定 DAG fallback 布局**分别按水平/垂直间距压缩**，以便检验 32 节点密度。该紧凑位置仅属于 P3B 预览，不写回图谱布局或现有 `/function-world` 页面。Hover/聚焦读取数学名称；不会把文字塞进缩放后的 48 px 图标区。

静态对照板：[九态彩色 PNG](../../assets/phase-3/node-frames/p3b-9-state-board.png)；[灰度 PNG](../../assets/phase-3/node-frames/p3b-9-state-board-grayscale.png)。实际图谱快照：[100%](../../assets/phase-3/node-frames/p3b-graph-100.png)、[75%](../../assets/phase-3/node-frames/p3b-graph-75.png)、[50%](../../assets/phase-3/node-frames/p3b-graph-50.png)、[Fit View](../../assets/phase-3/node-frames/p3b-graph-fit.png)。这些是浏览器从同一组件生成的审阅截图，不是运行时依赖。

Frame 对节点数的渲染和 DOM 占用均为 O(N)，每个节点只需固定数量的像素元素，无逐状态大图、无 per-node 纹理下载；单个 Frame 的选择/状态切换为 O(1)。这提供 350+ 节点扩展路径，但 **350 节点的布局、浏览器帧率和内存尚未做压力测试**，不能据此宣称性能验收完成。

## 5. 开发与验证

在仓库根目录运行 `pnpm dev:web`，打开 `/phase-3b-frames`。若要重复自动验证：先 `pnpm build`，再执行 `pnpm exec playwright test tests/e2e/phase3b-frames.spec.ts`。该测试生成/更新上述截图，并验证九态、相同占位符、48×48 Safe Area、32 节点、缩放和 Selected/Focus。Phase 2D 回归测试应同时保持通过。

P3B 停止于 Node Frame System。正式 32-node MathCraft Icon、完整 UI Restyle、Motion、Audio、World Map 和 Phase 4 均不在本阶段。
