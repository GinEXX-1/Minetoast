# Ponder Quality Gate

`pnpm ponder:validate`：执行结构/数学冒烟，更新 JSON Schema 与质量报告。不等于生产审核通过。

`pnpm ponder:gate`：严格发布门禁。只要有 FAIL 或 REVIEW_REQUIRED 就退出码 1。当前 19 个本地演示缺少完整外部教材与发布审核证据，所以预期 REVIEW_REQUIRED；这与用户批准首批本地适配是不同状态。

单场景：`node --import tsx scripts/ponder-gate.ts candidate.json evidence.json`。证据只从可信服务器或已审核文件输入；不能把学生客户端声明当成审核证据。场景 digest 使用解析后规范数据 JSON 的 SHA-256；任何数学/文字/步骤修改均使旧证据失效。当前没有生产发布 API，也没有用于绕过门禁的客户端自动发布路径。

九个维度：MATHEMATICAL_CORRECTNESS、PEDAGOGICAL_VALUE、REPRESENTATION_ACCURACY、DSL_VALIDITY、RENDER_VALIDITY、INTERACTION_VALIDITY、PERFORMANCE、ACCESSIBILITY、TEXTBOOK_ALIGNMENT。每维要求对应当前 digest 的 PASS/HIGH 审核，包含 reviewer、createdAt、issues 和可查证的 evidence。任一有效 FAIL 阻止发布。

此外要求独立 review 的 author 与 reviewer 不同，且当前 digest、decision=PASS、confidence=HIGH、有 evidence。审查者与创作者不同是必要条件，不保证审核质量；审核过程、证据和来源需要可追查。系统不内置假审核或自动批准。

schema/math runtime错误 → FAIL；缺少、低置信或过期证据 → REVIEW_REQUIRED；所有条件满足才 PASS。数值采样不能证明任意表达式/任意参数范围内的全部数学正确性，必须保留独立数学与教材审核。测试中的合成审核只验证门禁状态转换，不写入正式审核记录。

质量报告 `evidence/quality-report.json` 明确区分数值冒烟与独立审核。Ponder 状态绝不替换 Knowledge Dependency Gate 或知识发布状态。

按用户最新要求，产品不再包含 AI Planner 或 AI 审核依赖。独立审查元数据使用 strict Zod 校验，必须有当前 digest、author、不同的 reviewer、有效 createdAt、非空文字证据和 PASS/HIGH。数字身份、对象形证据、未知字段均不能通过。CLI 读取的 JSON 也执行相同校验。当前本地审核报告不伪造正式教材签审。
