# Knowledge Node Detail Content Schema

更新：2026-09-25。Phase 2C 候选内容契约；它是独立的 authoring/display schema，不替换 Phase 0 `KnowledgeNode`、数据库 schema 或 Phase 1 正式快照。

## Identity and scope

`identity.nodeId` 必须精确匹配 Phase 2B active graph ID。候选集不得包含 ontology-only external references、pending scope、retired 或 review-only nodes。`achievementName` 从冻结 ontology 原样读取；如有语义疑问写入 `CONTENT-ONTOLOGY-ISSUES.md`，不在内容层静默重命名。

## Fields

|字段|类型|要求|
|---|---|---|
|`identity`|nodeId、knowledgeName、achievementName、englishName|稳定 ID 与冻结 ontology 名称|
|`overview`, `definition`|string|短概述与有范围的数学定义；避免把课本语境扩大成完整来源证明|
|`coreConcepts`|string[]|节点特定的概念区分|
|`formulas`|id、latex、explanation、conditions|KaTeX 支持；`trust:false`；必须通过解析校验|
|`properties`|string[]|重要性质/推理要点|
|`intuition`, `derivation`|string|直觉与可核查的推理/论证路径|
|`skills`|string[]|可观察的学习技能|
|`examples`|problem、recognition、reasoning、calculation、answer、insight|完整解题过程；数量按节点需要，不强行同质化|
|`gaokaoPatterns`|string[]|题型/考查任务归纳，标识为教学补充而非教材原文|
|`commonMistakes`|mistake、why、correction|具体错误、成因、修正步骤|
|`relationships`|incoming/outgoing `DetailRelationship[]`|仅由 Phase 2B 已启用候选图生成，包含边型和 rationale|
|`textbookReferences`|卷、章、节、小节、双页码、sourceRef、证据范围|唯一来源为本地 Canonical Corpus 和 `FUNCTION-TEXTBOOK-MAPPING.md`；两类页码独立保存|
|`metadata`|importance、difficulty、contentStatus、evidenceStatus、gateStatus、confidence|候选状态和局部质量判断，不表示获准发布|
|`searchTerms`|string[]|由冻结名称/别名与节点特定检索词组成，支持中文、拼音、首字母、英语、符号和学生用语|

## Quality gate

`PASS` 仅用于内容完整且直接教材证据范围清楚；`PASS_WITH_WARNING` 表示可用于候选预览但须保留证据范围警告；`REVIEW_REQUIRED` 表示内容或事实存在实质性未决问题。Confidence 独立于 Gate 状态。LOW、冲突、定义歧义或实质错误应为 `REVIEW_REQUIRED`；MEDIUM 按既定规则需第二轮独立 AI review。状态都不自动发布内容。

校验器覆盖 ID 集合一致性、重复/空字段、KaTeX 解析、教材定位、关系端点和边型与 frozen graph 一致性、搜索检索面。图结构 Validator 仍只做结构检查，不作为数学内容质量判断。
