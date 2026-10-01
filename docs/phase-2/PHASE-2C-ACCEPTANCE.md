# Phase 2C Acceptance

更新：2026-09-25。交付范围止于 Full Knowledge Detail Content；不开始 Phase 2D。

|验收项|结果|证据|
|---|---|---|
|Phase 2A/2B/P1 冻结|PASS|只读导入冻结 ontology、候选 graph、教材 mapping；未修改其内容|
|Active IDs 与内容集精确一致|PASS（执行验证后确认）|`function-details.test.ts` 比较 active graph ID 与 32 detail ID|
|32 个 detail 结构覆盖|PASS（执行验证后确认）|Schema、数据 fixture、运行时校验及单测|
|教材 evidence 与双页码|PASS_WITH_WARNING|32 个引用由本地 ontology mapping 复制；2 个 partial evidence 标记 LOW / REVIEW_REQUIRED 隔离|
|公式 KaTeX 解析|PASS（执行验证后确认）|fixture validator 与 KaTeX parse test|
|搜索覆盖|PASS（执行验证后确认）|中文/拼音/首字母/英语/数学符号/学生词汇 tests|
|Detail Drawer / 图谱关系|PASS（手动浏览器 smoke）|`/?phase=2c` 隔离详情页；关系由 enabled candidate edges 投影；自动 Playwright 因缺少 Chromium 未运行|
|内容 review|PASS_WITH_WARNING|30 项 HIGH/PASS；2 项 LOW/REVIEW_REQUIRED 已隔离，不阻塞其他内容|
|生产/API/database/deploy|未执行|默认 Phase 1 不变；preview 不调用 API|
|Phase 2D|未开始|无视觉资产、全图扩张、部署或生产发布|

总体状态：**CONDITIONAL PASS**。该状态允许其余已通过内容继续留在候选集，不授权发布、扩充或改变冻结节点/边；数轴和坐标系两个内容记录因证据范围不完整而为 `REVIEW_REQUIRED`，不自动成为 Strong Edge 且不阻塞其他 30 项。浏览器自动化待安装 Chromium 后再执行；手动浏览器 smoke 已确认详情和 KaTeX。
