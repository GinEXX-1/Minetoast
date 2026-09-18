
你现在是本项目的 Principal Product Engineer、Knowledge Graph Architect、

Interaction Engineer 与 Math Education System Engineer。

  

我要你设计并实现一个 Web Application：

  

《高中数学 · Knowledge World》

High School Mathematics Knowledge World

  

它不是传统数学学习网站，不是刷题系统，也不是 AI 教师。

  

它的核心目标是：

  

“以前我不知道自己哪里不会，现在整个知识树一眼就能看到。”

  

==================================================

一、核心产品概念

==================================================

  

把完整高中数学知识体系构造成一个类似 Minecraft Advancements

与 Civilization Technology Tree 的 Knowledge Achievement Graph。

  

每一个数学知识点是 Knowledge Node。

  

知识之间通过 prerequisite 建立有向无环图 DAG。

  

学生通过点击知识节点，将知识标记为已掌握。

  

知识节点拥有三种状态：

  

Locked

Available

Unlocked

  

状态规则：

  

1. Locked：

Strong Prerequisites 尚未全部满足。

  

Hover：

显示基本知识卡。

  

Click：

打开详细知识面板。

  

2. Available：

所有 Strong Prerequisites 已满足。

  

Hover：

显示基本知识卡。

  

Click：

解锁该 Knowledge Achievement。

  

3. Unlocked：

  

Hover：

显示基本知识卡。

  

Click：

打开详细知识面板。

  

未解锁不代表禁止查看知识内容。

  

==================================================

二、知识内容来源

==================================================

  

V1 聚焦中国高中数学。

  

知识来源：

  

1. 人民教育出版社《普通高中教科书·数学》系列；

2. 以人教 A 版作为主要教材位置参考；

3. 结合普通高中数学课程标准；

4. 结合当前高考数学知识体系。

  

最终建立约 350 个高中数学 Knowledge Nodes。

  

另外建立约 30–50 个必要初中前置节点。

  

初中节点标记：

  

tags: ["初中"]

  

stage:

middle_school

  

它们不计入高中数学主体探索度。

  

注意：

  

教材章节顺序 ≠ prerequisite。

  

数学认知依赖优先。

  

==================================================

三、Knowledge Ontology

==================================================

  

每个 Knowledge Node 必须包含：

  

id

中文数学正式名

Achievement Name

英文名

所属 Domain

所属 Module

一句话解释

完整知识内容

Node Type

学习难度

高考重要度

教材位置

核心公式

掌握能力

典型题型

常见错误

拼音

拼音首字母

英文 Alias

学生口语 Alias

数学符号 Alias

图标资源

世界地图 Landmark 信息（适用时）

  

Node Type：

  

normal

core

key_achievement

  

Key Achievement 只有满足以下之一才允许建立：

  

1. 多条知识路径汇聚；

2. 属于高考重要综合能力；

3. 属于领域重大里程碑；

4. 是大量后继知识的重要入口。

  

==================================================

四、Dependency

==================================================

  

Knowledge Edge 分为：

  

strong

weak

  

Strong Dependency：

  

真正参与解锁条件。

  

Weak Dependency：

  

只表示辅助理解关系。

  

默认 UI 只显示 Strong。

  

用户开启：

  

“显示完整知识关系”

  

后显示 Weak。

  

每个 Strong Edge 必须存储 rationale：

  

解释为什么 Source 是 Target 的 prerequisite。

  

普通节点 Strong Prerequisite：

  

0–3 个。

  

极少数综合节点：

  

最多 5 个。

  

必须进行 Transitive Reduction。

  

如果：

  

A → B → C

  

已经完整表达依赖，

  

不得因为 A 与 C 有间接关系就重复创建：

  

A → C

  

知识图谱必须是 DAG。

  

必须提供：

  

Cycle Detection

Duplicate Detection

Transitive Reduction Validation

Orphan Detection

Overconnected Node Detection

  

==================================================

五、Achievement Tree

==================================================

  

主界面是一张巨型知识树。

  

使用 React Flow / XYFlow 或其当前稳定版本。

  

技术栈其它部分由你根据当前最佳工程实践自行选择。

  

必须支持：

  

Pan

Zoom

Mini Map

Fit View

Fly to Node

Domain Navigation

Search Locate

Fit Knowledge Path

  

Knowledge Node 位置不允许普通用户拖动修改。

  

Node Layout：

  

自动 DAG Layout + 人工坐标覆盖。

  

可以采用 Dagre、ELK 或当前更适合的大型 DAG Layout Engine。

  

==================================================

六、节点连线

==================================================

  

Strong Dependency 已满足：

  

━━━ ✅ ━━━>

  

未满足：

  

─── ❌ ───>

  

Weak：

  

┄┄┄┄┄>

  

