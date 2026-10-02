# Knowledge Ponder Engine V1

共享声明式运行时、三个 Pilot、五个 HIGH 适配扩展、独立审查证据门禁均已实现。按用户 2026-10-02 的新要求取消产品 AI 生成和 AI 审核，不需要模型服务。场景为人工编排的可执行数学 DSL。

## 数据流

`Knowledge Detail → PonderEntry → lazy PonderFocus → Scene Schema → Mathematical Validation → Timeline + Parameters + AnimationFrame → rendererRegistry → SVG / lazy WebGL`

- `packages/ponder/src/schema.ts`：严格 Zod Schema；同时导出 JSON Schema。JSON Schema 不表达所有跨字段条件，Zod 才是最终执行规则。
- `expression.ts`：长度/深度受限的算术 AST，禁止任意 JS、属性、字符串、赋值和动态执行。
- `animation.ts`：纯函数动画编排、对象 draw/reveal/pulse、说明时机、镜头插值；seek/replay 可确定性重算。
- `runtime.ts`：数学求值、连续参数、解析直线圆交点、步骤状态机、参数约束。
- `validation.ts`：检查默认值、参数端点、中点和动画采样，拒绝退化方向/平面和非法直角标记。数值冒烟不是形式化证明。
- `quality.ts`：场景 SHA-256、九个审核维度、独立审查身份、fail-closed 发布门禁。创作与审查分离，节点/教材来源必须保持一致。
- `apps/web/src/ponder/`：通用舞台与 renderer family。Renderer 不按节点 ID 分支。
- `content/ponder/`：3 个 Pilot + 5 个扩展场景。目录是本地试运行数据，不接受 AI 自动发布。

## 状态边界

参数 baseline 在自由实验后继续保留，仅显式 seek/replay 恢复作者初始轨道；镜头手动操作或恢复后保持用户接管至下一步骤。

Ponder 完成不调用任何知识解锁、掌握、依赖或奖励函数。`kw:ponder:v1:local:<demo>:<version>` 保存独立本机进度，包含开始/完成时间、最后步骤、观看记录、交互和重播次数。重新进入从第一步开始重播；lastStep 是记录，不自动恢复跳过教学。只有当前会话经过全部步骤后才能记录完成；时间轴仍可自由跳转。该记录不证明理解或掌握。

现有课程页使用本机身份 `local`。未接入云端同步或登录身份隔离。迁移 `0004_ponder.sql` 独立建立 demo、scene、review、user progress 表，为后续服务器持久化提供模型；当前 UI 不声称这些数据已经写入数据库。课程节点 ID 来自多个静态体系，故 demo.node_id 不外键绑定旧版数据库节点；发布服务必须核验选定课程中的成员资格。

## 生命周期和性能

Ponder Focus 与 Three.js 按需加载。全部说明步骤通过 RAF 推进构建、显现、强调和真实参数轨道；3D 持久对象只更新变换与 BufferAttribute，不逐帧分配或销毁几何体。暂停和交互步骤取消播放 RAF；隐藏页面暂停计时。3D 在播放期间由共享时钟驱动，暂停后使用 OrbitControls 的 change 事件按需渲染，没有永久 WebGL loop。退出释放 controls、geometry、materials、ResizeObserver、canvas 和 WebGL 上下文。

2D 每个 plot 固定最多 241 个采样点，最多 64 个对象。若表达式 AST 大小为 L，对象 O、plot F、采样 S，单帧约 O(O·L+F·S·L)，空间 O(O+F·S+L)，表达式引用展开成本受 16 层上限约束。圆直线交点解析计算 O(1)。参数约束 O(C)，V1 仅允许不共享变量的有序参数对。完整的数学正确性仍需独立审核，不以复杂度或单测替代。

当前 renderer 能力为 V1 子集，未实现统计、集合、数轴和通用代数渲染。注册新 renderer 需同时新增 schema 对象、数学验证、语义文字和渲染测试；未知对象直接拒绝。Scrub 在数据中保留 capability，目前场景全部关闭。

## UX 与可访问性

Focus 通过 Portal 挂载到 body，避免继承详情抽屉样式；原详情仍保持挂载。modal dialog 提供焦点限制，退出恢复开始按钮。关闭/取消事件在 Ponder dialog 中截断，避免 StrictMode 清理通过 Portal 冒泡关闭原详情；本机进度只加载一次，避免 StrictMode 重复计算重播。桌面/平板/手机二维可用，三维持续允许旋转、恢复推荐视角和切换辅助线。每步同时提供 caption、semanticLabel 和可展开文字说明，公式沿用 KaTeX。

减少动态效果时，动画参数直接显示该步骤终态，保持数学关系和文字说明；3D 不自动插值相机，但用户仍可主动旋转。WebGL 初始化失败或上下文丢失时显示明确降级说明，不声称三维验证通过。

Three.js 官方资料核对： [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.dispose)、[OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls.dispose)。

## 思索画面重构

采用 Minecraft 字体、深灰独立舞台、左上物品槽、像素按钮、悬浮说明、实时数值比较和节点时间轴。空间构造显示在实际 Three.js 棋盘方块底座上，数学对象保持光滑和精确。字体由本地 Minecraft.ttf 加载；KaTeX 与数学标签保留专业字体。详见 [动画流程](PONDER-ANIMATION-FLOWS.md)。
