# B1 Source Recovery Report

状态：已完成本次 B1 Source Recovery，待人工教研确认。日期：2026-09-19。

## 范围与未触碰项

本报告只处理新的 Canonical PDF：

```text
/Users/ginex/Documents/MineToast/textbooks/PEP-A/普通高中教科书·数学（A版）必修 第一册.pdf
```

未重新处理 B2–X3，未修改 Knowledge Graph、fixtures、数据库、边类型或生产数据；未发布，未进入 Phase 2。

## B1 文件身份、完整性与可读性

|检查项|结果|
|---|---|
|教材身份|题名页可见“普通高中教科书 数学 必修 第一册 A版”；编著机构为人民教育出版社课程教材研究所、中学数学课程教材研究开发中心；出版者为人民教育出版社。|
|文件标识|SHA-256：`06aaeee34262eb0d2661ba8fe3dc1a010828df9b1ac9498401b430fa869a17a9`。|
|技术可读性|PDF 1.7，270 页，未加密；可渲染，目录及正文可提取和逐页复核。|
|完整性警告|`qpdf --check` 以“operation succeeded with warnings”完成，报告一个流偏移警告；`pdftotext` 报告 `Unknown font tag 'TT0'`。二者未阻断题名、目录或正文定位，但应保留为技术复核项。|
|仍不可确认的书目信息|正式版次、印次、ISBN 均为 `REVIEW_REQUIRED`；不得用 PDF 技术元数据代替。|

目录页（`pdf_page` 6–7）与章节开页已交叉核验。B1 正文印刷页 1 对应 `pdf_page` 8，因此本次已确认正文目录条目均满足：`pdf_page = printed_page + 7`。两个页号字段始终分别保存，未混用。

## 索引恢复结果

- [TEXTBOOK-SOURCE.md](TEXTBOOK-SOURCE.md) 已将 B1 从历史损坏的拆分文件记录替换为当前单册可读 PDF。
- [TEXTBOOK-INDEX.md](TEXTBOOK-INDEX.md) 已恢复 B1 的 5 章、24 个节（共 29 个章/节稳定引用位置），包括 `PEP-A:B1:C1:S1.1` 至 `PEP-A:B1:C5:S5.7`。
- 未为目录未定义的正文细分标题虚构新的稳定 `source_ref`；这类标题只作为 `subsection` 说明，并附其实际双页号。

## 已恢复证据节点

以下 13 个节点已获得 B1 的 `DIRECT` 教材证据：

|node_id|knowledge_name|B1 定位|
|---|---|---|
|`HS-SET-CONCEPT-001`|集合的概念|`PEP-A:B1:C1:S1.1`，printed 2 / PDF 9|
|`HS-FUNC-INTERVAL-001`|区间表示|`PEP-A:B1:C3:S3.1`，printed 64 / PDF 71|
|`HS-FUNC-MAPPING-001`|对应关系|`PEP-A:B1:C3:S3.1`，printed 62 / PDF 69|
|`HS-FUNC-CONCEPT-001`|函数的概念|`PEP-A:B1:C3:S3.1`，printed 62 / PDF 69|
|`HS-FUNC-DOMAIN-001`|函数的定义域|`PEP-A:B1:C3:S3.1`，printed 62 / PDF 69|
|`HS-FUNC-RANGE-001`|函数的值域|`PEP-A:B1:C3:S3.1`，printed 62 / PDF 69|
|`HS-FUNC-VALUE-001`|求函数值|`PEP-A:B1:C3:S3.1`，printed 62 / PDF 69|
|`HS-FUNC-GRAPH-001`|函数的图像|`PEP-A:B1:C3:S3.1`，printed 67 / PDF 74|
|`HS-FUNC-MONO-001`|函数的单调性|`PEP-A:B1:C3:S3.2`，printed 77 / PDF 84|
|`HS-FUNC-PARITY-001`|函数的奇偶性|`PEP-A:B1:C3:S3.2`，printed 83 / PDF 90|
|`HS-FUNC-EXTREME-001`|函数的最大值与最小值|`PEP-A:B1:C3:S3.2`，printed 80 / PDF 87|
|`HS-FUNC-ZERO-001`|函数的零点|`PEP-A:B1:C2:S2.3`，printed 51 / PDF 58|
|`HS-FUNC-APPLY-001`|函数模型的简单应用|`PEP-A:B1:C3:S3.4`，printed 93 / PDF 100|

