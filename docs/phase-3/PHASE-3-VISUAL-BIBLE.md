# Minetoast — Phase 3 Visual Bible

状态：`DEPRECATED / NOT FOR PRODUCTION`。本文记录旧 Function Dimension / World Map 方向，**不再是 Phase 3 规范**。现行范围与组件规则见 [Phase 3 UI Visual Bible](./PHASE-3-UI-VISUAL-BIBLE.md)。保留历史内容，不得继续执行文末的 Realm 母图或 4K 流水线。  
更新：2026-09-26  
适用范围：Phase 3 全部视觉资产与界面外观。取代此前的 `Minecraft Advancements × Fantasy RPG × Mathematics × Modern Knowledge UI` 方向。

## 核心公式

**Mathematics determines structure. Minecraft-style block / voxel / pixel language determines appearance. Knowledge progress determines world state.**

第一眼应读为 Minecraft 式方块世界，第二眼读出高中数学，第三眼想探索其知识区域。仅借鉴方块、像素、网格、制作、探索与 Advancement 的视觉语法；所有数学方块、物品、材质、结构、UI、粒子与声音均须原创。不得提取或重新分发 Minecraft 原始纹理、物品 Sprite、UI、字体或音效。

## 全局硬约束

- 统一使用 Block、Voxel、Pixel、Grid、Crafting、Advancement、Exploration；地形、建筑、道路、水、植被、云和雾也由清晰的方块与像素构成。
- 禁止 Fantasy RPG ornate frame、古典城堡或神殿、魔法阵、水晶技能树、写实风景、平滑 3D 地形、现代科技 HUD、玻璃拟态、赛博霓虹、手游金框。长篇数学正文与 KaTeX 公式仍以高可读字体呈现。
- 数学不能只是贴在地表的公式。数轴成为刻度 Block 路；坐标轴成为不同材质的 Block Path；函数成为输入—处理—输出装置；定义域与值域是可辨识的方块区域；函数曲线由离散方块单元构成；零点是图象与 x 轴的交会 Block；对称结构必须真实镜像；二次函数使用 U 形方块结构。
- Knowledge Graph 继续负责精确的 Strong/Weak、前后继、Locked/Available/Unlocked、搜索与路径。Realm 负责空间记忆与探索氛围；视觉不得改写数学依赖。

## Function Dimension 与现有七个 Module

下表右列仅为 Visual Alias；正式数学名称与 Phase 2A Module ID 不变。对称/奇偶属于 `properties`，不凭视觉另造第八模块。

|冻结 Module ID|正式名称|可用视觉语义|
|---|---|---|
|`foundation`|必要前置|Spawn Area / 数轴与基础 Block 路|
|`concepts`|函数概念与要素|Function Gate / 输入—函数—输出工坊|
|`representations`|函数表示|Coordinate Biome / 方块坐标地表|
|`properties`|函数性质|Property Highlands / 单调阶地与镜像结构|
|`types`|基本函数类型|Function Structures / U 形抛物线等|
|`graphs`|作图与图象变换|Graph Workshop / 离散像素曲线|
|`applications`|零点与模型应用|Zero & Model District / 交会 Block 与模型工坊|

## Graph、Node 与状态

- Graph Canvas 应像建立在 Function Dimension 中的 Advancement 环境，而非企业流程图。DAG 布局与依赖保持真实；Strong 优先为 90°/像素阶梯主路径，Weak 默认隐藏且仅用细、虚、低对比方块线。Weak 不暗示解锁。
- Normal、Core、Key 均为方形 Pixel Frame + 同体系 Item Icon；Core 加厚框，Key 用独特方块材质/结构与边框层级，不使用奖杯、魔法遗物或 RPG 徽章。
- Locked：暗灰像素框、去饱和但可辨识图标、无光路。Available：较亮框、轻微像素脉冲和少量方形粒子。Unlocked：完整图标色、清晰像素框、已完成主路径；不得持续闪烁。
- 视觉状态必须由 Color + Light + Frame + Icon + Motion 共同表达，不得仅靠颜色。
- 解锁反馈 500–900ms：Frame press → Icon flash → square particles → 状态改变 → Strong 路径点亮 → 后继唤醒 → Advancement Toast。Toast 使用原创像素图标、方框、硬阴影与简洁文字。

## 图标、面板与雾

- 图标先定义 `MATHCRAFT ITEM SYSTEM`：32×32 原始像素网格、透明底、硬边、不呈现抗锯齿模糊感、统一透视/光源/轮廓/材质。先做 8–12 个代表图标，禁止立即批量制作 32 个。
- Search、Module、Progress、Tooltip、Drawer 外框使用方形像素边、Block Panel、Hard Shadow；长文阅读区域可现代化，但外壳不得脱离世界语言。
- Fog 是可见但低饱和、低细节的未探索 Chunk；解锁后区域恢复材质细节与路径状态。不能把未掌握区域完全隐藏。
- 主色参考自然方块材质：草/苔绿、石灰、深水蓝、泥土棕、砂/桦木米色；稀有青、绿、蓝仅作为等级与状态强调，避免赛博霓虹与奢华金。

## P3A 母图验收与流水线

P3A 母图目标为原生 **3840×2160、16:9**，前景基础 Spawn Zone，中景函数/坐标/图象，后景性质/类型，远景零点/模型 Key 地标。画面必须首先读为方块世界，再读出数学结构；若首先像 Fantasy RPG、魔法世界、技能树或教育 Dashboard，则判定失败。概念图中出现的刻度、交点和对称性仍需数学审校，不能把生成图直接当精确教学图。

后续顺序固定为：P3A 母图 → P3B 详细 Minecraft Math Visual Bible → P3C 8–12 代表图标 → P3D 三等级 × 三状态 Frame Sheet → P3E 32 节点 Sprite Sheet → P3F React Flow 集成 → P3G 动画、粒子、Toast、音频 → 视觉验收。当前只进行 P3A，不提前进入后续阶段、不扩到 350 节点、不修改 Ontology 或生产部署。
