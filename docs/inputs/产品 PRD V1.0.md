
**产品愿景**

将人民教育出版社高中数学知识体系及高考核心数学知识重构为一个：

**可视化、可探索、可解锁、可追踪依赖关系的数学知识世界。**

核心并不是让学生在这里刷题，而是解决一个更基础的问题：

**“以前我不知道自己哪里不会，现在整个知识树一眼就能看到。”**

产品使用 Minecraft Advancements、《文明》科技树和幻想 RPG 世界地图作为交互隐喻，但数学知识本身必须保持科学、准确和严谨。

产品 V1 聚焦高中数学，但底层架构应支持未来扩展：

初中数学 → 高中数学 → 高等数学  
以及物理、化学等其他学科。

  

**2. 核心产品原则**

整个产品遵循五条原则。

**2.1 数学不是目录，而是知识图谱**

不简单按照教材：

第一章 → 第二章 → 第三章

线性展开。

而是建立：

Knowledge Node  
↓  
Prerequisite  
↓  
Dependency Graph

教材决定**有哪些内容**。

数学逻辑决定**知识怎样连接**。

高考体系决定**什么更重要**。

  

**2.2 未解锁 ≠ 禁止学习**

“锁”只表达：

当前知识依赖链尚未打通。

绝不能表达：

你没有资格看这个知识。

所以所有知识始终可查看。

  

**2.3 游戏化服务于认知，而不是代替认知**

不建立：

XP  
人物等级  
虚假积分经济

核心反馈始终围绕：

探索度  
知识节点  
依赖关系  
关键成就  
数学疆域

  

**2.4 视觉上像游戏，内容上必须像数学教材**

UI 可以有：

Minecraft 成就树、像素艺术、粒子、音效、世界地图。

但公式、定义、定理和知识解释必须保持标准数学表达。

  

**2.5 V1 内容完整，但工程分阶段完成**

目标最终约：

**350 个高中数学知识节点**

但禁止一次性让 AI 同时生成：

350 节点 + 全量内容 + UI + 世界地图 + 动画 + 图标

必须采用：

**架构完整 → 单领域跑通 → 批量扩张 → 全量校验**

的开发方式。

  

**3. 产品双核心界面**

产品存在两个相互映射但承担不同认知任务的核心界面。

**3.1 Achievement Tree｜数学成就树**

解决：

**知识之间到底有什么关系？**

核心形态：

知识 A ───────┐

              │

知识 B ───────┼──→ 知识 D ──→ 知识 E

              │

知识 C ───────┘

这是整个产品最主要的工作界面。

  

**3.2 Knowledge World Map｜数学世界地图**

解决：

**整个高中数学世界到底有多大？**

地图不展示全部 350 个知识点。

主要展示：

一级知识领域  
二级知识区域  
Landmark 关键成就

例如：

数学世界

│

├─ 函数山脉

│  ├─ 函数概念谷地

│  ├─ 基本初等函数森林

│  └─ 导数之巅 ◆

│

├─ 几何王国

│  ├─ 平面几何区域

│  ├─ 空间几何区域

│  └─ 空间向量圣殿 ◆

│

└─ 概率群岛

世界地图与成就树共享完全相同的底层 Knowledge Graph 和 Progress。

  

**4. 知识体系来源**

V1 内容来源采用：

**主体**

人民教育出版社《普通高中教科书·数学》系列。

以**人教 A 版教材体系作为主要教材定位参考**。

同时结合：

普通高中数学课程标准  
当前高考数学知识体系  
高考常见考查结构

构建知识 Ontology。

但：

**教材顺序不得直接等同于 prerequisite。**

  

**5. 初中数学前置世界**

额外加入少量真正影响高中学习的初中数学核心知识。

独立形成：

**基础前置区域**

每个节点增加：

tags:

- 初中

它们：

不属于高中数学主体成就统计；

但可以作为高中节点的 prerequisite。

例如：

实数运算

因式分解

一元二次方程

平面直角坐标系

一次函数

二次函数基础

预计约：

30–50 个节点。

不建立完整初中数学体系。

  

**6. Knowledge Node 定义**

正式知识节点预计：

**约 350 个高中数学节点**

颗粒度达到：

**高考考点级。**

不是：

“三角函数”

而是：

任意角

弧度制

任意角三角函数

单位圆

同角三角函数基本关系

诱导公式

正弦函数图像

