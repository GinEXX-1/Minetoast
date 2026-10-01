# 图谱质量与测试策略

## 1. 发布质量门

|检查|范围 / 方法|处理|
|---|---|---|
|Cycle Detection|所有 enabled Strong+Weak，Kahn/DFS，返回环路径|阻断发布；草稿可暂存供修订|
|Duplicate Edge|source,target 同向唯一，不同时存 strong+weak|SQL 阻断；改变类型需更新原边|
|Duplicate Node|永久 ID 唯一；名称/别名规范化+教材概念人工去重|ID 重复阻断；语义候选必须人工处理，不能仅靠字符串唯一索引|
|Knowledge Dependency Quality Gate|每条 Dependency 记录 Canonical evidence、数学定义、反事实、图谱上下文与 rationale，并输出结论和 confidence|HIGH 自动通过；MEDIUM 两次独立 AI Review 一致后通过；LOW/冲突/歧义为 REVIEW_REQUIRED|
|Transitive Reduction|对每条 Strong 临时移除，若仍 source 可达 target 则报告|阻断发布并复核；不得自动删边掩盖原始判断|
|Root / Orphan|零 Strong 入度、连通分量、无出入边检测|报告 warning；声明 root 且解释。该结构信号不决定数学依赖，也不使待决边自动 Strong|
|Overconnected|普通直接 Strong 入度≤3；例外≤5且有原因|超过硬上限阻断；高出度作为评审警告，不设伪科学统一上限|
|Key Achievement|四类依据至少一条具体理由|装饰性里程碑拒绝发布|
|内容|字段完整、公式 KaTeX 可解析、适用条件、Canonical 教材定位|语法通过不等于数学正确；依赖须通过质量门，人工 override 为可选审计记录|
|地图/素材|同域引用、区域层级、关键成就、坐标、尺寸和审核状态|非法引用阻断|

约简判定只用 Strong，不能因为 A weak→B strong→C 而移除 A strong→C。质量门未通过的依赖不会进入有效候选图；它们以 warning 保留，不会阻断其他通过项。内容或边改动使该边的质量记录失效。

## 2. 分层测试

|层|工具/环境|关键断言|
|---|---|---|
|领域单元|Vitest|掌握优先；空前置 available；初始化强祖先闭包；弱边旁支不增加；撤销保留后继|
|性质测试|fast-check 合成 DAG|初始化幂等；拓扑序合法；约简保可达性；Between 子图每节点位于有效有向路径；输入排列不影响结果|
|数据库集成|真实 PostgreSQL 18 临时库|迁移、外键/复合约束、case-insensitive 用户、事件和进度原子提交、异常回滚|
|并发/幂等|两个数据库连接|相同 key 只写一次；同 key 异 payload 冲突；revision 失配不覆盖；发布与解锁锁序无死锁|
|认证授权|Fastify inject + 真实会话|游客401、学生403、双账号隔离、CSRF、过期/撤销、注册不能注入 role|
|组件|Testing Library|三状态 click/hover、Available 详情入口、键盘/触屏、关闭抽屉焦点恢复|
|端到端|Playwright|注册→初始化→刷新保留→正常解锁→撤销→导出导入；地图与树同计数|
|性能|浏览器 trace + 合成图|Worker 不阻塞交互、旧布局结果丢弃、初始化无 Toast/重粒子、屏外动画停止|
|依赖质量|Quality Gate + AI Review provenance|五类输入、HIGH/MEDIUM/LOW 规则、冲突处理；与教材顺序脱钩|

## 3. 必测反例

1. A→B→C，A→D（旁支），W weak→C；初始化 C 只增加 A/B/C，不能增加 D/W。
2. A/B/C 已点亮，撤销 B；C 保持 Unlocked，B 的状态由 A 决定；未点亮的 B 后继变 Locked。
3. A→B→C→D 加 A→D，必须识别长度大于 2 的传递冗余。
4. 两条弱边或混合强弱形成环也阻断发布；弱边不参与 Strong 解锁。
5. 跨领域先修藏在其他 Tab，初始化仍完整求祖先，Portal 不生成进度记录。
6. 初始化 targets 同时含某祖先和后继，目标 source 优先，事件数等于真正新增节点数。
7. 两个标签页同时 unlock/revoke、网络重试、服务端事务中途失败，不出现半批进度。
8. 进度命令旧 release 被拒；幂等已提交命令在新 release 下重试仍返回原结果。
9. 首次初始化完成后再次 initialize 拒绝；finish 重试不产生第二完成事件。
10. 导入缺先修但合法的已掌握集合不能自动补齐；重复/超大/未知 ID 文件不能绕过预览校验。
11. 初中节点不计高中、分母 0 不除零、退休节点保留历史但不计分母。
12. `REVIEW_REQUIRED` 依赖不得成为有效 Strong；发布候选需将其禁用并在报告中保留 warning，不能影响其他通过项。
13. b²-4ac、f'(x)、a_n 等别名可匹配，同时保留数学符号意义；搜索定位等待布局完成。

## 4. CI 与退出门槛

Phase 1 CI：类型检查/lint → 领域与性质测试 → 新库迁移和数据库并发/权限测试 → 浏览器核心流程。依赖版本锁定；用真实 PostgreSQL，不能用 SQLite 冒充事务语义。

硬门：上述核心反例全通过、已发布依赖无未解决的质量门冲突、无严重权限越界、持久化闭环无丢失、图谱 validator 零 error、性能达到 GRAPH-ENGINE.md 的记录基准。人工 override 必须保留证据；不把测试覆盖率百分比当作数学正确率。

Phase 0 的历史验证范围见 VERIFICATION.md；当前 Phase 1 的已运行命令、证据和剩余门禁见 PHASE1-DELIVERY.md。性质测试使用仓库内固定种子的 DAG 生成器与独立传递闭包 oracle，不依赖 fast-check；浏览器流程用于组件行为验证，不声称已运行 Testing Library。
