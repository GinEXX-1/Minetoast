# Phase 3C — MathCraft Item Bible

状态：`32_ICON_CANDIDATE_SET / CONDITIONAL_PASS`  
日期：2026-10-01。上游为 [P3A UI Visual Bible](./PHASE-3-UI-VISUAL-BIBLE.md) 与 [P3B Node Frame](./P3B-NODE-FRAME-SYSTEM.md)。本阶段只生产函数切片现有 32 个 Active Node 的数学图标，不修改 Node、Dependency 或教材内容。

## 图标语法

- 原稿为**透明 32×32 SVG**，所有矩形使用整数坐标，主要笔画为 2–4 个逻辑像素；显示时由 P3B 的 48×48 Icon Safe Area 等比缩放并保持 `crispEdges`/`pixelated`。
- 固定正面视角、左上亮面。统一三层材质：石灰基色 `#b7c8b7`、青绿数学强调 `#76c3af`、少量暖米高光 `#e6d8a5`。不因 Node Level 变更图标物品的材质；Locked/Available/Unlocked 由外部 Frame 管理。
- 一个图标只表达一个主概念；不内嵌中文、英文、密集公式、游戏物品、原版 Inventory Sprite 或外部纹理。概念由**几何关系**表达：位置、输入/输出、区间端点、镜像、交点、分割或表格。
- 图标是辅助识别，不是数学证明或教材图。函数图像类图标只示意概念，不能被教学正文当作精确坐标数据引用；正式名称始终可通过节点/搜索/详情读取。

## 语义映射

|Module|Node / 图标主形|
|---|---|
|基础|数轴：刻度线与原点；平面直角坐标系：双轴与一点；集合的概念：边界与成员点；不等式的性质：不等长量柱与比较阶梯|
|函数概念与要素|区间表示：带端点的数轴段；对应关系：两集合间配对通路；函数的概念：输入—规则—输出；定义域：左侧输入域；值域：右侧输出域；求函数值：单输入到高亮输出；同一函数的判定：双规则并列一致|
|表示与基本能力|解析表示：规则面板；列表表示：行列格；函数图像：坐标轴上升点列；分段函数表示：有断点的两段点列；分段求值：点列中的单个取值点；表示法转换：表格向图像转换|
|函数性质|单调性：上升阶梯；定义证明单调性：两取样点及上升阶梯；单调区间：高亮区间段与上升；最大/最小值：峰值；奇偶性：两侧镜像曲线；图像对称性：轴两侧成对方块|
|典型函数|一次函数：直线点列；二次函数：U 形点列；反比例函数：两支点列；幂函数：加速上升点列|
|作图与应用|描点作图：离散取样点；函数零点：曲线与 x 轴交点；零点存在：两端异号的交叉趋势；二分法：区间中点反复分割；模型简单应用：变量框内的趋势图|

有意保留同一家族的视觉共性，例如“图像—分段—描点”共享坐标轴语法；差异由断点、单点高亮和取样点表达。小尺寸下相近概念仍可能被误认，因此正式 UI 必须同时提供中文名称、Hover Card 和键盘可读标签，不能只靠图标做测验。

## 源文件、导出与验证

- 可维护源：[MathCraftIcon.tsx](../../apps/web/src/MathCraftIcon.tsx)，32 个 `node_id → Pixel Rect` 设计共享一套渲染器。图标在九态 Frame 里的接入点为 `icon` prop；P3B 的统一占位符仍保留给 Frame 回归测试。
- 执行 `pnpm assets:mathcraft`，生成 [32 个独立 SVG 与 manifest](../../assets/phase-3/mathcraft/icons/manifest.json)。清单记录 Node ID、名称、32×32 ViewBox 与 SHA-256；不依赖 `imagegen` 生成不可复现的位图。源代码、导出脚本和清单构成资产来源记录。
- 视觉证据：[12 个代表图标](../../assets/phase-3/mathcraft/p3c-representative-board.png)、[32 图标 Inventory](../../assets/phase-3/mathcraft/p3c-32-item-inventory.png)、[同一图标三状态](../../assets/phase-3/mathcraft/p3c-state-sample.png)。预览路由为 `/phase-3c-icons`。
- 浏览器测试校验 12 个代表图标、32 个 Node ID、32 个不同 SVG 内容、整数坐标与实际页面渲染。清单哈希测试校验导出文件完整性。复杂度：单图标固定数量矩形，渲染 O(1)；全图谱 O(N)。当前未做 350+ 节点帧率实测。

## 禁止与边界

不使用 Minecraft 原始纹理、物品、Advancement Frame、字体、UI、声音；不生成 32 种独立 AIGC 风格，不制作 World Map/Realm 背景，不改 Phase 2 数学语义。本文是图标系统规范及候选资产记录，P3D 集成后的窄屏、色觉与辅助技术验证仍需单独完成。