余弦函数图像

三角函数周期性

三角函数单调性

三角函数最值

三角函数图像变换

两角和与差公式

二倍角公式

辅助角公式

三角恒等变换

正弦定理

余弦定理

解三角形

……

  

**7. 双名称体系**

每个 Knowledge Node 拥有两个名称。

例如：

**数学名称**

**函数的单调性**

**Achievement Name**

**变化的方向**

UI 中以数学名为主体，成就名作为辅助游戏化文案。

例如：

**函数的单调性**  
变化的方向

不得为了游戏感修改正式数学名称。

  

**8. 节点等级**

只有三类：

**Normal Knowledge**

普通知识。

**Core Knowledge**

核心知识。

**Key Achievement**

关键成就。

Key Achievement 必须至少满足以下一种条件：

多条知识链汇聚；

属于高考核心综合能力；

属于一个数学领域的重要里程碑；

是大量后继知识的重要入口。

不得为了装饰随意设置 Boss 节点。

  

**9. Knowledge Dependency**

依赖关系分为：

**Strong Dependency**

真正决定解锁的强依赖。

例如：

导数运算法则

      ↓

利用导数研究函数

  

**Weak Dependency**

有助于理解，但不是必须 prerequisites。

Weak Dependency：

数据层保存；

正常 UI 默认隐藏；

用户开启：

「显示完整知识关系」

后才显示。

  

**10. Prerequisite 规则**

只有满足：

**如果不会 A，会显著阻碍学生理解、运算或应用 B**

才允许：

A → B

禁止：

因为教材先讲 A，所以 A → B。

  

**10.1 强前置数量**

普通节点：

0–3 个直接强前置。

极少数综合节点：

最多 5 个。

  

**10.2 Transitive Reduction**

必须进行传递约简。

如果已经存在：

A → B → C

而 A 对 C 没有额外独立直接依赖意义，则禁止再创建：

A → C

避免整张图形成蜘蛛网。

  

**11. 节点状态机**

所有节点只有三种主要状态。

**Locked**

🔒 未解锁

Strong Prerequisites 尚未全部满足。

  

**Available**

◇ 可解锁

所有 Strong Prerequisites 已经满足。

  

**Unlocked**

◆ 已解锁

用户主动标记已经掌握。

  

**12. 节点交互规则**

|   |   |   |
|---|---|---|
|**状态**|**Hover**|**Click**|
|未解锁|查看基本内容|查看详细内容|
|可解锁|查看基本内容|解锁|
|已解锁|查看基本内容|查看详细内容|

**13. Hover Card**

悬停只展示：

数学名称  
Achievement Name  
一句话知识解释

保持非常轻量。

不重复展示前置知识，因为：

prerequisite 已经通过图上的连线表达。

  

**14. Detail Knowledge Panel**

点击查看详细内容时，从右侧滑出大型知识面板。

不是跳转页面。

内容达到：

**接近教材级知识讲解**

至少包括：

正式数学名称

Achievement Name

  

知识定义

核心概念

数学意义

核心公式

定理/性质

图形解释（适用时）

推导或理解过程

需要掌握的能力

典型使用场景

高考常见题型

常见易错点

与其他知识的关系

教材位置

高考重要度

学习难度

数学符号

英文名称

数学内容必须可靠，不得用游戏隐喻替代定义。

  

**15. 高考属性**

详细页加入两个独立指标。

**高考重要度**

★★★★★

含义：

★       边缘/了解

★★      基础

★★★     常见

★★★★    重要

★★★★★   核心高频

  

**学习难度**

★★★★★

禁止使用诸如：

“高考出现概率 87.6%”

这种没有真实统计支持的伪精确数据。

  

**16. Knowledge Edge UI**

Strong Dependency 默认显示。

已满足：

━━━━━━ ✅ ━━━━━━>

未满足：

────── ❌ ──────>

Weak Dependency：

┄┄┄┄┄┄┄>

默认隐藏。

Hover 某个节点时：

当前相关节点和连接线高亮；

其余网络降低亮度。

  

**17. 快速初始化模式**

第一次正式使用账户时进入：

**建立我的数学世界**

此阶段用户快速标记自己已经掌握的知识。

特殊规则：

点击某个具有 prerequisite 的知识节点后，所有 Strong Prerequisite 祖先节点自动递归解锁。

例如：

A → B → C → D

初始化时直接点击：

