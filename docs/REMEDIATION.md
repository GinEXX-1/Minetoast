# 审计整改（2026-09-19）

> 此文件记录当日较早的整改批次。后续已安装原生 PostgreSQL 并扩展实现与测试；当前结果和剩余签审项见 [Phase 1 交付记录](PHASE1-DELIVERY.md)。

本轮范围：修复 ELK Worker、浏览器回归、静态服务依赖升级、建立本地 Git 与 CI。原始压缩包及 Phase 0 保留。

## 本地执行证据

- 2026-09-19：冻结锁文件安装、TypeScript、ESLint、Vite 生产构建通过。
- Vitest 22/22 通过（PGlite）。
- `PLAYWRIGHT_CHANNEL=chrome pnpm exec playwright test`：2/2 通过，使用本机 Chrome 的独立临时浏览器会话；桌面完整流程和 390×844 重排均通过。未使用个人浏览器 profile。
- `pnpm audit --prod --registry=https://registry.npmjs.org`：未发现已知漏洞。
- 截图：`test-results/desktop.png`、`test-results/mobile.png`。移动端全图缩放后文字偏小，仍需用户放大或定位；通过无溢出检查不等价于完整移动端体验验收。
- 本机未发现 psql 或 Docker；PG18 CI 是待执行项，不计入本地通过项。

## 实现

- 使用 elk-api + Vite 导入的 elk-worker.min.js Worker，避免 bundled 版本在嵌套 Worker 中错误导出。15 秒超时、失败日志、取消与旧结果隔离。
- 静态服务升级到 @fastify/static 10.1.3，锁文件同步。
- Playwright 测试运行生产 dist 与临时 PGlite，不使用开发者的进度库；覆盖 20 节点、Weak 边、定位、详情、注册、初始化、撤销保留后继、重新登录、刷新、移动端。
- GitHub Actions：锁定安装、类型检查、单元/集成、PG18、浏览器及生产依赖审计。

## 边界与后续

|项目|状态|
|---|---|
|20 节点学习切片|实现，执行结果见本轮交付说明|
|远端 CI|已配置，未创建远端仓库、未推送，尚未执行|
|原生 PG18|CI 已配置，本地未验证|
|搜索/路径/地图/CMS/备份|未实现，属于后续功能范围|
|依赖质量门|未完成质量输入/独立 AI Review 的依赖为 REVIEW_REQUIRED；不作为有效边发布，但不阻断其他已通过候选。|
|400 节点性能、完整无障碍、安全头/日志|仍需专项工作|
|lint|ESLint + TypeScript 推荐规则；遗留 any 适配暂不阻断|

不能将本轮修复解释为完整 Phase 1 或生产上线验收通过。

ELK API 依据：https://github.com/kieler/elkjs/blob/master/README.md
