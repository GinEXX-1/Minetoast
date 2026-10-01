# Function Graph Analysis — Phase 2B

2026-09-24。统计只针对active Strong DAG，Weak与external reference不参与入度、层级或解锁。36个原始节点记录保留，实际active为32。
可复现入口：`content/fixtures/function-dependencies.ts`；分析：`packages/graph-core/src/analysis.ts`；测试：`pnpm exec vitest run tests/unit/function-dependencies.test.ts`。

## 结构结果

DAG=true；cycle=false；未声明root（orphan）=0；孤立节点=0；传递冗余=0；overconnected=0；最大直接前置数=3。
4个独立入口有明确范围理由，不构造单根树。gateway定义为至少3个直接Strong后继；convergence定义为至少2个直接Strong前置。这是统计定义，不自动决定Key。

|类别|节点|
|---|---|
|Root|数轴（MS-ALG-LINE-001）、平面直角坐标系（MS-GEO-COORD-001）、集合的概念（HS-SET-CONCEPT-001）、不等式的性质（HS-ALG-INEQUALITY-001）|
|Leaf|区间表示（HS-FUNC-INTERVAL-001）、函数的值域（HS-FUNC-RANGE-001）、同一函数的判定（HS-FUNC-IDENTITY-001）、分段函数求值（HS-FUNC-PIECE-001）、函数表示法的转换（HS-FUNC-REPRESENT-001）、用定义证明单调性（HS-FUNC-MONOPROOF-001）、求函数的单调区间（HS-FUNC-MONOINTERVAL-001）、函数的最大值与最小值（HS-FUNC-EXTREME-001）、函数的奇偶性（HS-FUNC-PARITY-001）、函数图像的对称性（HS-FUNC-SYMMETRY-001）、一次函数的图像与性质（HS-FUNC-LINEAR-001）、二次函数的图像与性质（HS-FUNC-QUAD-001）、反比例函数的图像与性质（HS-FUNC-RECIPROCAL-001）、幂函数的图像与性质（HS-FUNC-POWER-001）、描点法作函数图像（HS-FUNC-PLOT-001）、二分法求零点近似值（HS-FUNC-BISECTION-001）、函数模型的简单应用（HS-FUNC-APPLY-001）|
|Gateway|函数的概念（HS-FUNC-CONCEPT-001）、函数的定义域（HS-FUNC-DOMAIN-001）、求函数值（HS-FUNC-VALUE-001）、函数的解析表示（HS-FUNC-ANALYTIC-001）、函数的图像（HS-FUNC-GRAPH-001）、函数的单调性（HS-FUNC-MONO-001）|
|Convergence|区间表示（HS-FUNC-INTERVAL-001）、函数的图像（HS-FUNC-GRAPH-001）、分段函数求值（HS-FUNC-PIECE-001）、函数表示法的转换（HS-FUNC-REPRESENT-001）、用定义证明单调性（HS-FUNC-MONOPROOF-001）、一次函数的图像与性质（HS-FUNC-LINEAR-001）、反比例函数的图像与性质（HS-FUNC-RECIPROCAL-001）、幂函数的图像与性质（HS-FUNC-POWER-001）、描点法作函数图像（HS-FUNC-PLOT-001）、函数的零点（HS-FUNC-ZERO-001）、函数模型的简单应用（HS-FUNC-APPLY-001）|

|Root ID|入口理由|
|---|---|
|HS-SET-CONCEPT-001|集合与元素作为本切片入口，不要求完整实数分类；非声称数学上无任何前置。|
|MS-ALG-LINE-001|数轴以初中定位能力作为切片入口；完整实数分类的候选依赖存在争议而被隔离。|
|MS-GEO-COORD-001|坐标定位作为跨域入口；数轴方向等内部基础由该冻结能力涵盖，不新增未评估门槛。|
|HS-ALG-INEQUALITY-001|基本比较与不等式变换作为代数入口；切片外算术能力以外部假设记录。|

Longest Strong Path（一个最长链）：集合的概念 → 对应关系 → 函数的概念 → 求函数值 → 函数的零点 → 函数零点存在定理 → 二分法求零点近似值。长度6条边，7节点；可能存在等长链。拓扑序用于验证，不作为唯一教学路线。

## Transitive Reduction

在通过的候选图上运行reduction，新增删除数=0；另将3条已否决的传递提案放回测试图，再运行reduction，精确移除这3条并恢复原候选图。数学审查否定的实数→集合、坐标系→对应关系不算传递删除。
仅对Strong做约简；Weak表达有意义的帮助联系，不套用必要性传递约简。

## Unlock / Quick Initialization

以下期望集合是独立手写的测试oracle，未由被测遍历生成。每个场景验证空进度locked、缺任一直接Strong仍locked、前置齐备available、目标记录后unlocked；Quick Initialization只增加下列集合，重复调用幂等。
测试中Weak-only节点、siblings和无关分支均不在新增集合。若一个Weak源同时通过其他Strong路径是祖先，则它仍应因Strong被解锁，不能机械排除所有Weak邻居。

