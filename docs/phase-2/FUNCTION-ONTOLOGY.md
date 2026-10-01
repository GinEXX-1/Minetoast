# Phase 2A — Function Ontology Definition

状态：2A 候选定义完成；2B 未开始。更新：2026-09-24。
本轮产物为 36 个节点候选（30 个函数节点、6 个必要前置候选），不是已发布 DAG。P1 的 20 个节点、31 条测试依赖与审核记录冻结保留，不以完成 P1 全部质量评估为进入 P2 的条件。

## 来源与范围

依据本地 Canonical Corpus 的 B1 第1–3章、4.5节及5.6节。B2以向量、几何、统计概率为主；X1为解析几何；X2的导数属于后续扩展；X3的概率统计不进入当前基础函数切片。该取舍结合已确认的 TEXTBOOK-INDEX，并非重做其他册 ingestion。
正文双页码与证据限制详见 [FUNCTION-TEXTBOOK-MAPPING.md](FUNCTION-TEXTBOOK-MAPPING.md)。本轮没有联网替代教材。

## 模块

|module|名称|节点数|
|---|---|---|
|foundation|必要前置|6|
|concepts|函数概念与要素|7|
|representations|函数表示|6|
|properties|函数性质|6|
|types|基本函数类型|4|
|graphs|作图与图象变换|3|
|applications|零点与模型应用|4|

模块用于组织，不代表前置顺序；数组顺序不代表拓扑序。

## 节点清单

|Stable ID|知识名称|Achievement Name|Module|核心能力与范围|必要前置|Key candidate|
|---|---|---|---|---|---|---|
|MS-NUM-REAL-001|实数|数的起点|foundation|有理数、无理数及实数大小的基础认识|是|否|
|MS-ALG-LINE-001|数轴|给数一个位置|foundation|用数轴表示数与范围|是|否|
|MS-GEO-COORD-001|平面直角坐标系|找到坐标|foundation|在平面中解释有序数对与点的位置|是|否|
|HS-SET-CONCEPT-001|集合的概念|收集与分类|foundation|辨认集合、元素及确定性|是|否|
|HS-ALG-INEQUALITY-001|不等式的性质|比较的规则|foundation|比较实数大小并正确使用不等式基本性质|是|否|
|MS-ALG-EQUATION-001|方程与解|寻找未知数|foundation|辨认方程的解并理解代入检验|是|否|
|HS-FUNC-INTERVAL-001|区间表示|读懂范围|concepts|在区间、集合和数轴之间表达实数范围|否|否|
|HS-FUNC-MAPPING-001|对应关系|输入与输出|concepts|解释两个数集间的输入输出对应及唯一性|否|否|
|HS-FUNC-CONCEPT-001|函数的概念|唯一的回应|concepts|用定义域和对应关系判断是否构成函数|否|是|
|HS-FUNC-DOMAIN-001|函数的定义域|输入的边界|concepts|根据解析式限制和实际背景确定允许输入|否|否|
|HS-FUNC-RANGE-001|函数的值域|输出的疆域|concepts|辨认实际输出集合并区别于陪域|否|否|
|HS-FUNC-VALUE-001|求函数值|代入与计算|concepts|在定义域内代入并计算给定函数值|否|否|
|HS-FUNC-IDENTITY-001|同一函数的判定|辨认同一个函数|concepts|比较定义域与对应关系判定两个表达是否同一函数|否|否|
|HS-FUNC-ANALYTIC-001|函数的解析表示|写出对应规则|representations|用解析式及定义域表达对应关系|否|否|
|HS-FUNC-TABLE-001|函数的列表表示|用表格记录关系|representations|读取与构造输入输出表并识别信息范围|否|否|
|HS-FUNC-GRAPH-001|函数的图像|把关系画出来|representations|解释图象上的点和函数的对应关系|否|否|
|HS-FUNC-PIECEDEF-001|分段函数的表示|一条规则分段写|representations|用分支表达式与条件表示同一个函数|否|否|
|HS-FUNC-PIECE-001|分段函数求值|选择正确的路|representations|根据输入选取分支再计算函数值|否|否|
|HS-FUNC-REPRESENT-001|函数表示法的转换|在三种语言间转换|representations|在解析式、表格和图象间转换并解释信息损失|否|否|
|HS-FUNC-MONO-001|函数的单调性|变化的方向|properties|辨认区间内任意两个输入与输出的严格大小关系|否|是|
|HS-FUNC-MONOPROOF-001|用定义证明单调性|证明变化方向|properties|完成任取、作差、判号和结论的论证|否|否|
|HS-FUNC-MONOINTERVAL-001|求函数的单调区间|找出变化区段|properties|在给定定义域中分别报告增减区间|否|否|
|HS-FUNC-EXTREME-001|函数的最大值与最小值|高处与低处|properties|区别上界下界与实际可取得的最大最小值|否|否|
|HS-FUNC-PARITY-001|函数的奇偶性|对称的秘密|properties|检查定义域对称并判断奇函数与偶函数|否|是|
|HS-FUNC-SYMMETRY-001|函数图像的对称性|从图象读出对称|properties|联系y轴、原点对称和函数值关系|否|否|
|HS-FUNC-LINEAR-001|一次函数的图像与性质|直线的方向|types|联系一次函数系数、直线图象与单调性|否|否|
|HS-FUNC-QUAD-001|二次函数的图像与性质|抛物线之谷|types|用抛物线、顶点和定义域讨论基本性质|否|是|
|HS-FUNC-RECIPROCAL-001|反比例函数的图像与性质|双曲线的两支|types|研究k/x的定义域、分支和区间单调性|否|否|
|HS-FUNC-POWER-001|幂函数的图像与性质|比较幂的形状|types|研究指数为1、2、3、1/2、-1的幂函数|否|否|
|HS-FUNC-PLOT-001|描点法作函数图像|让点组成图象|graphs|选取输入、计算输出并在定义域内描点作图|否|否|
|HS-FUNC-SHIFT-001|函数图像的平移|移动而不变形|graphs|根据点的坐标变化解释函数图象平移|否|否|
|HS-FUNC-SCALE-001|函数图像的伸缩|改变坐标尺度|graphs|区分横坐标伸缩和纵坐标伸缩|否|否|
|HS-FUNC-ZERO-001|函数的零点|与横轴相遇|applications|联系函数零点、方程实根和横轴交点横坐标|否|否|
|HS-FUNC-ZEROEXIST-001|函数零点存在定理|确定零点所在区间|applications|在连续且端点异号的条件下判断开区间内存在零点|否|否|
|HS-FUNC-BISECTION-001|二分法求零点近似值|逐步缩小范围|applications|保持异号区间并按精确度终止二分|否|否|
|HS-FUNC-APPLY-001|函数模型的简单应用|连接真实问题|applications|明确变量与实际范围、建立基本模型并解释结果|否|是|

