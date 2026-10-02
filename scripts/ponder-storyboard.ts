import {writeFile} from 'node:fs/promises';
import {ponderScenes} from '../content/ponder/catalog';
const lines=['# Ponder 动画流程与可复用编排','',
 '参考：[Create 思索界面](https://www.mcmod.cn/item/555624.html)。采用独立舞台、悬浮说明、像素操作栏和带节点时间轴；数学图形保持专业比例与 KaTeX 排版。',
 '', '运行 `pnpm ponder:storyboard` 从执行中的 DSL 重建此文档。以下时间均相对于当前步骤开始，单位为秒。交互步骤直接显示构建终态并暂停，等待自由操作或继续。',
 '', '## 共享运行规则','',
 '- `show` 是完整快照；`cues` 是可重算的绘制/显现/强调轨道，不保存 DOM 动画状态。',
 '- `draw` 在 2D 绘制真实路径、在 3D 延伸真实构造段；`reveal` 显现点与交点；`pulse` 强调当前推理所用对象。',
 '- 参数轨道先留出构建时间，再使用 smoothstep 连续变化；所有坐标、交点、投影、数值均重新求值。',
 '- 3D 镜头在每步前 2.5 秒从上一教学视角缓动；手动操作后用户接管，恢复按钮重新接入教学视角。',
 '- 暂停冻结所有轨道；重播重置当前步骤时钟；减少动态效果显示完整终态，文字和关系不丢失。',
 '- 舒适阅读以 0.65 倍时钟推进；它不改变数学参数的端点或推理顺序。',''];
for(const scene of ponderScenes){
 lines.push(`## ${scene.title} · ${scene.id}`, '', `${scene.renderer} / ${scene.duration} 秒 / ${scene.steps.length} 步`, '');
 for(const step of scene.steps){
  lines.push(`### ${step.title} · ${step.duration} 秒`, '', step.caption, '', '| 时间 | 动作 | 对象 / 关系 |','| --- | --- | --- |');
  for(const cue of step.cues){const label=scene.objects.find(o=>o.id===cue.target)?.label||cue.target;lines.push(`| ${cue.start}–${Number((cue.start+cue.duration).toFixed(2))} | ${{draw:'逐步构建',reveal:'显现',pulse:'强调'}[cue.kind]} | ${label} (${cue.target}) |`);}
  for(const track of step.animate)lines.push(`| ${track.start}–${track.start+(track.duration??step.duration-track.start)} | 连续数学变化 | ${track.parameter}: ${track.from} → ${track.to}，${track.easing} |`);
  lines.push(`| ${step.narration.captionAt} | 说明出现 | ${step.caption} |`);
  if(step.formula)lines.push(`| ${step.narration.formulaAt} | 符号表达出现 | KaTeX 公式 |`);
  if(step.interaction.length)lines.push(`| 暂停等待 | 自由操作 | ${step.interaction.join('、')}；约束持续生效 |`);
  lines.push('');
 }
}
await writeFile('docs/ponder/PONDER-ANIMATION-FLOWS.md',lines.join('\n')+'\n');
console.log(`Exported ${ponderScenes.length} scene storyboards`);
