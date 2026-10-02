# 首批思索与设置验收

核对日期：2026-10-03（Asia/Shanghai）。范围：用户批准的首批全部节点，以及 Minecraft 风格设置、日间模式。产品不接入 AI 生成或 AI 审核服务。下一批提案中的 10 个候选仍待用户批准。

## 首批实际覆盖

审核清单中的“极大值与极小值”对应两个真实节点，因此新增 11 个场景；加原有 8 个，当前共 19 个节点具有思索入口。

| 节点 | 实际节点 ID | 场景 ID |
|---|---|---|
| 直线与平面平行的判定 | HS-GEO-LINE-PLANE-PARALLEL-001 | line-plane-parallel |
| 平面与平面平行的判定 | HS-GEO-PLANE-PLANE-PARALLEL-001 | plane-plane-parallel |
| 直线与平面所成角 | HS-GEO-ANGLE-LINE-PLANE-001 | line-plane-angle |
| 二面角 | HS-GEO-DIHEDRAL-ANGLE-001 | dihedral-angle |
| 正弦函数图象 | HS-TRIG-SIN-GRAPH-001 | sine-from-circle |
| 正弦型函数参数 | HS-TRIG-SINUSOIDAL-FAMILY-001 | sinusoidal-parameters |
| 平均变化率 | HS-CALC-RATE-OF-CHANGE-001 | average-rate |
| 导数与单调性 | HS-CALC-MONOTONICITY-CRITERION-001 | derivative-monotonicity |
| 极大值 | HS-CALC-LOCAL-MAXIMUM-001 | local-maximum |
| 极小值 | HS-CALC-LOCAL-MINIMUM-001 | local-minimum |
| 向量数量积 | HS-VECTOR-DOT-PRODUCT-001 | vector-dot-product |

场景标题使用课程 fixture 的 canonicalName；表中短名用于定位。声明式场景定义位于 `content/ponder/batch-one.ts`，无节点特定的渲染器分支。

## 逐项需求与证据

| 要求 | 实际行为 | 当前证据 |
|---|---|---|
| 首批全部适配 | 每个真实节点可从详情进入、播放、暂停、操作参数、逐步观看完成并返回 | `tests/e2e/ponder-batch-one.spec.ts` 11 项通过；每个场景 night/day 截图 |
| Minecraft 设置 | 像素字体、石质凸边按钮、居中“选项”、双列菜单、底部“完成”，小屏改单列 | `evidence/settings-{night,day}-{1440,768,390}.png`；设置 E2E 三宽度按钮均在视口内，无横向溢出 |
| 舒适阅读 | 全局保存偏好，文字与行距增加，思索播放速度乘 0.65 | 设置持久化 E2E、实际 Focus 和 CSS 实现 |
| 节点重置 | 九体系、全部思索记录、全部本机记录；确认/取消、关闭设置前撤销；不修改服务器进度 | 设置作用域 E2E、跨体系当前路径保持 E2E |
| 完整撤销 | 还原记录、观看步骤、完成状态、实验参数；保持暂停 | 新增 11 场景 E2E 比较重置前后整个存储字符串，确认非仅 principleViewed 相等 |
| 账户 | 使用现有服务真实注册、登录、会话刷新、退出；同步旧账户图谱的查询缓存 | 隔离数据库中的账户全流程 E2E；请求保持 same-origin，退出使用 CSRF |
| 线条颜色 | 四组原生颜色输入、统一二维/三维主体颜色、自动日夜配色、恢复默认 | 真实 SVG stroke 及刷新后持久化 E2E；三维 prefs→frame 材质更新代码审核、实际浏览器 3D 日间截图 |
| 日间模式 | 白色主背景，绿色主题、石质边框；首页、体系、详情、思索、设置和账户图谱均有日间样式 | 首页三宽度截图、11 个场景 day 截图、实际浏览器二面角和账户图谱检查 |
| 可读性 | 日间公式深色、默认线条深色；未禁用首页筛选文字对比度 ≥4.5:1 | 日间公式截图；三个宽度实际 computedStyle 对比度 E2E，等待已有 140ms 色彩过渡完成 |
| 学习状态隔离 | 观看和参数操作只更新 kw:ponder 记录 | 每个新场景完成前后比较非 ponder 本机记录；数据库隔离集成测试 |

设置偏好保存在 `kw:settings:v1`。课程体系与思索观看记录仍在当前浏览器，不因为账户登录而自动云同步。打开思索中的设置会暂停播放，返回后由用户继续。

## 验证结果

- `pnpm build`、`pnpm lint`、`git diff --check` 通过。
- `pnpm test`：23 文件通过，120 测试通过，1 跳过。
- 场景、设置、原有思索、动态偏好和性能的联合浏览器回归：34 项通过；随后修复重置问题的 11 场景与 6 设置联合回归：17 项通过；新增路径与对比度检查后的设置回归：7 项通过。这些是不同轮次，不能相加作为独立测试数量。
- `pnpm ponder:validate`：19 场景，0 数学冒烟问题。
- `pnpm ponder:gate`：退出码 1，19 场景均为 REVIEW_REQUIRED；缺少完整外部教材与发布签审，未伪造 PASS。
- `evidence/playback-performance.json`：本地 Chromium 1440×900，90 次数学几何更新，约 60.11 次/秒，RAF 中位 16.7ms、P95 16.8ms。只代表该本地测量窗口，不代表 GPU 呈现 FPS 或所有设备性能。

## 审核修复与限制

已修复极值说明中的“零点附近”为“x=0 附近”、撤销重置丢失 lastStep，以及重置无关体系时清除当前路径。独立审查补充见 `PONDER-INDEPENDENT-REVIEW.md`。

真实浏览器截图 `evidence/dihedral-day-actual-browser.jpg` 已重新核对为二面角 4/5 自由开合，包含 WebGL 平面、射线和圆弧。二维日间公式截图为 `evidence/batch-sine-from-circle-day.png`。

本次为本地实现及验收，没有生产部署。低端 GPU、手机三维实机、真实屏幕阅读器、WebGL 上下文丢失恢复仍缺少实机证据。固定曲线采样不自动证明未命中极点的分段正确性；当前场景使用连续函数。正式教材逐页签审与生产发布仍需独立执行。