D

自动解锁：

A

B

C

D

但：

Weak Dependency 不自动解锁；

旁支知识不自动解锁。

完成以后：

**生成我的数学知识地图**

然后恢复正常三状态机制。

  

**18. 回退机制**

用户发现：

“这个其实我不会。”

可以将已解锁节点重新标记为未掌握。

但采用：

**非级联回退**

即：

该节点自己回退；

已经解锁的后继节点保持现状。

避免半张知识图因为一个节点调整而熄灭。

  

**19. 数学探索度**

全局始终显示：

高中数学探索度 41.7%

  

146 / 350 Knowledge Achievements

  

关键成就

7 / 24

以及领域探索度：

函数          72%

几何          48%

概率统计      17%

……

不加入：

XP  
Level

  

**20. Knowledge Path**

提供三个模式。

**Path To**

**我要怎样学到这里？**

显示所有必要 prerequisite 路径。

  

**Path From**

**掌握这里以后可以去哪？**

显示后继知识路径。

  

**Path Between**

**A 到 B 怎么走？**

计算两个 Knowledge Node 之间的有效知识路径。

激活 Path Mode 后：

非相关节点降低亮度；

相关知识链高亮；

Camera 自动 Fit Path。

  

**21. Cross-Domain Portal**

允许知识领域之间建立：

**跨领域连接节点 / Portal**

例如：

函数

  ↓

导数

或者：

向量

  ↓

立体几何

点击 Portal：

自动切换对应 Domain Tab；

Camera 飞到目标 Knowledge Node。

  

**22. Search Engine**

搜索必须成为核心功能。

至少支持：

**中文搜索**

函数单调性

**拼音搜索**

hanshudandiaoxing

**拼音首字母**

hsddx

**英文搜索**

monotonicity

**数学符号搜索**

sin

f'(x)

a_n

b²-4ac

**学生日常表达**

抛物线

开口向上

求导

奇函数

排列组合

大小比较

搜索结果点击后：

自动切换 Domain；

Camera Fly-to；

节点居中；

短暂高亮。

  

**23. Search Alias Schema**

每个节点必须建立：

name_zh

achievement_name

name_en

pinyin

pinyin_initials

aliases

student_aliases

math_notation_aliases

  

**24. Achievement Canvas**

成就树使用大型无限画布体验。

支持：

Drag → Pan

Wheel → Zoom

Fit View

Center View

Mini Map

Domain Navigation

Fly-to Node

Fit Path

Search Locate

禁止普通学生：

随意拖动改变知识结构。

节点位置只读。

  

**25. Domain Tabs**

宽屏：

[图标 函数]

[图标 几何]

[图标 三角]

……

窄屏：

仅显示图标。

右侧始终保留：

世界地图入口。

  

**26. World Map**

采用：

**Pixel Fantasy Math World**

而不是 Minecraft 地图的直接复刻。

架构：

AIGC 超大地图底图

+

HTML/SVG Interactive Hotspots

+

Pan / Zoom

  

**27. Map 层级**

主要展示：

**Level 1**

数学领域。

**Level 2**

知识区域。

**Landmark**

关键成就。

普通 350 节点不直接铺在地图上。

  

**28. Map Interaction**

Hover 区域：

显示基本介绍。

Click：

先 Zoom In 到领域内部；

显示区域详情；

可选择：

进入知识树。

关键 Landmark：

直接链接 Knowledge Node。

  

**29. Map Fog**

采用：

半透明探索迷雾。

未探索：

地貌仍可看见；

但低亮度 + 雾化。

部分探索：

迷雾逐步消散。

高度探索：

完整地貌、道路、Landmark 逐渐点亮。

  

**30. Map 与 Achievement Tree 联动**

实时同步。

例如：

函数成就树：

21 / 35

世界地图的函数区域同步显示：

探索度 60%

随着解锁：

迷雾减少；

视觉变亮；

关键 Landmark 点亮。

  

**31. Visual Direction**

整体采用：

**Minecraft Advancements × Modern UI × Original Math Pixel World**

主成就树明显具有 Minecraft 式体验。

但：

搜索；

详细数学内容；

管理系统；

账户界面；

采用更现代的信息设计。

  

**32. Font System**

主要界面：

Mojangles  
GNU Unifont

数学公式：

标准数学公式字体。

必须保证中文和复杂数学表达具有足够可读性。

