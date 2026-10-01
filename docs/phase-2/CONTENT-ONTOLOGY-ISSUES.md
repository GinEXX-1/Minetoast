# Phase 2C Content / Ontology Issues

更新：2026-09-25。本表是对 32 个 active node achievement name 的逐项内容呈现审阅记录。所有名称均保留 Phase 2A 冻结值；本轮没有改 ID、canonical name、achievement name 或边。

|node_id|achievementName|内容审阅观察|处理|
|---|---|---|---|
|MS-ALG-LINE-001|给数一个位置|形象表达；详情正文补上数轴的定义性要素，并明确本地高中教材只是语境证据。|保留；初中来源范围警告|
|MS-GEO-COORD-001|找到坐标|概念范围可能被理解为坐标读取而非坐标系定义。|保留；教材只作使用语境，不声称完整定义|
|HS-FUNC-RANGE-001|输出的疆域|比数学术语更隐喻，搜索与正文均优先使用“值域”。|保留；建议后续语言审核|
|HS-FUNC-EXTREME-001|高处与低处|无法独立表达“最大/最小值”及可达性。|保留；详情定义强调必须在定义域中取得|
|HS-FUNC-PARITY-001|对称的秘密|“秘密”偏修辞，未提供概念边界。|保留；正文以奇偶定义及定义域对称为准|
|其余27项|原冻结名称|逐项确认展示时保留 achievementName，同时 canonical name/节点 ID 不变。|PASS；列表严格由 active registry 自动迭代|

## Scope restrictions

- `MS-NUM-REAL-001` 是外部引用，不属于 32 个 active nodes，因此没有在本次内容集生成详情。
- `HS-FUNC-SHIFT-001`、`HS-FUNC-SCALE-001` 仍是 pending scope，不进入详情或搜索活动集。
- 任何 `REVIEW_REQUIRED` / `REMOVE` 依赖都不会成为详情中的 active relationship。
- 以上观察不授权重命名或扩大 ontology；改动需另行提出并重新审查冻结边界。

## Full active achievement-name checklist

以下 32 项逐项核对并与 Phase 2A frozen ontology 对照；只记录名称，没有在 Phase 2C 改写。

|node_id|achievementName|canonicalName|
|---|---|---|
|MS-ALG-LINE-001|给数一个位置|数轴|
|MS-GEO-COORD-001|找到坐标|平面直角坐标系|
|HS-SET-CONCEPT-001|收集与分类|集合的概念|
|HS-ALG-INEQUALITY-001|比较的规则|不等式的性质|
|HS-FUNC-INTERVAL-001|读懂范围|区间表示|
|HS-FUNC-MAPPING-001|输入与输出|对应关系|
|HS-FUNC-CONCEPT-001|唯一的回应|函数的概念|
|HS-FUNC-DOMAIN-001|输入的边界|函数的定义域|
|HS-FUNC-RANGE-001|输出的疆域|函数的值域|
|HS-FUNC-VALUE-001|代入与计算|求函数值|
|HS-FUNC-IDENTITY-001|辨认同一个函数|同一函数的判定|
|HS-FUNC-ANALYTIC-001|写出对应规则|函数的解析表示|
|HS-FUNC-TABLE-001|用表格记录关系|函数的列表表示|
|HS-FUNC-GRAPH-001|把关系画出来|函数的图像|
|HS-FUNC-PIECEDEF-001|一条规则分段写|分段函数的表示|
|HS-FUNC-PIECE-001|选择正确的路|分段函数求值|
|HS-FUNC-REPRESENT-001|在三种语言间转换|函数表示法的转换|
|HS-FUNC-MONO-001|变化的方向|函数的单调性|
|HS-FUNC-MONOPROOF-001|证明变化方向|用定义证明单调性|
|HS-FUNC-MONOINTERVAL-001|找出变化区段|求函数的单调区间|
|HS-FUNC-EXTREME-001|高处与低处|函数的最大值与最小值|
|HS-FUNC-PARITY-001|对称的秘密|函数的奇偶性|
|HS-FUNC-SYMMETRY-001|从图象读出对称|函数图像的对称性|
|HS-FUNC-LINEAR-001|直线的方向|一次函数的图像与性质|
|HS-FUNC-QUAD-001|抛物线之谷|二次函数的图像与性质|
|HS-FUNC-RECIPROCAL-001|双曲线的两支|反比例函数的图像与性质|
|HS-FUNC-POWER-001|比较幂的形状|幂函数的图像与性质|
|HS-FUNC-PLOT-001|让点组成图象|描点法作函数图像|
|HS-FUNC-ZERO-001|与横轴相遇|函数的零点|
|HS-FUNC-ZEROEXIST-001|确定零点所在区间|函数零点存在定理|
|HS-FUNC-BISECTION-001|逐步缩小范围|二分法求零点近似值|
|HS-FUNC-APPLY-001|连接真实问题|函数模型的简单应用|
