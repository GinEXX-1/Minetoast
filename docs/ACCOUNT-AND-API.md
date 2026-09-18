# 账户、游客与 API 契约

## 1. 权限与会话

V1 一账号一用户，username + password。默认用户名 3–32 位 ASCII 字母/数字/下划线，大小写不敏感唯一（显示保留原输入大小写）。密码 12–128 字符，允许空格与 Unicode，不在日志记录密码；哈希使用 Argon2id，由服务端可靠库实现并在目标主机校准成本。管理员身份仅通过受控初始化命令设置，不接受注册表单 role。忘记密码 V1 先提供受控管理员重置并撤销全部会话，不假设已有邮箱验证系统。

随机高熵 opaque session token（32 字节随机），只将 SHA-256 哈希入 sessions；Cookie __Host-kw_session、HttpOnly、Secure、SameSite=Lax、Path=/，不存 localStorage。默认绝对有效期 7 天；注销、修改密码、账号停用会失效会话。后端每次检查过期、撤销和 users.disabled_at，定期清理过期记录。开发 HTTP 仅用独立非 __Host Cookie，生产配置不允许关闭 Secure。

写操作验证 Origin + 会话绑定 CSRF token；登录/注册同样校验同源。登录按 IP 和规范化用户名双维度限速，用户名不存在和密码错误使用相同对外错误，不泄露密码哈希。初始单实例可内存限速，横向扩容前必须换共享限速器。密码策略与会话机制是设计，尚未实现或安全验收。

|能力|游客|学生账户|管理员|
|---|---|---|---|
|浏览已发布图、所有详情、路径、搜索、地图|允许|允许|允许|
|个人进度、初始化、解锁、撤销、备份|无|仅本人|仅本人，管理角色不默认读其他学生进度|
|内容草稿、审核、布局编辑、发布|禁止|禁止|允许并记录审计|
|触发 AIGC 内容生成|无|无|V1 未实现|

游客仅保存声音和视图偏好，不建立本地游客掌握集合，也没有注册时进度迁移。游客看到 Available 点击提示登录，同时始终提供详情入口。无测试题权限门槛。

## 2. API 端点草案

|方法 / 路径（前缀 /api/v1）|权限|契约|
|---|---|---|
|POST /auth/register、/auth/login|公开，同源、限速|设置会话；返回 PublicUser，不返回 hash|
|POST /auth/logout|账户 + CSRF|撤销会话并清 Cookie|
|GET /auth/me|公开|guest 或 PublicUser|
|GET /knowledge/graph|公开|当前 releaseId + 摘要，ETag=contentHash|
|GET /knowledge/nodes/:id?releaseId=...|公开|指定已发布版本详情，未发布节点 404|
|GET /knowledge/map?releaseId=...|公开|区域、热点、Landmark 和资产引用|
|GET /me/progress|账户|releaseId、revision、初始化时间、unlocked records；Cache-Control private,no-store|
|POST /me/progress/commands|账户 + CSRF|CommandEnvelope → ProgressResult|
|GET /me/progress/export|账户|ProgressBackup JSON|
|POST /me/progress/import/preview|账户 + CSRF|校验、差异与未知 ID 报告；不写进度|
|GET/POST/PATCH /admin/knowledge/nodes...|管理员|草稿 CRUD；删除为退休；包含版本前提避免覆盖|
|GET/POST/PATCH /admin/knowledge/edges...|管理员|依赖、rationale、审核状态；变化重置审核|
|POST /admin/knowledge/validate|管理员|报告候选图错误与警告|
|POST /admin/knowledge/releases|管理员|完整验证后原子发布，失败返回 issues|
|POST /admin/assets|管理员|登记、审核资源，非公开上传桶|

搜索和路径在客户端 graph-core 计算，V1 不需要再写重复搜索服务。未来 AI 编辑接口只写设计文档（例如 /admin/ai/content-proposals），不开放空壳生成服务、不传模型密钥给浏览器。

