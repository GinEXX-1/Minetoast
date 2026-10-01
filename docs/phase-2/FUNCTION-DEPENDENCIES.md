# Phase 2B — Function Dependencies

状态：候选图完成；整体 CONDITIONAL PASS，条件与隔离范围见质量报告。2026-09-24。
P2A 36条节点记录冻结，不修改P1回归fixture。此文件替代2A阶段的依赖占位说明，不改写2A本体或映射。

## 6个前置候选重新评估

|node_id|决定|跨领域归属|进入可见候选图|理由|
|---|---|---|---|---|
|MS-NUM-REAL-001|EXTERNAL_REFERENCE|number-systems|否，仅external reference|本切片默认基本实数运算；高中语料不覆盖完整实数概念教学。登记跨领域外部基础，不能把它当集合或数轴的统一Strong门。|
|MS-ALG-LINE-001|KEEP_AS_PREREQUISITE|algebra-foundation|是|区间节点明确包含数轴表示，需可见地解释端点与范围；保留初中使用证据的局限。|
|MS-GEO-COORD-001|KEEP_AS_PREREQUISITE|coordinate-geometry|是|函数图象需要有序对定位；可见跨域前置，不据此要求对应关系先学坐标。|
|HS-SET-CONCEPT-001|KEEP_AS_PREREQUISITE|sets-and-logic|是|函数定义使用集合与元素语言，有直接高中来源；保留跨域可见节点。|
|HS-ALG-INEQUALITY-001|KEEP_AS_PREREQUISITE|algebra-inequalities|是|按定义作差证明增减需要不等式规则，有直接教材来源；不把整个不等式专题锁给所有函数节点。|
|MS-ALG-EQUATION-001|EXTERNAL_REFERENCE|algebra-equations|否，仅external reference|求解、检验方程为跨领域既有基础；当前初中定义来源未完整定位，以外部参考保留，不额外创建节点。|

本轮没有REMOVE_FROM_SLICE决定；不为凑三种分类而删除节点。外部参考沿用既有ID，但不参与图内解锁、root/leaf统计，也不是隐形Strong门。实数的使用关联到对应关系、数轴和不等式；方程与解关联到零点。这些是显式的切片外基础假设，尚无外部掌握状态同步。
数轴/坐标系的可见性不等于初中内容完整验收：2A PARTIAL_CONTEXTUAL保持原状，依赖判定使用目标任务定义与高中使用证据。

## 每个Target的最小直接前置集合

集合是针对冻结的核心能力，不是所有有关知识的罗列；不保证掌握这些节点等于掌握切片外全部算术技能。缺少的外部基础在上表明示。每条必要性理由见逐边记录。