Weak 默认隐藏。

  

Hover Node 时：

  

只高亮与该 Node 直接相关的 Connections。

  

其它 Graph 降低亮度。

  

==================================================

七、搜索系统

==================================================

  

必须支持：

  

中文

拼音

拼音首字母

英文

学生口语

数学公式

数学符号

  

例如：

  

函数单调性

  

hanshudandiaoxing

  

hsddx

  

monotonicity

  

sin

  

f'(x)

  

b²-4ac

  

a_n

  

求导

  

开口向上

  

搜索结果：

  

Click 后自动：

  

切换到 Domain

Camera Fly-to Node

Node 居中

短暂高亮

  

==================================================

八、Knowledge Path

==================================================

  

实现三个 Path Mode：

  

1. Path To

  

我要怎样学到这里？

  

2. Path From

  

学会这里以后可以去哪？

  

3. Path Between

  

A 到 B 怎么走？

  

进入 Path Mode：

  

非路径节点降低亮度。

  

相关节点和 Edge 高亮。

  

Camera 自动 Fit Path。

  

==================================================

九、Cross Domain Portal

==================================================

  

支持跨 Domain Knowledge Portal。

  

例如：

  

函数 → 导数

  

向量 → 立体几何

  

点击 Portal：

  

切换 Domain，

Fly-to 对应目标 Knowledge Node。

  

==================================================

十、Quick Initialization

==================================================

  

第一次正式使用时进入：

  

“建立我的数学世界”

  

用户快速点击自己已经掌握的知识。

  

在 Initialization Mode 中：

  

如果点击 Node X，

  

递归获取 X 的所有 Strong Prerequisite Ancestors。

  

自动将：

  

Ancestors + X

  

全部解锁。

  

禁止自动解锁：

  

Weak Dependency

Sibling Branch

无关节点

  

初始化阶段：

  

禁止每个节点弹 Achievement Toast。

  

禁止高开销粒子。

  

批量状态更新。

  

祖先节点采用轻量 Ripple Unlock。

  

用户主动点击的目标 Node 可以获得主要反馈。

  

完成后：

  

“生成我的数学知识地图”

  

退出特殊模式。

  

==================================================

十一、回退

==================================================

  

用户可以把某个 Unlocked Node 标记为：

  

“未掌握”

  

但不进行级联锁定。

  

已解锁的后继节点保持原状态。

  

==================================================

十二、数学探索度

==================================================

  

显示：

  

高中数学探索度 %

  

Unlocked / Total

  

关键成就数量

  

各 Domain 探索度

  

初中前置节点不计入高中主体探索度。

  

禁止：

  

XP

Level

  

==================================================

十三、World Map

==================================================

  

另一个主界面：

  

Math Knowledge World Map。

  

视觉：

  

Pixel Fantasy Math World。

  

不是 Minecraft 世界地图直接复制。

  

地图技术：

  

AIGC large background map

+

HTML/SVG Interactive Hotspots

+

Pan / Zoom

  

地图主要表现：

  

Level 1 Domain

Level 2 Knowledge Region

Key Achievement Landmark

  

不要把全部 350 Node 直接展示在地图上。

  

Hover Region：

  

显示基本介绍。

  

Click Region：

  

Zoom In。

  

然后允许：

  

进入该领域 Achievement Tree。

  

==================================================

十四、Fog of Knowledge

==================================================

  

地图存在半透明探索迷雾。

  

未探索：

  

仍能看见基本地貌和名称。

  

但：

  

低亮度

雾化

  

随着 Domain Progress 增长：

  

Fog 减少

Region 变亮

道路出现

Landmark 点亮

  

World Map 与 Achievement Progress 实时同步。

  

==================================================

十五、视觉语言

==================================================

  

整体设计：

  

Minecraft Advancements

×

Modern UI

×

Original Math Pixel Fantasy World

  

主界面明显具有 Minecraft Achievement Tree 感。

  

详细知识内容、搜索和管理页面采用更现代的信息设计。

  

主要字体：

  

Mojangles

GNU Unifont

  

数学公式使用标准数学公式字体。

  

如果开发环境没有用户合法提供的 Minecraft 字体或音效资源：

  

不要从非授权资源站抓取。

  

使用合法替代/Placeholder。

  

==================================================

十六、数学公式

==================================================

  

所有数学公式必须使用：

  

LaTeX + KaTeX

或当前等价专业数学引擎。

  

禁止复杂公式使用普通文本模拟。

  

==================================================

十七、Math Pixel Icon System

==================================================

  

创建统一：

  

Math Pixel Icon Bible。

  

每个 Domain 有独立视觉生态。

  

例如：

  

集合：

分类、容器、符号

  

函数：

坐标、曲线、输入输出结构

  

三角：