## 粒度与去重决定

- 自变量、因变量、函数记号归入函数概念；函数值概念归入求函数值。
- 单调递增、单调递减、增函数、减函数归入单调性；奇函数、偶函数归入奇偶性；最大值与最小值保留为同一节点。
- 函数图像与图象法合并；解析表示、列表表示保留独立技能，表示转换是跨表示的评价任务。
- 单调性概念、定义证明、求单调区间分别评价概念识别、论证和区间定位，不按定义中的词语拆分。
- 分段表示与分段求值分别评价规则建构、分支选择和计算。P1 的 PIECE ID 仍表示求值。
- 函数零点与方程实根合并；零点存在定理和二分法分别承担存在判断与近似计算。
- 模型概念与简单建模应用合并；不设无独立能力的“图象变换”总括节点。
- 一次、二次、反比例函数在B1有明确回顾与研究任务，纳入高中复习研究范围；幂函数限定教材五类指数。
- 平移、伸缩保留为有范围限制的候选；当前证据来自正弦函数语境，未批准一般化内容。反射变换暂缓，自身对称性已纳入。
- 指数、对数、三角函数全体系、导数、复合函数与反函数暂缓。使用4.5节一般零点定义不意味着引入整章指数对数的依赖。

## 必要前置候选的用途

|ID|用途（不构成边）|
|---|---|
|MS-NUM-REAL-001|有理数、无理数及实数大小的基础认识；用途标签不代表任何Strong边。|
|MS-ALG-LINE-001|用数轴表示数与范围；用途标签不代表任何Strong边。|
|MS-GEO-COORD-001|在平面中解释有序数对与点的位置；用途标签不代表任何Strong边。|
|HS-SET-CONCEPT-001|辨认集合、元素及确定性；用途标签不代表任何Strong边。|
|HS-ALG-INEQUALITY-001|比较实数大小并正确使用不等式基本性质；用途标签不代表任何Strong边。|
|MS-ALG-EQUATION-001|辨认方程的解并理解代入检验；用途标签不代表任何Strong边。|

“必要前置”表示切片需容纳的基础能力类别，不表示任何目标已获 Strong 判定；实数、数轴、坐标系、方程仅有高中使用语境，初中完整定义仍需补证。没有为连通性创建边或人为指定根。

## Key Achievement candidates

|ID|理由|
|---|---|
|HS-FUNC-CONCEPT-001|函数领域统一定义的里程碑。|
|HS-FUNC-MONO-001|比较变化方向是后续研究函数的核心能力。|
|HS-FUNC-PARITY-001|连接代数判定与图象对称的重要里程碑。|
|HS-FUNC-QUAD-001|连接图象、最值、方程及应用的综合能力候选。|
|HS-FUNC-APPLY-001|将变量、表示和性质用于现实问题的综合里程碑。|

共5个；目前依据概念里程碑与综合能力选取。路径汇聚、Gateway 数量须在2B获准执行且候选边评估后验证，不能预称已由图证明。

## Schema 与兼容性

完整字段见 `content/fixtures/function-ontology.ts` 与 `packages/domain/src/function-ontology.ts`。所有节点含用户要求的19类字段，附带范围说明、前置用途与里程碑候选状态。importance/difficulty 是1–5的初始编辑估计，不是统计结论或教研验收。

使用独立 ontology seed，而非伪造运行时 KnowledgeNode 的必填详细内容和根标记。后续适配关系：canonicalName→nameZh、englishName→nameEn、summary→descriptionShort、domain/module→domainId/moduleId、importance→gaokaoImportance、pinyin→namePinyin、mathAliases→mathNotationAliases。gradeTag 显式区分初中复习与高中必修；本轮不执行数据库 seed、不切换在线图。

全部20个P1节点沿用ID；新增16个ID，不删除、不复用旧ID。所有 contentStatus 为 ONTOLOGY_ONLY；DIRECT 节点为 DRAFT，部分证据节点为 REVIEW_REQUIRED。DIRECT 只说明教材定位支持，不等于内容完整或依赖批准。

搜索元数据已填写。单调的标准拼音为 dan diao，用户验收中的 dantiao 与 hsdtx 保留为兼容检索别名；这不改变规范拼音。实际 Search Fly-to 留待后续阶段验收。

## 停止点

本轮只完成 What exists。未建立最终 Dependency、未生成完整 Detail Content、未创建布局或运行图、未进入2B、未部署。下一阶段必须另行授权。