如果开发环境不存在合法可用的 Mojangles 字体文件：

不得从非授权网站抓取字体。

应使用用户提供的合法字体资源或兼容替代方案。

  

**33. Formula Rendering**

所有数学公式必须采用：

LaTeX + KaTeX / 等价专业数学渲染引擎。

禁止把复杂数学表达作为普通纯文本排版。

  

**34. Pixel Icon System**

采用：

**Math Pixel Icon Bible**

每个数学领域建立独立视觉语言。

例如：

|   |   |
|---|---|
|**领域**|**主要视觉隐喻**|
|集合逻辑|容器、分类、门、符号|
|代数|方块、矿石、运算机械|
|函数|坐标、曲线、输入输出|
|三角|单位圆、罗盘、波纹|
|数列|阶梯、序列、无限延伸|
|向量|箭头、方向、航线|
|几何|建筑、晶体、多面体|
|概率|骰子、卡牌、随机宝箱|
|导数|山坡、切线、速度|

图标设计原则：

**数学概念 + 游戏隐喻融合**

  

**35. AIGC Sprite Sheet**

禁止逐个生成 350 张图片。

按 Domain 批量生成。

例如：

function-sprite-01

5×5

25 icons

随后通过程序化裁切：

25 → individual WebP/PNG

优点：

节省生成成本  
提高风格一致性  
减少 Token / Generation 次数

关键成就可以单独精修。

  

**36. Background Art**

每个领域拥有独立 AIGC 背景。

例如：

函数：

像素山脉、坐标网格、曲线河流。

几何：

晶体、建筑、多面体世界。

概率：

群岛、骰子、随机迷雾。

必须遵守：

**低视觉干扰原则**

背景不得影响节点和连接线阅读。

  

**37. Node Visual State**

**Locked**

灰暗；

低饱和；

暗边框。

**Available**

恢复图标色彩；

边框呼吸；

轻微光效。

**Unlocked**

完整色彩；

明亮边框；

连接线点亮。

  

**38. Achievement Grade Visual**

Normal：

基础边框。

Core：

更明显高级框。

Key Achievement：

独立特殊框 + 轻粒子 / 动态效果。

  

**39. Unlock Feedback Engine**

标准单节点解锁允许：

1. 节点弹起
2. 像素粒子
3. 图标灰 → 彩色
4. 边框点亮
5. 连线能量流
6. 后继节点苏醒
7. Achievement Toast
8. Unlock Sound

例如：

**成就达成！**  
函数的单调性  
变化自有方向

  

**40. Performance Adaptive Animation**

动画必须区分场景。

**Normal Unlock**

完整效果。

**Rapid Initialization**

禁止 Toast；

禁止重粒子爆发；

减少动画时间；

允许轻量声音；

使用批处理状态更新。

**Batch Auto-Unlock**

如果一次递归解锁大量 prerequisite：

不得对每个节点完整播放动画。

只对用户主动点击目标节点播放主反馈；

其祖先节点采用快速 ripple 点亮。

  

**41. Audio**

默认：

开启。

顶部提供：

🔊 / 🔇

如果开发者没有合法授权的 Minecraft 原版音效资源：

不得自动抓取或打包未经许可的音频。

开发阶段可以使用：

placeholder sound。

如果用户提供合法音频资源，再进行替换。

  

**42. Account**

V1：

简单用户名 + 密码。

一个账号对应一个用户。

进度：

云端持久化。

  

**43. Guest Mode**

游客允许：

浏览知识世界  
查看全部知识  
搜索  
查看路径  
查看依赖关系

但：

解锁  
保存进度  
初始化个人数学世界

需要账户。

  

**44. Progress Backup**

支持：

Export Progress JSON

Import Progress JSON

V1 暂不需要 PDF 成绩报告。

  

**45. Admin Console**

V1 创建简易：

/admin/knowledge

支持：

查看节点  
修改内容  
修改 Achievement Name  
修改重要度  
修改难度  
修改 Alias  
修改 Strong/Weak Edge  
更换图标  
调整地图位置  
调整节点 Layout  
Graph Validation

不需要做复杂 CMS。

  

**46. AI Content Editing**

V1：

只预留接口。

不需要直接实现：

AI 重新生成知识内容  
AI 自动改名

但数据结构和 API 应允许未来接入。

  

**二、核心数据 Schema**

