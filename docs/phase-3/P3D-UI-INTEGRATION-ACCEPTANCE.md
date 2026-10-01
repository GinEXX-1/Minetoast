# Phase 3D — Function Graph UI Integration

状态：`CONDITIONAL PASS`，2026-10-01。仅覆盖本地函数知识世界；不表示生产发布或教学内容审核。

## 已接入

- 32 个既有 Active Node 均使用 P3B 九态 Frame 与 P3C MathCraft Icon，按 Phase 2 原有 importance / Key 标记映射等级。`REVIEW_REQUIRED` 保留独立叠加标记。
- Strong 正交主路径；未完成为断续暗线、source 已掌握为实线亮线。Weak 默认隐藏，启用后为更细的点状线。没有修改任何 Dependency 或进度算法。
- 主画布、7 Module Tab、搜索、路径、进度、Mini Map、Detail Drawer 统一为方框 / 硬阴影语言；知识正文和 KaTeX 保留高可读排版。搜索结果加入图标、名称、Achievement 与状态文本。
- Hover / Focus 显示 Canonical Name、Achievement、状态、一句 Overview；可键盘聚焦 Frame 并用 Enter / Space 激活。窄屏保留画布平移/缩放，隐藏 Mini Map，可使用 Fit View。
- 自动布局尺寸在函数界面单独配置为 100×100，其他图谱调用维持原布局默认值。没有变更 Phase 2 图谱数据。

## 验证

- `pnpm build` 通过。
- `tests/e2e/phase2d-world.spec.ts` 与 `tests/e2e/phase3d-integration.spec.ts` 覆盖 32 节点、5 Key、40 Strong / 51 全关系、搜索、解锁、路径、详情、持久化、键盘操作和 390px 布局。
- 视觉检查：[32 节点全图](../../assets/phase-3/p3d-full-graph-overview.png) / [搜索聚焦](../../assets/phase-3/p3d-live-world-desktop.png) / [窄屏](../../assets/phase-3/p3d-live-world-mobile.png)。截图是实现状态，不是最终美术定稿。

## 条件与局限

- 全 32 节点 Fit View 的缩放约 0.28：可辨等级和状态，不能直接阅读名称或小尺寸 Icon。用户需 Hover、搜索 Fly-to、Module 聚焦或手动缩放。这符合 P3A 的“概览与局部阅读分层”，但须在真实用户测试中验证路径辨读效率。
- 正交折线路由目前不做碰撞避让，密集汇聚层的边可能重叠；图谱精确关系可由 Detail Drawer 核对。若后续重排，不能改变数学依赖。
- P3E 的成就通知、路径能量与合成音效另见 `P3E-FEEDBACK-ACCEPTANCE.md`；P3D 本身只验证静态界面与交互兼容。
