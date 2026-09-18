# AIGC Asset 管理与 Math Pixel Icon Bible 基线

本阶段仅定义流程、清单和引用契约，不生成图标、地图、背景或音频。

## 1. 生命周期

brief → generated/draft → crop/normalize → REVIEW_REQUIRED → APPROVED → reference in graph release → retired。

assets.id 为不可变版本身份；更换素材新增记录并更换草稿引用，不覆盖同一 object_key 的二进制。object_key 建议 knowledge-world/{domain}/{kind}/{sha256}.{ext}，不保存会过期的签名 URL。已发布快照引用旧资产仍可正常访问。删除前检查所有已发布快照引用；被引用资源禁止物理删除，未引用草稿按保留期清理。

数据库存元信息，二进制放对象存储。未经审核的原图保持私有；APPROVED 派生图才进入可缓存路径。CDN 使用内容哈希长期 immutable 缓存。原始授权字体/音频文件不提交公共代码仓库。

## 2. 字段与审核

必填 id、kind、objectKey、version、sha256、mimeType、byteSize、altText、reviewStatus、license。图像须 width/height；裁切须 parentAssetId 和 crop rectangle；来源 provenance 包括 origin、provider、model、promptVersion、prompt、seed（供应商支持时）、source/许可凭证引用。不要把 API token 写进 prompt 或 metadata。

图标引用 icon，背景引用 background/map，音效和字体独立类型。发布校验扩展名与真实 MIME、像素和体积上限、坐标边界、父图尺寸、许可非空及 APPROVED；上传文件重新编码以去掉不需要的元数据。SVG 若未来引入只接受可信静态处理结果，禁止脚本和外部引用。

## 3. Sprite Sheet 工作流

1. 每个 Domain 先定概念清单与视觉规范；不给模型同时承担数学依赖判定。
2. 清单显式映射 sheetId,row,col,nodeId，最多 5×5；不足 25 个保留空格，不补造节点。
3. 示例规格：每格工作尺寸 256×256、16px 安全边距、统一透明背景/视角/光源；正式栅格尺寸按第一轮样片调整后写版本。
4. 生成后先审核网格对齐和每格概念，再裁切；AIGC 不保证自动精确网格，必要时人工修正 crop rect，不能机械裁切后自动发布。
5. 裁切输出透明 PNG 或无损 WebP；保留原图 parentAssetId；像素缩放采用 nearest-neighbor 与 image-rendering:pixelated。
6. 普通图标目标 64×64 / 128×128 两档；关键成就允许单独精修，但不能随意升级 nodeType。
7. 锁定、可用、已解锁通过 CSS 饱和度/边框实现，不生成三套图标。首轮只用一个领域的小批样片验证。

公式和严肃数学符号不依赖 AIGC 拼写，交给 KaTeX/精确矢量层。图标只传达概念隐喻，不作为数学证据。

## 4. 风格规范

|领域|隐喻|约束|
|---|---|---|
|集合/逻辑|容器、分类、门|不能把集合关系画成必然错误的包含|
|代数|方块、矿石、运算装置|保持同一透视和光源|
|函数|坐标、曲线、输入输出|坐标与曲线意象简洁，避免错误函数图像被当定义|
|三角|单位圆、罗盘、波纹|真实单位圆解释由公式层承担|
|数列|阶梯、序列|不把所有数列画成等差|
|向量|箭头、航线|突出方向|
|几何|晶体、多面体、建筑|空间关系经人工检查|
|概率|骰子、卡牌、群岛|不暗示确定预测|
|导数|切线、坡度、速度|隐喻不能替代定义|

统一像素密度、有限领域调色盘、左上光源、相近外轮廓占比，数学名为主标签。背景低对比，避免盖过节点/边；地图名称与热点独立 HTML/SVG 叠加，文字不烘焙进 AIGC。

## 5. 地图与字体/声音

地图只展示领域、区域和关键成就。采用 master reference plane 的 0–1 归一化坐标；map_regions.geometry 定义 type=polygon/rect、points/bounds 与 viewBox，API 必须校验范围和点数。未来响应式变换同时作用于图像与热点，不能单独对底图 object-fit 裁剪造成漂移。大图按视口分辨率/分块加载，Phase 1 只做一个区域占位映射。

Mojangles 与 Minecraft 原音效仅在用户提供合法可用资源后接入；不自动下载第三方转载。GNU Unifont 按具体发行文件核验许可并保留 LICENSE；缺少字体时先用系统等宽中文回退。KaTeX 使用自身数学字体及许可。声音偏好默认开，播放服从用户手势和全局静音。不会因缺资源阻断 Phase 1 业务闭环。