|Target ID|核心能力|直接Strong前置|未启用/范围决定|
|---|---|---|---|
|MS-NUM-REAL-001|有理数、无理数及实数大小的基础认识|无|EXTERNAL_REFERENCE|
|MS-ALG-LINE-001|用数轴表示数与范围|无|待复核输入：实数|
|MS-GEO-COORD-001|在平面中解释有序数对与点的位置|无|坐标定位作为跨域入口；数轴方向等内部基础由该冻结能力涵盖，不新增未评估门槛。|
|HS-SET-CONCEPT-001|辨认集合、元素及确定性|无|集合与元素作为本切片入口，不要求完整实数分类；非声称数学上无任何前置。|
|HS-ALG-INEQUALITY-001|比较实数大小并正确使用不等式基本性质|无|基本比较与不等式变换作为代数入口；切片外算术能力以外部假设记录。|
|MS-ALG-EQUATION-001|辨认方程的解并理解代入检验|无|EXTERNAL_REFERENCE|
|HS-FUNC-INTERVAL-001|在区间、集合和数轴之间表达实数范围|集合的概念（HS-SET-CONCEPT-001）、数轴（MS-ALG-LINE-001）|最小集合按下表反事实核验|
|HS-FUNC-MAPPING-001|解释两个数集间的输入输出对应及唯一性|集合的概念（HS-SET-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-CONCEPT-001|用定义域和对应关系判断是否构成函数|对应关系（HS-FUNC-MAPPING-001）|最小集合按下表反事实核验|
|HS-FUNC-DOMAIN-001|根据解析式限制和实际背景确定允许输入|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-RANGE-001|辨认实际输出集合并区别于陪域|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-VALUE-001|在定义域内代入并计算给定函数值|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-IDENTITY-001|比较定义域与对应关系判定两个表达是否同一函数|函数的定义域（HS-FUNC-DOMAIN-001）|最小集合按下表反事实核验|
|HS-FUNC-ANALYTIC-001|用解析式及定义域表达对应关系|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-TABLE-001|读取与构造输入输出表并识别信息范围|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-GRAPH-001|解释图象上的点和函数的对应关系|函数的概念（HS-FUNC-CONCEPT-001）、平面直角坐标系（MS-GEO-COORD-001）|最小集合按下表反事实核验|
|HS-FUNC-PIECEDEF-001|用分支表达式与条件表示同一个函数|函数的解析表示（HS-FUNC-ANALYTIC-001）|最小集合按下表反事实核验|
|HS-FUNC-PIECE-001|根据输入选取分支再计算函数值|分段函数的表示（HS-FUNC-PIECEDEF-001）、求函数值（HS-FUNC-VALUE-001）|最小集合按下表反事实核验|
|HS-FUNC-REPRESENT-001|在解析式、表格和图象间转换并解释信息损失|函数的解析表示（HS-FUNC-ANALYTIC-001）、函数的列表表示（HS-FUNC-TABLE-001）、函数的图像（HS-FUNC-GRAPH-001）|最小集合按下表反事实核验|
|HS-FUNC-MONO-001|辨认区间内任意两个输入与输出的严格大小关系|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-MONOPROOF-001|完成任取、作差、判号和结论的论证|函数的单调性（HS-FUNC-MONO-001）、不等式的性质（HS-ALG-INEQUALITY-001）|最小集合按下表反事实核验|
|HS-FUNC-MONOINTERVAL-001|在给定定义域中分别报告增减区间|函数的单调性（HS-FUNC-MONO-001）|最小集合按下表反事实核验|
|HS-FUNC-EXTREME-001|区别上界下界与实际可取得的最大最小值|函数的概念（HS-FUNC-CONCEPT-001）|最小集合按下表反事实核验|
|HS-FUNC-PARITY-001|检查定义域对称并判断奇函数与偶函数|函数的定义域（HS-FUNC-DOMAIN-001）|最小集合按下表反事实核验|
|HS-FUNC-SYMMETRY-001|联系y轴、原点对称和函数值关系|函数的图像（HS-FUNC-GRAPH-001）|待复核输入：函数的奇偶性|
|HS-FUNC-LINEAR-001|联系一次函数系数、直线图象与单调性|函数的图像（HS-FUNC-GRAPH-001）、函数的单调性（HS-FUNC-MONO-001）|最小集合按下表反事实核验|
|HS-FUNC-QUAD-001|用抛物线、顶点和定义域讨论基本性质|函数的图像（HS-FUNC-GRAPH-001）|最小集合按下表反事实核验|
|HS-FUNC-RECIPROCAL-001|研究k/x的定义域、分支和区间单调性|函数的图像（HS-FUNC-GRAPH-001）、函数的单调性（HS-FUNC-MONO-001）|待复核输入：函数的定义域|
|HS-FUNC-POWER-001|研究指数为1、2、3、1/2、-1的幂函数|函数的图像（HS-FUNC-GRAPH-001）、函数的单调性（HS-FUNC-MONO-001）|最小集合按下表反事实核验|
|HS-FUNC-PLOT-001|选取输入、计算输出并在定义域内描点作图|求函数值（HS-FUNC-VALUE-001）、函数的图像（HS-FUNC-GRAPH-001）|最小集合按下表反事实核验|
|HS-FUNC-SHIFT-001|根据点的坐标变化解释函数图象平移|无|范围待核验，未纳入active DAG|
|HS-FUNC-SCALE-001|区分横坐标伸缩和纵坐标伸缩|无|范围待核验，未纳入active DAG|
|HS-FUNC-ZERO-001|联系函数零点、方程实根和横轴交点横坐标|求函数值（HS-FUNC-VALUE-001）、函数的图像（HS-FUNC-GRAPH-001）|最小集合按下表反事实核验|
|HS-FUNC-ZEROEXIST-001|在连续且端点异号的条件下判断开区间内存在零点|函数的零点（HS-FUNC-ZERO-001）|最小集合按下表反事实核验|
|HS-FUNC-BISECTION-001|保持异号区间并按精确度终止二分|函数零点存在定理（HS-FUNC-ZEROEXIST-001）|最小集合按下表反事实核验|
|HS-FUNC-APPLY-001|明确变量与实际范围、建立基本模型并解释结果|函数的解析表示（HS-FUNC-ANALYTIC-001）、函数的定义域（HS-FUNC-DOMAIN-001）|最小集合按下表反事实核验|

