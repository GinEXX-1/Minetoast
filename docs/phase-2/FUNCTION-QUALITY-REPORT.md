# Function Quality Report — Phase 2B

结论：**CONDITIONAL PASS**（active候选DAG与行为模拟通过；36记录中4项未进入active图）。2026-09-24。
小量REVIEW_REQUIRED按规则隔离，不阻塞51条通过边；此结论不是生产发布批准，也不宣布全部36节点已具备完整可用教学内容。

|指标|结果|
|---|---|
|冻结节点记录|36|
|active候选节点|32|
|external reference|2|
|待范围确认节点|2|
|提案|61|
|Candidate Strong|40|
|Candidate Weak|11|
|Removed Edge|5|
|REVIEW_REQUIRED|5|
|Root|4|
|Leaf|17|
|最长Strong链|6条边 / 7节点|
|最大直接Strong前置|3|
|CONFIRM_KEY|5|

## 第一轮与独立第二轮

第一轮run为root-p2b-first-review，基于冻结能力与已确认教材映射给出反事实判断；13项MEDIUM交由独立run `/root/independent_dependency_review`。该run未读取第一轮结论、仅按相同节点范围与证据独立判断；审查时间2026-09-24 17:25:17 CST。没有把一次生成伪装成两次审查。
同一模型不同上下文审查不是不同模型交叉验证；目前独立性体现为独立run与不展示初评结论，不声称完全消除模型共性偏差。

|候选|第一轮决定 / confidence|第二轮决定 / confidence|第二轮rationale|最终质量状态|
|---|---|---|---|---|
|函数的概念 → 函数的定义域|KEEP_STRONG / MEDIUM|KEEP_STRONG / MEDIUM|允许输入的集合必须具有函数语义；只会代数限制不能完整解释定义域。概念内的术语辨认不等于target的求域技能，不能反向创建环。|KEEP_STRONG / MEDIUM / AI_REVIEW_2_PASSED|
|区间表示 → 函数的单调性|DOWNGRADE_TO_WEAK / MEDIUM|DOWNGRADE_TO_WEAK / MEDIUM|可以用a<x<b等条件指定范围而不掌握完整区间转换；表示技能是帮助而非必要条件。|DOWNGRADE_TO_WEAK / MEDIUM / AI_REVIEW_2_PASSED|
|函数的定义域 → 函数的奇偶性|KEEP_STRONG / MEDIUM|KEEP_STRONG / MEDIUM|冻结能力要求先检查允许输入对相反数封闭；只检验代数等式会误判受限域。给定域题目未必需完整求域技巧，故MEDIUM。|KEEP_STRONG / MEDIUM / AI_REVIEW_2_PASSED|
|函数的奇偶性 → 函数图像的对称性|KEEP_STRONG / MEDIUM|DOWNGRADE_TO_WEAK / MEDIUM|可从点对(x,y)、(-x,y)或(-x,-y)解释函数值关系，无需先掌握完整奇偶分类流程。|REVIEW_REQUIRED / LOW / REVIEW_REQUIRED|
|函数的最大值与最小值 → 二次函数的图像与性质|DOWNGRADE_TO_WEAK / MEDIUM|DOWNGRADE_TO_WEAK / MEDIUM|冻结target未要求所有受限域最值任务，配方、顶点和形状可在抽象最值判定前理解。|DOWNGRADE_TO_WEAK / MEDIUM / AI_REVIEW_2_PASSED|
|一次函数的图像与性质 → 函数模型的简单应用|DOWNGRADE_TO_WEAK / MEDIUM|DOWNGRADE_TO_WEAK / HIGH|通用建模可选其他基本函数，一次模型只是模型工具之一，不能构成AND门槛。|DOWNGRADE_TO_WEAK / MEDIUM / AI_REVIEW_2_PASSED|
|二次函数的图像与性质 → 函数模型的简单应用|DOWNGRADE_TO_WEAK / MEDIUM|DOWNGRADE_TO_WEAK / HIGH|不掌握二次函数仍可完成一次或其他简单函数模型；二次优化只是一个分支。|DOWNGRADE_TO_WEAK / MEDIUM / AI_REVIEW_2_PASSED|
|函数的定义域 → 反比例函数的图像与性质|DOWNGRADE_TO_WEAK / MEDIUM|KEEP_STRONG / MEDIUM|冻结target明确包含k/x的定义域、分支和区间单调性；不理解分母限制会连过零或混淆分支。必要的是域意识而非全部高难求域技能。|REVIEW_REQUIRED / LOW / REVIEW_REQUIRED|
|函数的单调性 → 幂函数的图像与性质|KEEP_STRONG / MEDIUM|KEEP_STRONG / MEDIUM|五类幂函数性质研究含区间增减，缺少严格比较概念便不能可靠解释x²及1/x等性质。范围解释来自教材89–91页。|KEEP_STRONG / MEDIUM / AI_REVIEW_2_PASSED|
|函数的图像 → 函数的零点|KEEP_STRONG / MEDIUM|KEEP_STRONG / HIGH|target明确包含横轴交点横坐标，单独会解f(x)=0不能完成其三种表述联系。|KEEP_STRONG / MEDIUM / AI_REVIEW_2_PASSED|
|实数 → 数轴|REMOVE / MEDIUM|REVIEW_REQUIRED / LOW|有理数数轴可先建立，但target是否涵盖任意实数与点的一一对应不明；双方只有38/45高中使用语境，需界定范围。|REVIEW_REQUIRED / LOW / REVIEW_REQUIRED|
|实数 → 集合的概念|REMOVE / MEDIUM|REMOVE / HIGH|集合可用非实数对象完成核心辨认，实数只是实例，非一般集合定义的前置。|REMOVE / MEDIUM / AI_REVIEW_2_PASSED|
|平面直角坐标系 → 对应关系|REMOVE / MEDIUM|REMOVE / HIGH|数值对应可用箭头、表格或文字表示；目标并非坐标图表示，不需坐标系。|REMOVE / MEDIUM / AI_REVIEW_2_PASSED|