此前由 B1 不可读取导致的 `NO_LOCATED_EVIDENCE` 已恢复：函数定义域、值域、函数图像、奇偶性、分段函数求值均已定位。`SOURCE_UNREADABLE` 不再适用于当前 B1。

## 仍无直接教材证据节点

没有节点保持完全未定位（`NO_LOCATED_EVIDENCE`）。但下列 7 个节点只有 B1 `PARTIAL_CONTEXTUAL` 证据，尚无可覆盖当前节点全部定义、条件或粒度的直接位置：

|node_id|knowledge_name|已定位 B1 位置|直接证据缺口|
|---|---|---|---|
|`MS-NUM-REAL-001`|实数|`B1:C2:S2.1`，printed 38 / PDF 45|未给出有理数与无理数的完整定义。|
|`MS-ALG-LINE-001`|数轴|`B1:C2:S2.1`，printed 38 / PDF 45|未逐项定义原点、正方向、单位长度。|
|`MS-GEO-COORD-001`|平面直角坐标系|`B1:C1:S1.2`，printed 9 / PDF 16|仅为坐标系中的有序对集合应用，不是完整定义课。|
|`HS-FUNC-LINEAR-001`|一次函数的图像与性质|`B1:C3:S3.1`，printed 63 / PDF 70|未完整覆盖图像、斜率与变化方向。|
|`HS-FUNC-QUAD-001`|二次函数的图像与性质|`B1:C2:S2.3`，printed 50 / PDF 57|未完整覆盖顶点式与全部性质范围。|
|`HS-FUNC-SHIFT-001`|函数图像的平移|`B1:C5:S5.6`，printed 236 / PDF 243|证据限于正弦曲线的平移，未覆盖通用规则全部条件。|
|`HS-FUNC-PIECE-001`|分段函数求值|`B1:C3:S3.1`，printed 68 / PDF 75|有分段表达例，具体分支选择与求值规则仍须对照节点表述。|

## 页码无法确认项

本次 B1 的章/节目录页码和本报告所列节点证据页均已以双页号确认，没有以猜测填充的 `printed_page` 或 `pdf_page`。

以下并非“页码未知”，但仍需保留 `REVIEW_REQUIRED`：

- 正式版次、印次、ISBN；
- 目录未列为章/节的细分正文标题，不能自行生成稳定 `source_ref`；
- 技术完整性警告的出版方来源与修复状态。

## Strong Edge 复核与人工判断项

`TEXTBOOK-REVIEW.md` 已重新核验所有涉及 B1 节点的 Strong Edge 教材事实。所有 28 条 Strong Edge 的 `reviewer_status` 保持 `REVIEW_REQUIRED`；本次未决定 `KEEP_STRONG`、`DOWNGRADE_TO_WEAK` 或 `REMOVE`。

特别三条边的当前教材证据与原有 rationale：

|edge|教材证据|current_rationale|仍需人工教研判断|
|---|---|---|---|
|实数 → 数轴|`PEP-A:B1:C2:S2.1`，printed 38 / PDF 45：用数轴点与实数的一一对应规定实数大小关系。|用实数表示数轴上点对应的数。|该关联是否构成目标能力的必要解锁前置。|
|实数 → 集合|`B1:C1:S1.1`，printed 2 / PDF 9 以实数根为集合元素实例；`B1:C2:S2.1`，printed 38 / PDF 45 使用实数。|本切片使用实数集作为集合的具体对象。|教材没有把实数明确规定为集合概念的必要前置。|
|平面直角坐标系 → 对应关系|`B1:C1:S1.2`，printed 9 / PDF 16 在坐标系中使用有序对集合；`B1:C3:S3.1`，printed 62 / PDF 69 定义一般对应关系。|以有序数对帮助理解本测试中的数值对应。|B1 未直接把坐标系规定为一般对应关系的必要前置。|

每条 Strong Edge 现由 Knowledge Dependency Quality Gate 输出 `KEEP_STRONG`、`DOWNGRADE_TO_WEAK`、`REMOVE` 或 `REVIEW_REQUIRED`，并记录 confidence 与 rationale。人工可抽检或 override，但不再要求逐条签审；教材章节顺序、概念同页出现或案例使用均不是自动保留 Strong 的依据。

本次恢复到此停止。