## 逐边结论（61项提案，非36×35全配对枚举）

依赖全集不继承P1。先完成Strong提案与审查，再加入Weak帮助关系。五类质量输入以 `function-dependency-proposals.ts` 的 firstAssessment 为准，包含 source/target能力定义、Canonical定位、反事实rationale、结构上下文及第一轮结论。独立意见存于 `function-dependency-reviews.ts`；`function-dependencies.ts` 调用质量门计算有效边，而非手工写“已通过”。

|edge_id|Source → Target|最终决定|confidence|候选类型|反事实 rationale（第一轮；冲突见下节）|教材证据|
|---|---|---|---|---|---|---|
|20000000-0000-4000-8000-000000000001|集合的概念 → 对应关系|KEEP_STRONG|HIGH|STRONG|数值对应的源集合、目标集合及元素必须可辨认，否则无法解释哪个输入对应哪个输出。|PEP-A:B1:C1:S1.1：printed 2 / PDF 9 (DIRECT)；PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)|
|20000000-0000-4000-8000-000000000002|对应关系 → 函数的概念|KEEP_STRONG|HIGH|STRONG|函数判定的核心是每个允许输入恰有一个输出；不理解对应关系便无法检查该唯一性约束。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)|
|20000000-0000-4000-8000-000000000003|集合的概念 → 区间表示|KEEP_STRONG|HIGH|STRONG|区间表示的是满足条件的实数集合，不理解元素是否属于集合就无法区分区间端点包含与排除。|PEP-A:B1:C1:S1.1：printed 2 / PDF 9 (DIRECT)；PEP-A:B1:C3:S3.1：printed 64 / PDF 71 (DIRECT)|
|20000000-0000-4000-8000-000000000004|数轴 → 区间表示|KEEP_STRONG|HIGH|STRONG|目标明确包含区间与数轴间转换；不能在数轴上定位数和范围就不能完成这一核心表征。|PEP-A:B1:C2:S2.1：printed 38 / PDF 45 (PARTIAL_CONTEXTUAL)；PEP-A:B1:C3:S3.1：printed 64 / PDF 71 (DIRECT)|
|20000000-0000-4000-8000-000000000005|函数的概念 → 函数的值域|KEEP_STRONG|HIGH|STRONG|实际输出集合依赖函数的输入输出规则；不能识别函数输出就不能区别值域与给定目标集合。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)|
|20000000-0000-4000-8000-000000000006|函数的概念 → 求函数值|KEEP_STRONG|HIGH|STRONG|求函数值必须知道输入、对应规则和输出的含义，否则容易把f(x)当乘法或算错对象。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)|
|20000000-0000-4000-8000-000000000007|函数的定义域 → 同一函数的判定|KEEP_STRONG|HIGH|STRONG|判定同一函数必须比较允许输入集合；不会确定允许输入就可能把化简后表达式相同误判为同一函数。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3:S3.1：printed 66 / PDF 73 (DIRECT)|
|20000000-0000-4000-8000-000000000008|函数的概念 → 函数的解析表示|KEEP_STRONG|HIGH|STRONG|解析表示必须表达一个函数的确定对应，缺少函数概念不能检查每个输入是否唯一输出。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000009|函数的概念 → 函数的列表表示|KEEP_STRONG|HIGH|STRONG|输入输出表的每列必须代表同一个函数关系，不能辨认输入与输出就不能解释表格。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000010|函数的概念 → 函数的图像|KEEP_STRONG|HIGH|STRONG|图象上的点必须表达允许输入与唯一函数值，缺少这一含义就无法判断图形是否表示函数。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000011|平面直角坐标系 → 函数的图像|KEEP_STRONG|HIGH|STRONG|图象依靠横坐标表示输入、纵坐标表示输出；不理解有序对与平面点就无法读出图象所表达的函数关系。|PEP-A:B1:C1:S1.2：printed 9 / PDF 16 (PARTIAL_CONTEXTUAL)；PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000012|函数的解析表示 → 分段函数的表示|KEEP_STRONG|HIGH|STRONG|分段表示需要为各条件写出对应表达式，不能用解析式表达关系便不能构建分支规则。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.1：printed 68 / PDF 75 (DIRECT)|
|20000000-0000-4000-8000-000000000013|分段函数的表示 → 分段函数求值|KEEP_STRONG|HIGH|STRONG|求值须先按条件选择正确分支；不理解分段表示会在分界处使用错误的表达式。|PEP-A:B1:C3:S3.1：printed 68 / PDF 75 (DIRECT)|
|20000000-0000-4000-8000-000000000014|求函数值 → 分段函数求值|KEEP_STRONG|HIGH|STRONG|选定分支后仍须计算该输入的函数值，缺少代入求值能力不能完成目标。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3:S3.1：printed 68 / PDF 75 (DIRECT)|
|20000000-0000-4000-8000-000000000015|函数的解析表示 → 函数表示法的转换|KEEP_STRONG|HIGH|STRONG|三种表示间转换包含构造或解释解析式，不掌握解析表示就缺少一种必要的目标表征。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000016|函数的列表表示 → 函数表示法的转换|KEEP_STRONG|HIGH|STRONG|三种表示间转换包含读取和构造对应值表，缺少列表表示能力无法完成该部分转换。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000017|函数的图像 → 函数表示法的转换|KEEP_STRONG|HIGH|STRONG|三种表示间转换包含解释或生成函数图象，不能理解图象中的输入输出便无法保持转换的语义。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)|
|20000000-0000-4000-8000-000000000018|函数的概念 → 函数的单调性|KEEP_STRONG|HIGH|STRONG|单调性比较任意两个允许输入的函数输出，不能辨认函数的输入输出就无法理解比较对象。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)|
|20000000-0000-4000-8000-000000000019|函数的单调性 → 用定义证明单调性|KEEP_STRONG|HIGH|STRONG|证明必须以区间内任意两输入的大小蕴含输出大小为目标；不理解单调性定义就无法建立待证命题。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)|
|20000000-0000-4000-8000-000000000020|不等式的性质 → 用定义证明单调性|KEEP_STRONG|HIGH|STRONG|作差后需依不等式性质判号，尤其负数乘除改变不等号；未掌握这些规则会使论证无效。|PEP-A:B1:C2:S2.1：printed 41 / PDF 48 (DIRECT)；PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)|
|20000000-0000-4000-8000-000000000021|函数的单调性 → 求函数的单调区间|KEEP_STRONG|HIGH|STRONG|求增减区间必须知道何谓该区间任意两点的增减关系，否则只能报告局部采样趋势。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.2：printed 81 / PDF 88 (DIRECT)|
|20000000-0000-4000-8000-000000000022|函数的概念 → 函数的最大值与最小值|KEEP_STRONG|HIGH|STRONG|最大最小值是所有允许输入的输出中实际取得的界，不理解函数输出就不能辨认比较范围与对象。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000023|函数的图像 → 函数图像的对称性|KEEP_STRONG|HIGH|STRONG|目标是把图象的y轴或原点对称联系到函数值；不理解点与输入输出的对应便无法完成几何与代数联系。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 83 / PDF 90 (DIRECT)|
|20000000-0000-4000-8000-000000000024|函数的图像 → 一次函数的图像与性质|KEEP_STRONG|HIGH|STRONG|目标含一次函数直线图象的解释，未掌握函数图象就无法说明系数与直线形状的关系。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)|
|20000000-0000-4000-8000-000000000025|函数的单调性 → 一次函数的图像与性质|KEEP_STRONG|HIGH|STRONG|目标明确包含系数与单调性关系，不能辨认增减含义便无法解释系数符号对应的变化。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)|
|20000000-0000-4000-8000-000000000026|函数的图像 → 二次函数的图像与性质|KEEP_STRONG|HIGH|STRONG|目标含抛物线及顶点的图象解释，不能解释函数图象的点就不能识别顶点对应的输入输出。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000027|函数的图像 → 反比例函数的图像与性质|KEEP_STRONG|HIGH|STRONG|目标包含双曲线分支，缺少图象含义就不能解释两支对应的输入输出区域。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 79 / PDF 86 (DIRECT)|
|20000000-0000-4000-8000-000000000028|函数的单调性 → 反比例函数的图像与性质|KEEP_STRONG|HIGH|STRONG|研究每个分支的区间单调性需要严格增减含义，否则会把跨零的两段误认为整体单调。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.2：printed 79 / PDF 86 (DIRECT)|
|20000000-0000-4000-8000-000000000029|函数的图像 → 幂函数的图像与性质|KEEP_STRONG|HIGH|STRONG|目标明确研究五类幂函数图象，不能解释图象含义便无法比较这些曲线的输入输出特征。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.3：printed 89 / PDF 96 (DIRECT)|
|20000000-0000-4000-8000-000000000030|求函数值 → 描点法作函数图像|KEEP_STRONG|HIGH|STRONG|描点必须计算所选输入对应的输出；不会求函数值就不能得到要描的点。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3：printed 87 / PDF 94 (DIRECT)|
|20000000-0000-4000-8000-000000000031|函数的图像 → 描点法作函数图像|KEEP_STRONG|HIGH|STRONG|作图必须保持点与函数对应、区分离散点和连续曲线，缺少图象含义会错误连接点。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3：printed 87 / PDF 94 (DIRECT)|
|20000000-0000-4000-8000-000000000032|求函数值 → 函数的零点|KEEP_STRONG|HIGH|STRONG|检验候选数是否为零点要判断该输入的函数值是否为0，不能求值便不能完成基本零点检验。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C4:S4.5：printed 142 / PDF 149 (DIRECT)|
|20000000-0000-4000-8000-000000000033|函数的零点 → 函数零点存在定理|KEEP_STRONG|HIGH|STRONG|存在定理保证区间中存在使函数值为0的数，不理解零点就不能解释定理结论。|PEP-A:B1:C4:S4.5：printed 142 / PDF 149 (DIRECT)；PEP-A:B1:C4:S4.5：printed 143 / PDF 150 (DIRECT)|
|20000000-0000-4000-8000-000000000034|函数零点存在定理 → 二分法求零点近似值|KEEP_STRONG|HIGH|STRONG|二分保留异号子区间依据连续与异号的存在保证，未掌握该条件会在不适用函数上错误宣称逼近零点。|PEP-A:B1:C4:S4.5：printed 143 / PDF 150 (DIRECT)；PEP-A:B1:C4:S4.5：printed 145 / PDF 152 (DIRECT)|
|20000000-0000-4000-8000-000000000035|函数的解析表示 → 函数模型的简单应用|KEEP_STRONG|HIGH|STRONG|本节点要求建立基本函数模型，不能用解析关系表达变量变化就不能完成模型构建。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.4：printed 95 / PDF 102 (DIRECT)|
|20000000-0000-4000-8000-000000000036|函数的定义域 → 函数模型的简单应用|KEEP_STRONG|HIGH|STRONG|模型须限定实际允许输入并解释结果；不能确定实际定义域会给出超出情境的无效模型。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3:S3.4：printed 95 / PDF 102 (DIRECT)|
|20000000-0000-4000-8000-000000000037|函数的概念 → 函数的定义域|KEEP_STRONG|MEDIUM|STRONG|定义域是函数允许输入集合；若没有函数输入含义则无法解释求得的限制条件。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)|
|20000000-0000-4000-8000-000000000038|区间表示 → 函数的单调性|DOWNGRADE_TO_WEAK|MEDIUM|WEAK|单调性需知道比较范围，但可用集合条件或语言指定范围，完整区间与数轴转换技能并非必要。|PEP-A:B1:C3:S3.1：printed 64 / PDF 71 (DIRECT)；PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)|
|20000000-0000-4000-8000-000000000039|函数的定义域 → 函数的奇偶性|KEEP_STRONG|MEDIUM|STRONG|奇偶性须先验证定义域对相反数封闭；不会确定允许输入可能漏掉定义域不对称。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3:S3.2：printed 84 / PDF 91 (DIRECT)|
|20000000-0000-4000-8000-000000000040|函数的奇偶性 → 函数图像的对称性|REVIEW_REQUIRED|LOW|不启用|目标要求联系图象对称与函数值关系；若不能判定奇偶关系便难以完成该对应解释。|PEP-A:B1:C3:S3.2：printed 84 / PDF 91 (DIRECT)；PEP-A:B1:C3:S3.2：printed 83 / PDF 90 (DIRECT)|
|20000000-0000-4000-8000-000000000041|函数的最大值与最小值 → 二次函数的图像与性质|DOWNGRADE_TO_WEAK|MEDIUM|WEAK|抛物线顶点可直接读出且能用配方定位，全域最值定义有帮助但不是识别顶点与形状的必要条件。|PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000042|一次函数的图像与性质 → 函数模型的简单应用|DOWNGRADE_TO_WEAK|MEDIUM|WEAK|基本模型不全是一次函数；可用简单非线性模型完成通用建模任务，因此该特定函数不是统一必要前置。|PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)；PEP-A:B1:C3:S3.4：printed 95 / PDF 102 (DIRECT)|
|20000000-0000-4000-8000-000000000043|二次函数的图像与性质 → 函数模型的简单应用|DOWNGRADE_TO_WEAK|MEDIUM|WEAK|用一次或分段规则也可完成简单建模，不掌握二次函数不阻碍所有目标核心能力。|PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)；PEP-A:B1:C3:S3.4：printed 95 / PDF 102 (DIRECT)|
|20000000-0000-4000-8000-000000000044|函数的定义域 → 反比例函数的图像与性质|REVIEW_REQUIRED|LOW|不启用|该函数仅需排除分母为0，未掌握通用求定义域流程仍可研究双曲线；通用方法有帮助。|PEP-A:B1:C3:S3.1：printed 65 / PDF 72 (DIRECT)；PEP-A:B1:C3:S3.2：printed 79 / PDF 86 (DIRECT)|
|20000000-0000-4000-8000-000000000045|函数的单调性 → 幂函数的图像与性质|KEEP_STRONG|MEDIUM|STRONG|冻结范围研究五类幂函数的性质包含增减比较，不能理解单调性无法解释该性质。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.3：printed 89 / PDF 96 (DIRECT)|
|20000000-0000-4000-8000-000000000046|函数的图像 → 函数的零点|KEEP_STRONG|MEDIUM|STRONG|冻结目标要求同时联系零点与横轴交点横坐标，缺少函数图象含义就不能完成这一几何表述。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C4:S4.5：printed 142 / PDF 149 (DIRECT)|
|20000000-0000-4000-8000-000000000047|实数 → 数轴|REVIEW_REQUIRED|LOW|不启用|有理数数轴可先建立，无需先掌握有理数与无理数的完整分类，完整实数节点不宜作为数轴门槛。|PEP-A:B1:C2:S2.1：printed 38 / PDF 45 (PARTIAL_CONTEXTUAL)|
|20000000-0000-4000-8000-000000000048|实数 → 集合的概念|REMOVE|MEDIUM|不启用|集合可以由非数对象构成，缺少实数知识不会阻碍集合与元素概念。|PEP-A:B1:C2:S2.1：printed 38 / PDF 45 (PARTIAL_CONTEXTUAL)；PEP-A:B1:C1:S1.1：printed 2 / PDF 9 (DIRECT)|
|20000000-0000-4000-8000-000000000049|平面直角坐标系 → 对应关系|REMOVE|MEDIUM|不启用|集合之间的对应可由箭头或表格表达，平面坐标系不是数值对应的必要前置。|PEP-A:B1:C1:S1.2：printed 9 / PDF 16 (PARTIAL_CONTEXTUAL)；PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)|
|20000000-0000-4000-8000-000000000050|函数的图像 → 函数的单调性|DOWNGRADE_TO_WEAK|HIGH|WEAK|图象支持观察增减，但任意两输入输出的不等关系可直接用代数判断；不掌握图象仍可理解定义。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)|
|20000000-0000-4000-8000-000000000051|函数的图像 → 函数的奇偶性|DOWNGRADE_TO_WEAK|HIGH|WEAK|图象对称帮助理解，奇偶性也可用定义域封闭与函数值等式判断，不依赖画图。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C3:S3.2：printed 84 / PDF 91 (DIRECT)|
|20000000-0000-4000-8000-000000000052|函数的值域 → 函数的最大值与最小值|DOWNGRADE_TO_WEAK|HIGH|WEAK|值域有助于整体描述输出，但可直接以任意x的上界与等号取得判断最值，无需先掌握通用值域任务。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000053|函数的单调性 → 函数的最大值与最小值|DOWNGRADE_TO_WEAK|HIGH|WEAK|单调性帮助寻找端点最值，但配方或直接不等式也能确定最值。|PEP-A:B1:C3:S3.2：printed 77 / PDF 84 (DIRECT)；PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000054|一次函数的图像与性质 → 二次函数的图像与性质|DOWNGRADE_TO_WEAK|HIGH|WEAK|比较直线和抛物线有帮助，但二次函数可独立从表达式和图象研究。|PEP-A:B1:C3:S3.2：printed 78 / PDF 85 (DIRECT)；PEP-A:B1:C3:S3.2：printed 80 / PDF 87 (DIRECT)|
|20000000-0000-4000-8000-000000000055|分段函数求值 → 函数模型的简单应用|DOWNGRADE_TO_WEAK|HIGH|WEAK|分段求值有助于处理分段模型，但简单应用也可以是不分段模型。|PEP-A:B1:C3:S3.1：printed 68 / PDF 75 (DIRECT)；PEP-A:B1:C3:S3.4：printed 95 / PDF 102 (DIRECT)|
|20000000-0000-4000-8000-000000000056|函数的奇偶性 → 幂函数的图像与性质|DOWNGRADE_TO_WEAK|HIGH|WEAK|奇偶性有助于整理五种幂函数的对称特点，目标研究可先从图象与增减入手。|PEP-A:B1:C3:S3.2：printed 84 / PDF 91 (DIRECT)；PEP-A:B1:C3:S3.3：printed 89 / PDF 96 (DIRECT)|
|20000000-0000-4000-8000-000000000057|集合的概念 → 函数的概念|REMOVE|HIGH|不启用|通过集合→对应关系→函数概念已表达该集合语言前置，额外直接边是传递冗余。|PEP-A:B1:C1:S1.1：printed 2 / PDF 9 (DIRECT)；PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)|
|20000000-0000-4000-8000-000000000058|函数的概念 → 同一函数的判定|REMOVE|HIGH|不启用|通过函数概念与定义域的关系候选复核后再判定；同一函数判定所需的函数对应含义由定义域学习背景涵盖；不机械叠加。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3:S3.1：printed 66 / PDF 73 (DIRECT)|
|20000000-0000-4000-8000-000000000059|函数的概念 → 描点法作函数图像|REMOVE|HIGH|不启用|函数概念经函数图象和函数值已到达描点，额外边为传递冗余。|PEP-A:B1:C3:S3.1：printed 62 / PDF 69 (DIRECT)；PEP-A:B1:C3：printed 87 / PDF 94 (DIRECT)|
|20000000-0000-4000-8000-000000000060|函数的图像 → 函数图像的平移|REVIEW_REQUIRED|LOW|不启用|冻结平移节点覆盖一般函数，但直接教材仅定位正弦水平平移，目标能力范围未稳定，暂不将图象前置发布为Strong。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C5:S5.6：printed 236 / PDF 243 (PARTIAL_CONTEXTUAL)|
|20000000-0000-4000-8000-000000000061|函数的图像 → 函数图像的伸缩|REVIEW_REQUIRED|LOW|不启用|教材证据仅有正参数正弦伸缩；冻结节点的一般化范围未稳定，暂排入review queue。|PEP-A:B1:C3:S3.1：printed 67 / PDF 74 (DIRECT)；PEP-A:B1:C5:S5.6：printed 236 / PDF 243 (PARTIAL_CONTEXTUAL)|