下面这部分可以直接交给 Codex 作为数据库建模依据。

**KnowledgeNode**

interface KnowledgeNode {

  id: string;

  

  nameZh: string;

  achievementName: string;

  

  nameEn?: string;

  

  descriptionShort: string;

  contentDetailed: string;

  

  domainId: string;

  moduleId: string;

  

  stage: "middle_school" | "high_school";

  

  tags: string[];

  

  nodeType:

    | "normal"

    | "core"

    | "key_achievement";

  

  difficulty: 1 | 2 | 3 | 4 | 5;

  

  gaokaoImportance: 1 | 2 | 3 | 4 | 5;

  

  textbookReferences: TextbookReference[];

  

  formulas: MathFormula[];

  

  skillsRequired: string[];

  

  commonQuestionTypes: string[];

  

  commonMistakes: string[];

  

  namePinyin: string;

  

  pinyinInitials: string;

  

  aliases: string[];

  

  studentAliases: string[];

  

  mathNotationAliases: string[];

  

  iconAsset?: string;

  

  backgroundTheme?: string;

  

  worldLandmark?: boolean;

  

  createdAt: string;

  

  updatedAt: string;

}

  

**KnowledgeEdge**

interface KnowledgeEdge {

  id: string;

  

  sourceNodeId: string;

  

  targetNodeId: string;

  

  dependencyType:

    | "strong"

    | "weak";

  

  rationale: string;

  

  enabled: boolean;

}

rationale 非常重要。

AI 创建任何 prerequisite 时必须解释：

为什么 A 是 B 的前置知识。

这是后续人工审核的重要依据。

  

**Domain**

interface MathDomain {

  id: string;

  

  nameZh: string;

  

  nameEn: string;

  

  achievementThemeName?: string;

  

  description: string;

  

  iconAsset?: string;

  

  backgroundAsset?: string;

  

  mapRegionId?: string;

  

  displayOrder: number;

}

  

**Module**

interface MathModule {

  id: string;

  

  domainId: string;

  

  nameZh: string;

  

  nameEn?: string;

  

  description: string;

}

  

**User**

interface User {

  id: string;

  

  username: string;

  

  passwordHash: string;

  

  createdAt: string;

  

  lastLoginAt?: string;

}

  

**UserProgress**

interface UserProgress {

  userId: string;

  

  nodeId: string;

  

  status:

    | "locked"

    | "available"

    | "unlocked";

  

  manuallyUnlocked: boolean;

  

  initializationUnlocked: boolean;

  

  unlockedAt?: string;

  

  updatedAt: string;

}

实际上 locked / available 最好由图谱实时计算。

数据库原则上重点存：

unlocked=true/false

避免状态冗余出现数据不一致。

  

**47. Node ID Standard**

高中：

HS-FUNC-CONCEPT-001

HS-FUNC-MONO-002

HS-DERIV-LIMIT-001

HS-GEO-VECTOR-004

初中：

MS-ALG-QUAD-001

MS-NUM-REAL-002

原则：

永久 ID 不因中文名称调整而变化。

  

**48. PostgreSQL 推荐表结构**

至少包含：

users

  

math_domains

  

math_modules

  

knowledge_nodes

  

knowledge_edges

  

user_unlocked_nodes

  

achievement_events

  

map_regions

  

map_landmarks

  

node_layouts

  

assets

不使用 Neo4j。

知识图谱关系采用：

PostgreSQL 标准关系表。

  

**三、知识图谱质量控制规则**

这一部分必须直接写进 AI Prompt，否则整个系统最容易在这里失败。

**DAG Validation**

Knowledge Graph 必须：

无循环。

不得出现：

A → B

B → C

C → A

  

**Duplicate Node Validation**

禁止：

同一个数学知识由于教材不同章节描述被重复建立节点。

  

**Dependency Validation**

每一条 Strong Edge 都必须回答：

如果学生不会 source，是否真的会显著阻碍 target？

答案不是明确 Yes：

降级为 Weak 或删除。

  

**Transitive Reduction Validation**

自动寻找：

A → B

B → C

A → C

并判断：

A → C

是否冗余。

  

**Orphan Validation**

检测：

不合理的孤岛节点。

允许真正的 Root。

但非 Root 知识应检查是否缺少 prerequisite。

  

**Overconnected Validation**

普通节点：

强前置 > 3

自动进入人工审核。

综合节点：

5

禁止通过。