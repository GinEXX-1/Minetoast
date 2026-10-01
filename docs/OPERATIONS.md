# Phase 1 本地运行与权限

## 本地体验

```sh
pnpm install --frozen-lockfile
pnpm dev
```

服务为本机开发环境。PGlite 数据保存在 `.data/knowledge-world`，不是浏览器 localStorage。不要把该适配器用于生产。

已有数据不会因升级自动重置，已发布快照不会被覆盖。若要在不动旧数据的情况下体验新的测试样本，可用独立目录：

```sh
PGLITE_DIR=.data/phase1-preview pnpm dev
```

这不是迁移个人进度的必要步骤。需保留进度时先在旧环境导出备份，再在新环境预览并合并。稳定 ID 保持不变，导入不补齐前置。

## 原生 PostgreSQL 18 验证

macOS 已安装 PostgreSQL 18 时：

```sh
pnpm test:pg:isolated
```

其他平台指定 `PG_BIN` 为包含 initdb、pg_ctl、createdb 的目录。脚本使用 mkdtemp、私有 Unix socket、无 TCP 监听，测试结束关闭并移除仅本次创建的临时集群。不要以 root 执行 initdb。

CI 使用独立 PostgreSQL 18 service，`DATABASE_URL` 指向该临时服务。`TEST_PG_ROLES=1` 启用真实角色与 DDL 权限验证。严禁把测试 URL 指向个人、共享或生产数据库。

## 数据库身份分离

`packages/database/roles.sql` 必须由数据库管理员在**专用应用数据库**执行：

- migration_owner：仅迁移角色；拥有显式列举的项目表、枚举和触发函数。
- learning_api：读发布快照；注册学生、会话、进度和事件操作；没有改角色、改发布指针、DDL 或删审计的权限。
- content_admin：读草稿、编辑内容、追加发布和审计、切换版本；不能改用户角色或删除已发布快照。

这些角色默认为 NOLOGIN。部署时创建各自的受限登录主体并授予相应成员资格，不把超级用户连接交给应用。数据库超级用户不受这些权限限制。

API 使用 `DATABASE_URL`，管理员内容连接使用 `ADMIN_DATABASE_URL`。生产启动强制要求后者。账户隔离由 API 会话身份和参数化 user_id 实现，**本版未启用逐用户数据库 RLS**；数据库凭证应只供服务端使用。

## 管理员账户

仅通过迁移所有者的受控本地命令创建，注册 API 不接受 role：

```sh
# 使用安全的环境注入方式设置，不在仓库、日志或共享 shell 历史保存密码。
ADMIN_USERNAME=reviewer ADMIN_PASSWORD="$REVIEWER_PASSWORD" pnpm admin:create
```

本地 PGlite 需额外设置 DATABASE_MODE=pglite，PGLITE_DIR 与目标实例一致。命令拒绝重复用户名，不覆盖现有密码，不打印凭据。没有自动创建可登录的生产管理员。

## 发布与回退

管理员登录→管理内容→编辑 JSON 草稿→记录 Dependency Quality 输入/AI Review 或人工 override→完整校验→发布。保存依赖内容会使该边的质量记录失效；version 冲突必须重新载入。人工可抽检 [textbook/TEXTBOOK-REVIEW.md](textbook/TEXTBOOK-REVIEW.md) 所列风险，但不再是逐项强制 Gate。

历史版本读取：`GET /api/v1/knowledge/releases/:id`；节点与地图端点支持 releaseId。回退仅能指向正式签审的历史快照，不能把测试 fixture 回退为正式版。

初次生产部署必须由部署负责人迁入通过 Knowledge Dependency Quality Gate 的内容、不可变 release 与 head；生产 setup 明确拒绝自动导入未审测试样本。当前仓库不是已经获得生产验收的生产数据包。

## 素材和功能边界

当前地图为原创 CSS 占位，图标为系统字符，音效为用户手势后合成的 660Hz 短音，不从第三方下载声音。KaTeX 自带字体随其 npm 包许可提供。管理员素材端点登记元数据及人工审核说明，不提供上传存储或外链抓取；素材实际部署由运营环境负责。

管理界面提供已有节点/边的 JSON 编辑、质量状态查看和可选人工备注；“高级操作”通过受保护 API 提交新建节点/边、依赖质量评估、人工坐标覆盖、素材登记 DTO，尚无专门表单设计器。没有全量 CMS、题库、XP 或 AI 内容生成。