错误统一 {code,message,details,requestId}；401 未登录，403 无权限，404 未发布/不存在，409 图版本或 revision 过期/幂等冲突，422 参数/先修/导入语义不满足，429 限速。客户端对不确定超时使用同一 idempotencyKey 重试，不能换 key 重复创建事件。

## 3. 进度事务

所有写命令携带 UUID idempotencyKey、graphReleaseId 与 expectedRevision。服务端 userId 只从 session 取。注册时创建 user_progress_state。

1. BEGIN；SELECT graph_head FOR SHARE，固定当前 release；按固定顺序 SELECT user_progress_state FOR UPDATE。
2. 查询 (userId,idempotencyKey) 的命令。若已存在且规范化请求 SHA-256 一致，直接返回此前结果，即使如今 revision 或 release 变化也不重做；同 key 不同 payload 返回 409。
3. 对新命令验证 release 和 expectedRevision；不一致 409 并让客户端刷新，不采用“最后写入覆盖”。
4. 在锁内读取用户 U 与该 release 图；unlock 只允许 Available（已 Unlocked 是无变化成功）；initialize 只允许初始化未完成；revoke 只移除指定已掌握记录。
5. 初始化：对 targets 去重，求全局 Strong 祖先并集，新增 U 以外节点。目标优先于祖先来源；弱边与旁支不参与。所有 targets 校验成功才写，不允许半批成功。
6. 有实际状态改变时更新 revision 一次；无变化不递增。初始化完成仅设置一次时间，也算状态改变。只为实际变化生成事件；进度、事件、命令结果全部同一事务写入，最后 COMMIT。

expectedRevision 防多标签页互相覆盖。客户端发生 409 时刷新，再根据用户最新意图产生新命令，不静默重放过时 revoke。单用户请求顺序化；前端正常解锁收到成功后再播放持久成就反馈。

初始化完成后不自动再开放批量祖先点亮模式；用户可以逐点撤销及正常解锁。重新初始化是后续产品决策，不在 V1 隐含新增“重置全图”。

## 4. JSON 备份

v1 结构：schemaVersion=1、graphReleaseId、exportedAt、unlockedNodeIds。导出不含账号、密码、会话或 role。记录是用户自评，不要求文件签名，导入不能获得管理员或额外产品权限。

默认仅合并 merge，避免导入旧文件抹除后续掌握。流程：选择文件 → 预览校验及新增数量 → 用户确认导入 → import 命令事务执行；本轮只是定义流程。未知/已退休 ID、错误 schemaVersion、无法映射旧版本一律阻断并展示列表，不静默丢弃；已退休记录导出时仍可带出，预览提示当前图不支持，待显式处理。跨版本只接受仍有效的稳定 ID。

限制 1 MiB、最多 1000 个 ID、去重后检查每个 ID 格式及当前已发布成员身份，禁止解析任意文件路径/外链。不信任客户端 unlockedAt；新记录时间为服务端导入时间，source=import。

导入精确保留用户选择的掌握集合，不自动补祖先，也不要求 Strong 闭包：合法非级联撤销后的备份本就可能不是闭包。已有节点保留来源和时间。导入不自动结束首次初始化，界面仍可明确“完成初始化”。

## 5. 发布结构校验的剩余服务职责

SQL 提供外键、ID、唯一性、范围与审核元数据约束，但不能把“知识合理”作为 SQL CHECK。发布器必须保证：节点/边审核；节点内容完整；全 enabled 图 DAG；Strong 传递约简；普通≤3、例外≤5；root 理由；区域父节点必须同域 L1，模块属域；Landmark 指向对应域 key_achievement；layout 的 domain 与节点匹配；资产类型/尺寸/来源/审核与引用匹配。JSONB 内部结构、节点永久 ID 不允许修改、管理员 PATCH 的版本冲突均在服务层实现并测试。
