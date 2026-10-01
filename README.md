# 高中数学 Knowledge World · Phase 1

状态：Phase 1 工程切片已实现并进入验收，**完整 Phase 1 尚缺 Knowledge Dependency Quality Gate 结论**。20 个节点与 31 条依赖仍为 `REVIEW_REQUIRED`，不会伪造质量结论或自动正式发布。当前证据见 [验收记录](docs/PHASE1-DELIVERY.md)，教材与依赖质量包见 [TEXTBOOK-REVIEW.md](docs/textbook/TEXTBOOK-REVIEW.md)。

## 知识体系目录

当前前端目录已接入 9 个独立知识世界，共 350 个唯一节点 ID：32 个函数正式节点与 318 个跨图去重后的候选节点。九个体系均已通过体系级审核；其中八个专题体系的节点内容仍按候选数据管理，不代表 318 个候选节点已逐条完成教研签审或晋升为正式发布节点。八个专题页包含 319 个节点入口，其中“集合的概念”与函数图共用一个稳定 ID。首页和各专题页支持搜索/定位、Strong 路径高亮、Pan/Zoom、Mini Map、本机学习进度及首次点击前置批量点亮。

## 本阶段已实现

- Locked / Available / Unlocked 三状态实时计算。
- Strong 依赖参与解锁，Weak 依赖默认隐藏且不影响解锁。
- Strong 连线只显示 `✅` 或 `❌`；Weak 连线开启后以虚线显示，不增加文字标签。
- XYFlow 画布：Pan、Zoom、Mini Map、Fit View、Fly-to。
- 点击节点：初始化模式可批量点亮全部 Strong 祖先；正常模式中 Available 节点解锁，Locked / Unlocked 节点打开详情。
- 用户名和密码账户、HttpOnly 会话、CSRF 校验、账户隔离、数据库进度保存。
- 非级联撤销：将一个节点标记为未掌握，不会删除已解锁的后继节点。
- KaTeX 公式展示、游客浏览、窄屏基本适配。
- 全字段别名/拼音/数学符号搜索；To、From、Between 有向路径；跨域 Portal 投影。
- 单区域地图、缩放、地标与知识树共享进度。
- 150ms 快速初始化合批；正常解锁最多 3 条反馈；静音与减少动态效果。
- 备份导出、严格格式预览、事务 merge；不擅自补齐缺失前置。
- 管理员草稿编辑、依赖质量记录与人工 override、发布门禁、审计、只读历史与回退。
- Worker 布局缓存、人工坐标覆盖与碰撞警告；公式组件延迟加载。
- 原生 PostgreSQL 18 迁移、角色分离、事务失败注入与并发测试。

## 本地运行

需要 Node.js 24 和 pnpm。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

然后打开 `http://localhost:4173`。`pnpm dev` 使用服务端磁盘持久化的 PGlite 测试适配器，数据保存在 `.data/knowledge-world`；它是 PostgreSQL 18 的 WebAssembly 构建，仅用于本地 Phase 1 验证。

使用原生 PostgreSQL 时：

```bash
cp .env.example .env
pnpm db:setup
pnpm dev:postgres
```

在 `.env` 中配置 `DATABASE_URL`，运行命令会加载它。生产环境必须使用原生 PostgreSQL 和独立 `ADMIN_DATABASE_URL`，不能设置 `DATABASE_MODE=pglite`。权限与管理员创建见 [运行手册](docs/OPERATIONS.md)。

## 验证

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:pg:isolated
pnpm test:install
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

若已安装 Chrome，可用 `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e`；测试使用独立临时浏览器会话和数据库。

浏览器测试针对生产构建，使用独立临时数据库，覆盖管理员门禁、账户学习闭环、快速初始化、搜索/路径、地图/备份、跨域 Portal 和移动端。性能用例记录 400 节点/1,140 条边及 CPU 4× trace。GitHub Actions 配置 PostgreSQL 18 及权限测试；本地通过不代表远端 CI 已执行。`test:pg:isolated` 默认查找 Homebrew PostgreSQL 18，其他安装可指定 PG_BIN。

## 关键文件

- `content/fixtures/function-slice.ts`：20 个测试节点和 31 条测试依赖。
- `packages/graph-core/src/index.ts`：状态、祖先闭包、图谱结构验证。
- `packages/database/migrations/0001_phase0.sql`：PostgreSQL 数据模型。
- `apps/api/src/app.ts`：账户、图谱和进度 API。
- `apps/web/src/main.tsx`：XYFlow 交互画布。
- `tests/`：图算法与账户进度集成测试。

## Phase 1 边界

Phase 1 API 验收仍使用独立的 20 节点测试切片；前端 350 节点目录是独立的课程图谱数据，不会自动替代 API 发布快照或 Quality Gate。九个知识体系已通过体系级审核；管理员界面是最小 JSON 编辑/质量工作台，不是全功能 CMS，逐节点的来源与依赖质量仍受各自发布门禁约束。
