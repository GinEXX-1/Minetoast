# Function Dimension v2 — 原创性与视觉一致性审核

状态：`DEPRECATED / NOT FOR PRODUCTION`。本审计仅供旧 Realm 美术探索追溯，不批准任何资产进入现行 UI；见 [UI Visual Bible](./PHASE-3-UI-VISUAL-BIBLE.md)。

状态：`ORIGINALITY_REVIEW_REQUIRED`；`VISUAL_CONSISTENCY_NOT_PASSED`。对象为 `assets/phase-3/function-realm-visual-master-v2.png`，2026-09-26。本轮为仓库原图的目视审核，不是反向图片检索、逐纹理哈希比对、法律权利清查或生成模型训练资料审计；不能据此给出“绝无相似资产”的保证。

## 原创性检查

|检查项|观察|结论|
|---|---|---|
|方块/体素/像素世界语法|地形、树木、云、道路、建筑由方块构成，第一眼符合既定方向。|`PASS`（风格方向）|
|游戏商标、角色、原版物品 Sprite、UI 框、制作台|图中未见可辨认的文字商标、角色、物品栏、制作台或游戏 UI；背景中的发光箭头是场景机器的一部分。|`NO_OBVIOUS_COPY_VISIBLE`；不等于来源证明|
|草方块、石块、水、方块树与山体|典型草顶/土侧/方块树组合与常见 Minecraft 视觉高度相近；仅靠成图无法确认纹理是否完全原创。|`REVIEW_REQUIRED`：生产版建立自有草、石、水、叶纹理库，并保存源文件/许可与差异对照|
|数学方块和结构|刻度路、坐标平台、蓝绿区域与数学工坊具有本项目特定组合，未见直接原版游戏对象。|方向可用；仍需保存分层源稿及创作记录|

现有 v2 文档记录为内置图像生成后进行定点修订，提示词要求不使用原游戏资产；**提示词不是版权或原创性验证证据**。没有发现明确的直接复制迹象，但证据不足以将 `Originality Audit` 标为 `PASS`。生产版本还需逐纹理检查及可追溯创作记录。

## 视觉一致性检查

|维度|观察|判定|
|---|---|---|
|Voxel scale / block size|前景石块很大，中景平台格线细密，远景工坊同时出现更小的方块；透视缩小合理，但不同材质的“母方块”比例未固定。|`REVIEW_REQUIRED`：建立近/中/远三级量尺|
|Pixel density / edge treatment|整体像体素渲染图，但水面、高光、远景雾和树冠呈平滑抗锯齿；发光蓝绿线及粒子有柔化边。|`FAIL`：若作为硬边 Pixel 母图，须控制模糊和发光溢出|
|Perspective / lighting / shadows|统一斜俯视，右上暖光与主要投影大体相容；前景刻度路通向中央平台的几何关系仍不够严谨。|视觉 `PARTIAL`，数学透视见数学审计|
|Texture complexity / atmospheric depth|近景纹理清楚，远景雾化形成纵深；草、石、水的写实材质复杂度高于 32×32 Icon Bible 的预期像素粒度。|`REVIEW_REQUIRED`：生产版需定义环境纹理粒度与图标粒度的关系|
|Fantasy / sci-fi / UI 残留|未见城堡、神殿、魔法阵或烘焙的节点/UI。机器箭头、蓝绿发光链路和远景工业装置有轻微科幻/霓虹联想。|Fantasy RPG `NONE_OBVIOUS`；霓虹/工业感 `REWORK`|

现图可用作方向参考，不能作为已经一致化、已获原创性确认的 Production Master。改稿应减少柔光与写实反射，制定统一方块比例/材质颗粒度，并让数学结构承担识别度，而非依赖通用方块树与草方块。