单位圆、罗盘、波纹

  

向量：

箭头、航向

  

几何：

晶体、建筑、多面体

  

概率：

骰子、随机宝箱

  

数列：

阶梯、序列

  

导数：

山坡、切线、速度

  

图标原则：

  

数学概念 + 游戏视觉隐喻。

  

==================================================

十八、AIGC Asset Strategy

==================================================

  

不要逐个生成 350 张图标。

  

设计 Sprite Sheet Workflow。

  

例如：

  

5 × 5

= 25 icons per sheet

  

一个 Domain 可以生成若干 Sprite Sheets。

  

然后程序裁切为独立 WebP/PNG。

  

关键成就允许单独精修。

  

每个 Domain 可以拥有独立 AIGC Background。

  

必须低视觉干扰。

  

==================================================

十九、Node Visual State

==================================================

  

Locked：

  

低饱和

深灰

暗边框

  

Available：

  

正常颜色

轻微呼吸边框

  

Unlocked：

  

完整色彩

明亮边框

连接线点亮

  

normal / core / key_achievement

必须有不同视觉等级。

  

==================================================

二十、Unlock Animation

==================================================

  

Normal Unlock 可以包含：

  

Node Bounce

Pixel Particle

Icon Gray-to-Color

Border Light

Edge Energy Flow

Next Nodes Wake Up

Achievement Toast

Sound

  

Quick Initialization：

  

禁用 Toast。

  

减少 Particle。

  

Batch Unlock。

  

保证性能。

  

==================================================

二十一、Audio

==================================================

  

默认 Audio On。

  

提供全局：

  

Sound On / Off。

  

可以预留 Minecraft 风格音效接口。

  

如果没有合法授权音效：

  

使用 Placeholder。

  

==================================================

二十二、Knowledge Detail Panel

==================================================

  

Click Locked 或 Unlocked Node：

  

右侧滑出大型 Detail Drawer。

  

不跳转页面。

  

视觉：

  

现代 Math Adventure Handbook。

  

内容达到接近教材级。

  

至少包含：

  

知识定义

概念解释

核心公式

数学意义

性质

定理

理解过程

典型使用方式

能力要求

高考常见题型

易错点

教材位置

高考重要度

学习难度

相关数学符号

英文名称

  

==================================================

二十三、Account

==================================================

  

V1：

  

Username + Password。

  

一个账号对应一个用户。

  

使用 PostgreSQL。

  

Knowledge Graph 采用普通关系表建模。

  

不要引入 Neo4j。

  

主要表：

  

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

  

==================================================

二十四、Guest

==================================================

  

游客可以：

  

浏览

搜索

看知识内容

查看 Dependency

查看 Path

浏览 World Map

  

但是：

  

Unlock

Progress

Initialization

  

需要登录。

  

==================================================

二十五、Progress Backup

==================================================

  

支持：

  

Export JSON

Import JSON

  

==================================================

二十六、Admin

==================================================

  

建立简单：

  

/admin/knowledge

  

支持：

  

Node CRUD

Knowledge Content

Achievement Name

Importance

Difficulty

Alias

Strong / Weak Edge

Icon

Layout

Map Position

Graph Validation

  

不需要复杂 CMS。

  

预留未来：

  

AI Regenerate Content

AI Improve Achievement Name

  

的 API 接口。

  

V1 不需要实现 AI Content Generation。

  

==================================================

二十七、开发原则

==================================================

  

禁止一次性完成全部 350 Knowledge Nodes。

  

先完成系统架构。

  

然后用一个高价值 Domain 做 Vertical Slice。

  

建议首个 Domain：

  

函数。

  

首先验证：

  

Graph

Unlock

Search

Detail

Path

Map Link

Persistence

Animation

Performance

  

全部通过后再扩展。

  

==================================================

二十八、质量原则

==================================================

  

知识准确性优先于游戏效果。

  

游戏效果优先于普通 Dashboard 感。

  

性能优先于无意义动画堆叠。

  

知识图谱科学性优先于教材章节顺序。

  

可维护性优先于一次性 Demo。

  

==================================================

二十九、工作方式

==================================================

  

请不要一次性生成整个项目然后宣布完成。

  

先：

  

1. 分析需求；

2. 建立 Architecture Decision；

3. 给出目录结构；

4. 建立数据库 Schema；

5. 建立 Knowledge Graph Domain Model；

6. 建立 UI Shell；

7. 完成一个 Domain Vertical Slice；

8. 测试；

9. 汇报问题；

10. 再进入下一阶段。

  

任何不确定数学 Dependency：

  

标记为：

  

REVIEW_REQUIRED

  

而不是自行猜测。

  

整个项目必须做到：

  

可运行

可测试

可维护

可扩展

可继续由 Codex 长期迭代。