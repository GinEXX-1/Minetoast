# Phase 1 工程交付与验收记录

日期：2026-09-19。环境：macOS arm64 / Apple M2，Node 24.14.1，pnpm 11.19.0，PostgreSQL 18.6，Chrome 153.0.8010.48。

## 结论

工程切片已实现并完成本地自动化验证；**完整 Phase 1 不标记为完成**。P1-04 的 Canonical 教材定位已建立，但 31 条依赖尚未完成 Knowledge Dependency Quality Gate 输出（五类输入、置信度与 AI Review），P1-14 因此不能整体签收。测试样本保持 `REVIEW_REQUIRED`，生产 setup 拒绝自动导入样本。未部署、未推送远端、未创建生产可登录管理员。

## 按原始流程核对

|项|实施与证据|状态|
|---|---|---|
|P1-01|精确依赖、lockfile；临时空目录 frozen/offline 安装；Node 24；CI 工作流|本地通过；远端 CI 未执行|
|P1-02|PG18 临时 Unix socket 集群；幂等 DDL；migration_owner/learning_api/content_admin；真实受限连接注册与保存|通过|
|P1-03|索引、状态投影、强祖先、To/From/Between、结构校验；30 个固定种子 DAG 与独立传递闭包对照|通过|
|P1-04|17 个高中 + 3 个初中节点；原创说明/例子；Canonical 教材位置和 31 条边 rationale；逐项风险清单|**未通过：未生成质量结论、confidence 与所需 AI Review；不再以逐项人工签审为硬条件**|
|P1-05|最小 JSON 管理台；新建/编辑、version、审核失效、审核说明；发布/回退、只读历史、审计；布局与素材元数据接口|工程测试通过；真实内容发布仍被门禁阻断|
|P1-06|账户、Argon2、会话、CSRF、来源校验、限速、学生/管理员/游客边界|通过现有授权与账户测试|
|P1-07|head→progress 锁序、原子命令、幂等重试、revision、撤销不级联；中途事件故障注入回滚|通过|
|P1-08|领域导航、详情、KaTeX 延迟加载、声音开关；桌面与窄屏；按发布版本读取详情|浏览器回归和截图检查|
|P1-09|独立 ELK Worker、有限缓存、取消/忽略旧任务、人工覆盖与碰撞警告、MiniMap/Fit/Fly-to|通过|
|P1-10|全部别名类别、符号归一化、精确/前缀/包含/单编辑距离；三类路径；跨域 Portal 仅导航|单元与跨域浏览器测试通过|
|P1-11|原创 CSS 单区域地图；归一化地标、缩放/入口；与树共用账户进度，初中不计高中|通过|
|P1-12|150ms 快速点击去重合批、每批最多 25 个目标；初始化无 Toast；正常确认解锁最多 3 条反馈，静音/减少动态效果|快速初始化及偏好测试通过|
|P1-13|严格备份格式/体积/数量；预览与 merge；跨版本稳定 ID、合法稀疏集合、未知/退休 ID 阻断|通过|
|P1-14|真实 PG 并发/权限、浏览器、400 节点压力与 trace、截图；教研签审独立保留|自动化部分通过；整体待教研验收|

## 已执行验证

- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `pnpm test`：32 passed，1 skipped。跳过项是仅原生 PG 执行的角色测试，不是数学审核。
- `pnpm test:pg:isolated`：20/20，原生 PostgreSQL 18.6；包含运行时拒绝权限和合法注册/解锁。
- `pnpm test:install`：全新临时目录、无现有 node_modules、离线复用包缓存、frozen lockfile 通过；315 个包，无联网下载。
- `pnpm build`：通过；主 JS 约 447 kB，KaTeX 约 261 kB 独立延迟加载，Worker 独立产物。
- `PLAYWRIGHT_CHANNEL=chrome pnpm exec playwright test`：最终 7/7 通过（2026-09-19 20:41 CST）；针对已构建 production bundle 和独立临时数据库。
- `pnpm audit --prod --registry=https://registry.npmjs.org`：当次未报告已知漏洞，不等于永久或全面安全证明。

