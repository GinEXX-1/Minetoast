# 教学模式

先选 primaryPattern，再选 renderer。可追加至多 3 个 secondaryPatterns。默认现象 → 变化 → 规律 → 意义 → 符号；不是所有节点都强行采用同一种顺序。

| 模式 | 教学意图 | 当前实例 |
| --- | --- | --- |
| OBSERVE_PATTERN | 从现象寻找规律 | 函数零点 |
| COMPARE_PATTERN | 比较输入与输出 | 函数单调性 |
| TRANSFORM_PATTERN | 观察合法变换 | 预留创作模式 |
| CONSTRUCT_PATTERN | 构造数学关系 | 圆切线 |
| DERIVE_PATTERN | 从变化到推导 | 导数与切线 |
| PARAMETER_PATTERN | 控制参数 | 二次函数、一次函数 |
| INVARIANT_PATTERN | 找到不变关系 | 圆切线、单位圆 |
| SPATIAL_REASONING | 识别空间关系 | 线面垂直判定 |

单调性拖动只能提供实例直觉，任意两点的结论还需要数学论证。语义说明给出 x₂²−x₁²=(x₂−x₁)(x₂+x₁)>0。圆切线通过交点合并和方向内积恒为零展示不变量。立体几何强调两条面内直线必须相交，不能只验证一个垂直关系。

字幕通常 1–2 句，不加入测验、得分、强制回答、掌握推断。可视化没有明显价值的节点不为覆盖率强行动画化。

教学模式通过共享轨道兑现：CONSTRUCT 逐段构建，COMPARE 同步投影与真实值条，PARAMETER 连续改变参数，INVARIANT 保持精确约束并突出关系，SPATIAL_REASONING 顺序构建空间对象与正交标记并引导视角。完整流程由执行 DSL 生成于 PONDER-ANIMATION-FLOWS.md。
