<img width="1275" height="221" alt="screenshot" src="https://github.com/user-attachments/assets/8108b4dc-d399-4713-8c98-cb8d43643860" />

Minetoast 是一个以知识关系为核心的高中数学交互式学习地图。它把知识点、强前置关系、弱关联、教材证据和学习进度放在同一张可探索的图谱中，让学习者从“我现在在哪里”继续到“下一步学什么”。

项目主页：<https://minetoast.studyoo.space>

## 项目内容

- 9 个高中数学知识体系：集合与逻辑、代数与不等式、函数、三角函数、数列、平面向量、几何与空间向量、概率与统计、导数。
- 函数知识世界包含 32 个正式交互节点；其余体系提供独立的审核后课程图谱页面。
- Strong 前置关系用于解锁和路径计算，Weak 关系用于补充理解与导航。
- 节点状态、前置闭包、路径高亮、搜索、Fit View、Pan / Zoom、Mini Map 和本机学习进度。
- 节点悬停摘要、详细知识抽屉、LaTeX 公式、教材出处和关系说明。
- Minecraft 风格界面、像素节点图标、点击音效、关键成就音效、粒子反馈和移动端布局。
- 管理员内容工作台、依赖质量记录、发布门禁、审计与历史版本接口。

## 快速开始

需要 Node.js 24 和 pnpm 11。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

打开 <http://localhost:4173>。本地开发默认使用 PGlite，数据保存在 `.data/knowledge-world`，适合预览和测试。该目录保持原路径，以保留现有本地数据。

macOS 也可以双击项目根目录的 [`启动 Minetoast.command`](启动%20Minetoast.command) 启动本地服务。

### 使用 PostgreSQL

生产环境使用原生 PostgreSQL，不使用 PGlite：

```bash
cp .env.example .env
pnpm db:setup
pnpm dev:postgres
```

请在 `.env` 中配置 `DATABASE_URL`；管理员内容操作还需要独立的 `ADMIN_DATABASE_URL`。详细的账户、权限和发布流程见 [`docs/OPERATIONS.md`](docs/OPERATIONS.md)。

## 验证命令

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

移动端回归测试：

```bash
PLAYWRIGHT_CHANNEL=chrome pnpm exec playwright test tests/e2e/mobile-world.spec.ts
```

测试覆盖图算法、账户进度、内容审核、知识路径、课程图谱、详情抽屉、首页入口和 320 / 390 / 768px 移动端视口。

## 代码结构

```text
apps/web/                 React + Vite 前端、知识世界和图谱交互
apps/api/                 Fastify API、会话、账户和进度服务
packages/graph-core/      图谱状态、前置闭包和路径算法
packages/domain/          领域类型、内容模型和知识详情结构
packages/database/        PostgreSQL schema、迁移和角色权限
content/fixtures/         函数与九个数学体系的知识图谱数据
tests/                    单元、集成、端到端和性能验证
docs/                     架构、运行、验收和内容审核记录
```

关键入口：

- [`apps/web/src/main.tsx`](apps/web/src/main.tsx)：前端路由和应用挂载。
- [`apps/web/src/FunctionWorld.tsx`](apps/web/src/FunctionWorld.tsx)：函数知识世界。
- [`apps/web/src/CurriculumSystemWorld.tsx`](apps/web/src/CurriculumSystemWorld.tsx)：专题知识世界通用页面。
- [`packages/graph-core/src/index.ts`](packages/graph-core/src/index.ts)：Strong / Weak 关系和图算法。
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)：系统架构说明。

## Knowledge Ponder V1

知识详情中的「按下开始思索」进入接近全屏的原理演示。当前包含 19 个场景：原有 8 个，以及用户批准的首批 11 个，覆盖空间平行与夹角、正弦图象与参数、变化率、导数单调性、极大值、极小值和向量数量积。统一使用声明式 DSL 和受限数学运行时。观看进度与知识解锁/掌握完全独立。

页面右下角及思索控制栏的「设置」打开 Minecraft 风格选项：日间/夜间模式、舒适阅读、思索线条颜色、可撤销的分体系本机节点重置、观看记录重置，以及现有账户服务的注册/登录/退出。偏好保存在当前浏览器；账户不会自动同步课程体系本机进度。验收证据与正式发布边界见 `docs/ponder/PONDER-SETTINGS-AND-BATCH-ONE-REPORT.md`。

```bash
pnpm ponder:validate  # 结构与数学冒烟校验
pnpm ponder:gate      # 严格发布门禁，缺少审核时退出码 1
```

演示目前为本地试运行，全部保留 `REVIEW_REQUIRED`。按用户要求取消产品 AI 生成与 AI 审核；场景由人工编排并独立审查。生产发布与云端观看进度不在本地播放器交付范围。详见 [`docs/ponder/PONDER-PILOT-REPORT.md`](docs/ponder/PONDER-PILOT-REPORT.md)。

## 数据与审核边界

九个知识体系已完成体系级审核并接入独立页面。体系级审核表示页面结构、知识组织和关系模型已经通过当前项目审核；节点级教材证据、依赖质量和正式发布快照仍由各自的发布门禁管理。仓库中的内容数据不会自动替代生产发布快照，也不会在缺失证据时擅自补齐前置关系。

## 许可证与状态

这是一个私有、持续开发中的学习产品原型。当前版本主要用于课程图谱验证、交互体验和内容审核流程，不代表已经完成面向公众的生产部署。
