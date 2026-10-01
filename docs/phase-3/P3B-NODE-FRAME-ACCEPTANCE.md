# Phase 3B — Node Frame Acceptance

此文保留 2026-09-27 的 P3B 阶段验收结论；其中“未进入 P3C / 未完成 UI 集成”是当时状态。当前阶段状态见 [Phase 3 总验收](./PHASE-3-FINAL-ACCEPTANCE.md)。

结论：`CONDITIONAL PASS`。日期：2026-09-27。九态系统已可复用并在 32 节点真实图谱预览中验证；**未进入 P3C**。此结论只适用于 P3B Frame，不表示整套 Minecraft-style UI 已改版。

|验收项|结果|证据 / 边界|
|---|---|---|
|1. 三等级清楚可辨|`PASS`|72/80/88 px + 单边/双内衬/特殊四角；[对照板](../../assets/phase-3/node-frames/p3b-9-state-board.png)|
|2. 三状态清楚可辨|`PASS`（静态板）|亮度、上沿模式、右侧空心/双横/实心标记；[灰度板](../../assets/phase-3/node-frames/p3b-9-state-board-grayscale.png)|
|3. Level 与 State 独立|`PASS`|`frameLevelFor` 只读节点元数据；预览状态映射单独建立|
|4. 九组合完整|`PASS`|同画布九格，E2E 逐格断言|
|5. 不依赖正式 Math Icon|`PASS`|九格完全相同的 48×48 占位 SVG|
|6. Minecraft-style 方块语言|`PASS`（视觉方向）|整数像素边、方形槽、硬阴影；无圆卡、徽章、水晶或平滑饰纹|
|7. 无原始游戏资产复制|`PASS`（本实现范围）|Frame 为项目 CSS/整数 SVG，未引入第三方游戏图片/纹理；不作广泛相似性或法律保证|
|8. 50% Zoom 可区分主要等级|`PASS`（目视）|[50% 实图](../../assets/phase-3/node-frames/p3b-graph-50.png)中 Normal/Core/Key 框体尺寸和层数仍可辨；细节阅读需 Hover/聚焦|
|9. 32 节点不产生严重噪声|`PASS`（1440×900 测试视口）|[Fit View](../../assets/phase-3/node-frames/p3b-graph-fit.png) 为约 57% 缩放，40 条 Strong Edge 仍可追踪；其他视口待 P3D 验证|
|10. 交互 Overlay 不污染永久状态|`PASS`|Hover/Selected/Focus 只改外轮廓；E2E 测 Selected/Focus，`data-level` / `data-state` 不变|
|11. 可扩展到 350+|`CONDITIONAL`|组件 O(1)/节点、无九张 PNG，架构可复用；未测 350 节点全图的布局/帧率/内存|
|12. Phase 2 语义未修改|`PASS`|预览展示覆盖不读写进度；Phase 2D E2E 4 项回归通过|

验证：`pnpm lint` 通过；`pnpm test` 为 68 passed / 1 skipped；`pnpm build` 通过；P3B 与 Phase 2D 浏览器 E2E 共 6 项通过。截图由浏览器测试生成，不是手绘的预期效果图。`agent-browser` CLI 在本机不可用，改用仓库现有 Playwright 环境进行实机渲染与断言。

## 未关闭事项

1. 350+ 节点压力测试尚未执行；在更大领域接入前，应测布局、交互帧率、内存及语义缩放。
2. 目前只做 Chromium/桌面视口的视觉审阅；色觉、低视力、屏幕阅读器和窄屏的完整人工验证留待 Full UI Integration，不可由 ARIA 属性存在推断为完全可访问。
3. P3B 预览通过“同一占位符”验证 Frame，本阶段**没有**生成正式 MathCraft Icons，也没有替换 `/function-world` 的 Phase 2D 界面。

因此判定 `CONDITIONAL PASS` 而非无条件 `PASS`。保持 P3A 规范冻结；本轮停止，不自动进入 P3C、Full UI Restyle、Motion、Audio 或生产部署。