REMOVE表示移除提案，不删除P1边或历史记录。DOWNGRADE_TO_WEAK也用于“从一开始即建议Weak”的提案，proposedDependencyType保留原建议类型。

## 重点链结论

- 集合→对应关系→函数概念保留；集合→函数概念直接边移除，已有传递路径。
- 函数概念→定义域经过两轮一致通过；定义域→同一函数判定及实际建模保留。没有反向的定义域→函数概念。
- 函数概念→值域、函数值、三种函数表示保留。
- 图像→单调性为Weak；区间→单调性经独立复核为Weak，区间记号不是增减概念的唯一表达。
- 定义域→奇偶性两轮一致保留；图像→奇偶性为Weak。奇偶性→图像对称性有冲突，不启用。
- 图像→零点因冻结target明确包含横轴交点横坐标而保留，不是“画图方便”。
- 图像支持基础函数的图象任务，单调性支持指定的增减性质任务。值域、定义域不机械连接所有基础函数；定义域→反比例的意见冲突进入review queue。
- 一次/二次→模型均为Weak；模型不强制先掌握模型库的全部成员。
- 实数→集合、坐标系→对应关系移除；实数→数轴因范围歧义保持REVIEW_REQUIRED。
- 所有普通及综合节点本版均≤3个直接Strong前置，不使用5前置例外。

## 数据与执行边界

36记录 = 32个active候选节点 + 2个external reference（实数、方程）+ 2个待范围确认（平移、伸缩）。后两者保留为可审查记录，不当作“无前置即可解锁”的假root。
active候选图是32节点/40Strong/11Weak。graph属性用于离线模拟；publicationEligible:false。现有在线图与数据库不切换，P1审核历史不迁移或删除。
