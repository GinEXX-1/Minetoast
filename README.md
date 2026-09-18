# 高中数学 Knowledge World · Phase 1

状态：Phase 1 部分功能验证切片（partial vertical slice），尚未完成完整 Phase 1 验收。只包含 20 个测试知识节点；测试内容与依赖均标记为 `REVIEW_REQUIRED`，不能作为正式教研结论。当前验收状态见 `docs/REMEDIATION.md`。

## 本阶段已实现

- Locked / Available / Unlocked 三状态实时计算。
- Strong 依赖参与解锁，Weak 依赖默认隐藏且不影响解锁。
- Strong 连线只显示 `✅` 或 `❌`；Weak 连线开启后以虚线显示，不增加文字标签。
- XYFlow 画布：Pan、Zoom、Mini Map、Fit View、Fly-to。
- 点击节点：初始化模式可批量点亮全部 Strong 祖先；正常模式中 Available 节点解锁，Locked / Unlocked 节点打开详情。
- 用户名和密码账户、HttpOnly 会话、CSRF 校验、账户隔离、数据库进度保存。
- 非级联撤销：将一个节点标记为未掌握，不会删除已解锁的后继节点。
- KaTeX 公式展示、游客浏览、窄屏基本适配。

## 本地运行

需要 Node.js 24 和 pnpm。

```bash
pnpm install
pnpm dev
```

然后打开 `http://localhost:4173`。`pnpm dev` 使用服务端磁盘持久化的 PGlite 测试适配器，数据保存在 `.data/knowledge-world`；它是 PostgreSQL 18 的 WebAssembly 构建，仅用于本地 Phase 1 验证。

使用原生 PostgreSQL 时：

```bash
cp .env.example .env
pnpm db:setup
pnpm dev:postgres
```

在 `.env` 中配置 `DATABASE_URL`。生产环境必须使用原生 PostgreSQL，不能设置 `DATABASE_MODE=pglite`。

## 验证

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

若已安装 Chrome，可用 `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e`；测试使用独立临时浏览器会话和数据库。

单元/集成测试覆盖图算法、状态投影、Strong/Weak、初始化、非级联撤销、账户隔离、CSRF、幂等、事务回滚与数据库重启。浏览器测试针对生产构建，使用独立临时数据库，覆盖账户学习闭环及移动端。GitHub Actions 另外配置 PostgreSQL 18 集成测试；本地通过不代表远端 CI 已执行。

## 关键文件

- `content/fixtures/function-slice.ts`：20 个测试节点和 31 条测试依赖。
- `packages/graph-core/src/index.ts`：状态、祖先闭包、图谱结构验证。
- `packages/database/migrations/0001_phase0.sql`：PostgreSQL 数据模型。
- `apps/api/src/app.ts`：账户、图谱和进度 API。
- `apps/web/src/main.tsx`：XYFlow 交互画布。
- `tests/`：图算法与账户进度集成测试。

## Phase 1 边界

本阶段没有生成 350 个节点，没有制作完整世界地图，没有生成 AIGC 素材，没有追求最终 Minecraft 视觉，也没有加入搜索、知识路径、后台 CMS 或 AI 内容生成。等待确认后再规划下一阶段。