|类别|目标|状态轨迹|初始化集合|
|---|---|---|---|
|ordinary|函数的定义域|locked → available → unlocked|函数的定义域（HS-FUNC-DOMAIN-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|ordinary|函数的值域|locked → available → unlocked|函数的值域（HS-FUNC-RANGE-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|ordinary|分段函数求值|locked → available → unlocked|分段函数求值（HS-FUNC-PIECE-001）、求函数值（HS-FUNC-VALUE-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）、分段函数的表示（HS-FUNC-PIECEDEF-001）、函数的解析表示（HS-FUNC-ANALYTIC-001）|
|ordinary|函数表示法的转换|locked → available → unlocked|函数表示法的转换（HS-FUNC-REPRESENT-001）、函数的图像（HS-FUNC-GRAPH-001）、平面直角坐标系（MS-GEO-COORD-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）、函数的列表表示（HS-FUNC-TABLE-001）、函数的解析表示（HS-FUNC-ANALYTIC-001）|
|ordinary|二分法求零点近似值|locked → available → unlocked|二分法求零点近似值（HS-FUNC-BISECTION-001）、函数零点存在定理（HS-FUNC-ZEROEXIST-001）、函数的零点（HS-FUNC-ZERO-001）、函数的图像（HS-FUNC-GRAPH-001）、平面直角坐标系（MS-GEO-COORD-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）、求函数值（HS-FUNC-VALUE-001）|
|key|函数的概念|locked → available → unlocked|函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|key|函数的单调性|locked → available → unlocked|函数的单调性（HS-FUNC-MONO-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|key|函数的奇偶性|locked → available → unlocked|函数的奇偶性（HS-FUNC-PARITY-001）、函数的定义域（HS-FUNC-DOMAIN-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|key|二次函数的图像与性质|locked → available → unlocked|二次函数的图像与性质（HS-FUNC-QUAD-001）、函数的图像（HS-FUNC-GRAPH-001）、平面直角坐标系（MS-GEO-COORD-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）|
|key|函数模型的简单应用|locked → available → unlocked|函数模型的简单应用（HS-FUNC-APPLY-001）、函数的定义域（HS-FUNC-DOMAIN-001）、函数的概念（HS-FUNC-CONCEPT-001）、对应关系（HS-FUNC-MAPPING-001）、集合的概念（HS-SET-CONCEPT-001）、函数的解析表示（HS-FUNC-ANALYTIC-001）|

以上覆盖5个普通节点和全部5个Key候选。4个root初始应为available，不强造locked轨迹；它们作为相应闭包祖先参与验证。外部基础参考不自动写入图内progress。

## Path Simulation

每组分别验证to prerequisite、from successor、between；默认所有返回边都为Strong。开启includeWeak后，路径节点/边可增加，而相同进度的projectStatuses与Strong初始化闭包不变。

|A → B|To节点数|From节点数|Between节点数（Strong）|Between节点数（含Weak）|结果|
|---|---|---|---|---|---|
|集合的概念 → 二分法求零点近似值|9|29|8|8|PASS|
|平面直角坐标系 → 二次函数的图像与性质|6|12|3|6|PASS|
|对应关系 → 函数的奇偶性|5|27|4|5|PASS|
|不等式的性质 → 用定义证明单调性|6|2|2|2|PASS|
|函数的概念 → 函数模型的简单应用|6|26|4|13|PASS|

额外Weak-only对照：一次函数→模型、区间→单调性、图像→奇偶性，默认无Strong路径，完整关系模式有路径；对应Weak源均不进入目标Strong祖先闭包。
路径含义为两端间所有有向可达路径的并集，不是最短路径或唯一学习顺序。未知ID抛出UNKNOWN_NODE，循环遍历通过visited集合防止重复访问。UI切换绑定与浏览器体验不在本次离线模拟验收范围；新增函数提供显式的完整关系开关。

## Key Achievement 再评估

|ID|决定|依据|
|---|---|---|
|HS-FUNC-CONCEPT-001|CONFIRM_KEY|函数定义是领域里程碑，且具有多个直接Strong后继；图统计另行列出。|
|HS-FUNC-MONO-001|CONFIRM_KEY|单调性服务定义证明、区间判定与多种函数性质，是可验证的gateway。|
|HS-FUNC-PARITY-001|CONFIRM_KEY|保留为函数整体性质的领域里程碑；不借有争议的奇偶性→图象对称性宣称路径汇聚。|
|HS-FUNC-QUAD-001|CONFIRM_KEY|抛物线、顶点与定义域综合是基本函数的重要里程碑；不强制所有建模经二次函数。|
|HS-FUNC-APPLY-001|CONFIRM_KEY|定义域与解析表示两路汇聚，承担变量、实际范围和模型解释的综合能力。|

最终5个CONFIRM_KEY；0个DEMOTE_NORMAL；0个REVIEW_REQUIRED。奇偶性与二次函数按Domain milestone保留，即使为Strong叶子也不人为加边制造gateway。

## 工程成本与边界

拓扑和最长链DP为O(V+E)，空间O(V+E)；逐边替代路径检查最坏O(E(V+E))。本例32节点/40Strong规模无需复杂增量索引。路径和闭包为O(V+E)，不读取教材章节排序生成边。
现有GraphNode结构契约提取自KnowledgeNode，仅包含结构计算所需字段；因此本轮不为测试伪造空白课程内容。数据库、production seed与P1 fixture未替换。
