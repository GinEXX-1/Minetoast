# Phase 3E — Feedback, Motion, Toast and Sound

状态：`CONDITIONAL PASS`，2026-10-01。已完成本地界面实现及自动化验证；听感与真实学习场景尚待人工体验确认。

## 反馈时序

1. 用户触发节点解锁；Phase 2 原有进度逻辑先核验 Strong 前置，失败不播放成功反馈。
2. 目标 Frame 以约 720ms、5 阶硬边亮度与尺度变化反馈；六枚小方形粒子向外消散。
3. 若目标使后继从 Locked 变成 Available，相关 Strong 边在约 380ms 后以阶梯能量段传播，后继 Frame 唤醒；Weak 无此反馈。
4. 普通知识解锁显示带该节点 MathCraft Item、正式名称与 Achievement Name 的方形 Toast；Key Achievement 使用稀有材质框和“关键成就达成”。通知 3 秒自动退出，不阻塞交互。
5. 详情 Dialog 打开时，Toast 显示于 Dialog 内顶部，避免浏览器 top-layer 遮罩盖住通知；关闭 Drawer 后仍能看到剩余通知。
6. 声音默认关闭。用户主动开启后使用 Web Audio 在运行时合成短双音或三音提示；无外部音频文件、游戏采样或持久化自动播放。音频 API 失败不影响知识解锁。

## 可访问与退化

- `prefers-reduced-motion: reduce` 禁用帧、边、Toast 动画；状态文本、图标和进度仍保留。
- Toast 容器为 `aria-live="polite"`，每个解锁反馈含文字，不以颜色、声音或动态作为唯一信号。
- 快速初始化不伪装成一次普通节点解锁；只显示“知识地图已生成”的通知。

## 验证和边界

- `tests/e2e/phase3e-feedback.spec.ts` 检查普通解锁 Toast、Strong 能量时效、Key 文案、Dialog 内可见性、低动效与默认静音。
- [Key Achievement + Drawer 截图](../../assets/phase-3/p3e-key-achievement.png)。
- 当前动效是 CSS / Web Audio 设计资产，不修改 Phase 2 本体、依赖、教材、Detail 或进度存储结构。正交线交叉与声音主观适配仍需使用测试，不能由自动化宣称完全解决。