两轮同一决定的MEDIUM与HIGH置信度不构成数学结论冲突，最终保守保留MEDIUM；LOW或决定不同仍需REVIEW_REQUIRED。P1实现曾错误要求置信度逐字一致，且HIGH可能绕过已有冲突，已在公共质量门修正并加入回归测试。P1数据与审核历史未改写。

## 待复核队列

|关系|原因|解除条件|
|---|---|---|
|函数的奇偶性 → 函数图像的对称性|AI_REVIEW_CONFLICT|明确能力粒度与反事实分歧后进行新一轮审查，或记录人工override；不可择一轮绕过冲突|
|函数的定义域 → 反比例函数的图像与性质|AI_REVIEW_CONFLICT|明确能力粒度与反事实分歧后进行新一轮审查，或记录人工override；不可择一轮绕过冲突|
|实数 → 数轴|LOW_CONFIDENCE|明确能力粒度与反事实分歧后进行新一轮审查，或记录人工override；不可择一轮绕过冲突|
|函数的图像 → 函数图像的平移|MATHEMATICAL_DEFINITION_AMBIGUOUS, DECISION_REVIEW_REQUIRED|限定冻结节点的函数变换适用范围或补充教材/数学定义证据，再重新审查|
|函数的图像 → 函数图像的伸缩|MATHEMATICAL_DEFINITION_AMBIGUOUS, DECISION_REVIEW_REQUIRED|限定冻结节点的函数变换适用范围或补充教材/数学定义证据，再重新审查|

图像平移与伸缩的2A证据来自B1 236/PDF243的正弦语境，本轮没有扩写完整内容。实数→数轴也没有因可见性或连通性获Strong批准。

## 数学判断与结构判断分离

教材位置证明知识存在与范围，不证明依赖方向。定义与反事实产生初评，独立审查处理MEDIUM；结构检查在质量门之后执行。移除3条传递提案（集合→函数概念、函数概念→同一函数判定、函数概念→描点），均有现存替代Strong路径；另外2条REMOVE来自数学必要性否定。
正式送入质量门的概念定义由function-dependency-definitions.ts提供，逐项写明量词、定义域、公式与适用范围；firstAssessment保留初评的能力描述。这些是依赖审查所需的简短定义，不是Phase 2C详细课程内容。
所有61条提案与两轮意见均保留。结构图仅物化40条KEEP_STRONG与11条DOWNGRADE_TO_WEAK。Weak默认隐藏且不影响解锁。

## 冻结记录

P2A Node seed：0c9a8f321028503046b2d79fa0c02cc24bb38b3f16be8d19d14055ceae06a236。
P2A Ontology：a42a00b1e41578a0ceece5bf5b7774411a0019df691eb784bf9b21e1b35f689a。
P2A Mapping：42965ec802bb2b7e17abf8e3ca77d4e3582307bedbab5e7009810b119ed198ea。
P1 fixture：70919239d49b2c12abce194785bd5161cb1b0919a1749cf214c207ec0c0ba782。
P1审核记录文件：8bef56a0db920f8a492b6082276a6cb86b6c9ae817be2d87b21ca5f6c10f08a4。
这些为文件哈希，不是数据库快照。本轮没有读写线上审核记录。

## 验证

typecheck、lint、build通过；全套Vitest 59 passed / 1 skipped，新增P2B测试19项（其中10项解锁场景、5项路径场景）。
模拟使用生产共用的statusOf、strongAncestors、projectStatuses；全关系路径另用findKnowledgePath的includeWeak参数，与解锁索引隔离。未切换在线seed，未声称浏览器已呈现P2图。
P2B停止；不进入2C、不生成完整Detail Content、不创建AIGC/World Map、不部署。