上述本地结果不等价于远端 CI 已运行。CI 使用 PostgreSQL 18 service 与 Chromium，性能受宿主影响，失败时应保留证据，不降低阈值掩盖回归。

## 性能与视觉证据

压力图为 400 合成节点/1,140 Strong 边，不混入真实数学内容。5 次冷页面布局；拖拽期间 rAF 采样；每种 CPU 设置 30 次输入事件到第二个 rAF 的延迟。帧采样是主线程近似指标，不是 GPU presentation FPS。

基准要求：正常桌面布局 p95≤1s、输入 p95≤100ms、拖拽中位≥50 FPS；CPU 4× 单独检查无连续 >200ms 阻塞。低端模式的单次长任务与输入延迟仍原样记录，不能以正常模式结果代替。

最终原始结果和截图保存于 `docs/evidence/phase1/`。完整 CPU 4× Chrome trace 在 `test-results/performance-400-node-synthetic-DAG-performance-record/cpu4x-browser-trace.json`，下次跑测试会重新生成，CI 会上传 test-results。

本次结果：布局 p95 599.6ms；拖拽 rAF 中位 59.88 FPS（224 帧）；正常输入 p95 38.7ms（30 次）。CPU 4× 输入 p95 126.9ms，有一次 553ms 长任务，没有连续 >200ms 阻塞；这不代表低端设备始终流畅。原始数据见 [performance.json](evidence/phase1/performance.json)，截图：[桌面](evidence/phase1/desktop.png)、[移动端](evidence/phase1/mobile.png)、[管理台](evidence/phase1/admin.png)、[地图](evidence/phase1/map.png)、[压力图](evidence/phase1/performance.png)。

截图复核曾发现窄屏“节点在 DOM 但画布零高度”的漏测，已修复尺寸约束并增强断言为：画布高度 >300px、MiniMap 可见、Fly-to 后节点入屏。移动端全图 Fit 会缩小文本，应使用搜索/Fly-to/详情阅读；没有声称全图微缩文字可读。

## 关键工程取舍

- 图谱是不可变快照；草稿不能改变学生实时依赖。全局 head 锁简化 Phase 1 的发布/进度并发正确性，但会串行化内容写入；不适合高频多人 CMS。
- 索引构建、状态投影和有向遍历为 O(V+E) 时间及 O(V+E) 空间；发布阶段传递冗余验证为 O(E(V+E))；人工坐标碰撞检查最坏 O(V²)。本轮压力范围为 400 节点，不承诺无限规模。
- 数据库运行角色按服务能力分离；逐用户授权由 API 会话决定，未启用 RLS。密码、会话、userId/role 不接受导入备份覆盖。
- 使用系统字符、原创 CSS 地图及 Web Audio 短音占位，不下载第三方图像/声音。素材登记是元数据和审核记录，不是上传存储服务。
- React 检查清单促使隔离画布子树、将缩放读数订阅缩小到图例，并拆出按需加载的 KaTeX；输入不再使整张图随搜索框更新。
- 手工测试/合成审核只存在临时数据库；仓库中的节点与依赖没有因此变为 APPROVED。

## 剩余阻断与交接

1. 按 [教材质量包](textbook/TEXTBOOK-REVIEW.md) 核验版本、章节、必要时页码；为每条边补全教材证据、数学定义、反事实、结构上下文与 rationale。
2. 对 HIGH 结论保留可审计质量输入；对 MEDIUM 运行两次独立 AI Review；将 LOW、证据冲突、定义歧义和 AI 冲突保留为 REVIEW_REQUIRED。Graph Validator 不能替代这些判断。
3. 人工可抽检或记录 override；通过质量门后再使用管理台校验、发布。生产部署是独立操作，当前未执行。

运行方式、独立预览目录、角色配置和管理员创建见 [运行手册](OPERATIONS.md)。所有个人数据均保留；本轮只清理了自己创建的临时测试库、临时安装目录。Homebrew 安装 PG18 时执行了其自动缓存/旧版本清理，未启动常驻数据库服务。
