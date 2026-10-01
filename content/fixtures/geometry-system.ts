import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

type Book='B2'|'X1';type Row=[string,string,string,string,string,Book,string,number];
const rows:Row[]=[
['HS-GEO-POINT-LINE-PLANE-001','点、直线、平面的位置关系','辨认基本空间对象','spatial-basics','点、直线、平面是刻画空间图形位置关系的基本对象。','B2','8.1',98],
['HS-GEO-SPACE-AXIOMS-001','空间图形基本事实','用公理描述位置','spatial-basics','空间几何基本事实用于判定点线面的位置关系。','B2','8.1',99],
['HS-GEO-PLANE-DETERMINATION-001','平面的确定','用点线确定平面','spatial-basics','不共线三点、直线与外一点等条件可唯一确定平面。','B2','8.1',100],
['HS-GEO-INTERSECTION-001','空间图形的交点与交线','确定公共部分','spatial-basics','两几何对象的公共部分构成交点、交线或交集。','B2','8.1',101],
['HS-GEO-PRISM-001','棱柱','识别上下底面','spatial-basics','棱柱有两个互相平行的多边形底面，其余面为平行四边形。','B2','8.1',102],
['HS-GEO-PYRAMID-001','棱锥','识别公共顶点','spatial-basics','棱锥有一个多边形底面，其余侧面为有公共顶点的三角形。','B2','8.1',103],
['HS-GEO-CYLINDER-CONE-SPHERE-001','旋转体的基本结构','识别轴与截面','spatial-basics','圆柱、圆锥和球由平面图形旋转形成，具有轴、底面或球面等结构。','B2','8.1',104],
['HS-GEO-POLYHEDRON-001','多面体与旋转体','按表面类型分类','spatial-basics','多面体由多边形面围成；旋转体由平面图形绕轴旋转形成。','B2','8.1',105],
['HS-GEO-OBLIQUE-PROJECTION-001','平行投影与斜二测画法','画空间直观图','spatial-drawings','斜二测画法中平行于坐标轴的长度按规定比例投影。','B2','8.2',108],
['HS-GEO-ORTHOGRAPHIC-VIEW-001','三视图','从三个方向描述物体','spatial-drawings','正视图、侧视图、俯视图共同表达空间几何体的形状与尺寸。','B2','8.2',109],
['HS-GEO-RECOGNIZE-SOLID-001','由三视图识别几何体','恢复空间结构','spatial-drawings','结合三视图中的轮廓、位置及尺寸恢复几何体结构。','B2','8.2',110],
['HS-GEO-COMBINATION-001','简单组合体','分解与组合结构','spatial-drawings','简单组合体由基本几何体拼接或截取形成。','B2','8.2',111],
['HS-GEO-SURFACE-AREA-001','几何体表面积','展开后求面积','spatial-measure','将表面展开为平面图形并求各面的面积和。','B2','8.3',115],
['HS-GEO-PRISM-AREA-001','棱柱的表面积','侧面积加底面积','spatial-measure','棱柱表面积由侧面积与两个底面面积组成。','B2','8.3',116],
['HS-GEO-PYRAMID-AREA-001','棱锥的表面积','累加侧面三角形','spatial-measure','棱锥表面积为底面与各侧面三角形面积之和。','B2','8.3',117],
['HS-GEO-CYLINDER-AREA-001','圆柱的表面积','展开矩形侧面','spatial-measure','圆柱侧面展开为矩形，表面积为侧面积与两底面积之和。','B2','8.3',118],
['HS-GEO-CONE-AREA-001','圆锥的表面积','弧长对应扇形','spatial-measure','圆锥侧面展开为扇形，其弧长等于底面周长。','B2','8.3',119],
['HS-GEO-VOLUME-PRISM-001','柱体体积','底面积乘高','spatial-measure','柱体体积等于底面积乘以高。','B2','8.3',120],
['HS-GEO-VOLUME-PYRAMID-001','锥体体积','底面积高的三分之一','spatial-measure','锥体体积等于底面积与高的乘积的三分之一。','B2','8.3',121],
['HS-GEO-VOLUME-SPHERE-001','球的表面积与体积','应用球半径公式','spatial-measure','半径为 r 的球表面积为 4πr²，体积为 4πr³/3。','B2','8.3',122],
['HS-GEO-LINE-PLANE-POSITION-001','空间直线与平面的位置关系','判定相交或平行','spatial-position','直线与平面的位置关系为相交、平行或直线在平面内。','B2','8.4',125],
['HS-GEO-LINE-LINE-POSITION-001','空间两直线的位置关系','区分共面与异面','spatial-position','空间两直线可能相交、平行或异面。','B2','8.4',126],
['HS-GEO-SKEW-LINES-001','异面直线','识别不共面直线','spatial-position','不同在任何一个平面内的两直线为异面直线。','B2','8.4',127],
['HS-GEO-LINE-PLANE-PARALLEL-001','直线与平面平行的判定','寻找平面内平行线','spatial-parallel','平面外一条直线平行于平面内一条直线，则该直线平行于此平面。','B2','8.5',134],
['HS-GEO-LINE-PLANE-PARALLEL-PROPERTY-001','直线与平面平行的性质','交面线保持平行','spatial-parallel','一条直线平行于平面，则过该直线的平面与已知平面的交线平行于该直线。','B2','8.5',135],
['HS-GEO-PLANE-PLANE-PARALLEL-001','平面与平面平行的判定','检验两相交线','spatial-parallel','一个平面内两条相交直线分别平行于另一平面，则两平面平行。','B2','8.5',136],
['HS-GEO-PLANE-PLANE-PARALLEL-PROPERTY-001','平面与平面平行的性质','平行面截线平行','spatial-parallel','两平行平面同时与第三平面相交，所得交线平行。','B2','8.5',137],
['HS-GEO-PLANE-DISTANCE-001','平行平面间距离','用公垂线定义距离','spatial-parallel','两平行平面间的距离是其公垂线段的长度。','B2','8.5',138],
['HS-GEO-ANGLE-LINE-PLANE-001','直线与平面所成角','用射影求锐角','spatial-parallel','斜线与其在平面上的射影所成的锐角为线面角。','B2','8.5',139],
['HS-GEO-LINE-LINE-PERP-001','空间两直线垂直','用方向夹角判断','spatial-perpendicular','相交或异面直线所成角为直角时互相垂直。','B2','8.6',147],
['HS-GEO-LINE-PLANE-PERP-001','直线与平面垂直','垂直于平面内所有方向','spatial-perpendicular','直线垂直于平面内任意直线时垂直于该平面。','B2','8.6',148],
['HS-GEO-LINE-PLANE-PERP-CRITERION-001','线面垂直判定定理','垂直平面内两相交线','spatial-perpendicular','一条直线垂直于平面内两条相交直线，则垂直于该平面。','B2','8.6',149],
['HS-GEO-LINE-PLANE-PERP-PROPERTY-001','线面垂直性质','传递平面内垂线','spatial-perpendicular','垂直于同一平面的两条直线平行。','B2','8.6',150],
['HS-GEO-PLANE-PLANE-PERP-001','平面与平面垂直','判定二面角为直角','spatial-perpendicular','两个平面所成二面角为直二面角时互相垂直。','B2','8.6',151],
['HS-GEO-PLANE-PLANE-PERP-CRITERION-001','面面垂直判定定理','平面含另一面垂线','spatial-perpendicular','一个平面经过另一个平面的垂线，则两平面垂直。','B2','8.6',152],
['HS-GEO-PLANE-PLANE-PERP-PROPERTY-001','面面垂直性质','垂直平面中作垂线','spatial-perpendicular','两个平面垂直时，一个平面内垂直于交线的直线垂直于另一个平面。','B2','8.6',153],
['HS-GEO-DIHEDRAL-ANGLE-001','二面角','用垂直截面量角','spatial-perpendicular','二面角的平面角由棱上点处分别垂直于棱的两条射线构成。','B2','8.6',154],
['HS-GEO-LINE-DISTANCE-001','点到平面的距离','作垂线段求距离','spatial-perpendicular','点到平面的距离为点向平面所作垂线段的长度。','B2','8.6',155],
['HS-GEO-LINE-EQUATION-SLOPE-001','直线斜率','用倾斜角定义斜率','analytic-lines','倾斜角不为直角时，直线斜率为倾斜角的正切。','X1','2.1',52],
['HS-GEO-LINE-EQUATION-POINT-SLOPE-001','点斜式直线方程','已知一点与斜率','analytic-lines','过点 (x₀,y₀) 且斜率为 k 的直线满足 y−y₀=k(x−x₀)。','X1','2.2',59],
['HS-GEO-LINE-EQUATION-FORMS-001','直线方程的常用形式','按条件选方程','analytic-lines','直线可用点斜式、斜截式、两点式或一般式表示。','X1','2.2',60],
['HS-GEO-POINT-LINE-DISTANCE-001','点到直线距离','代入一般式公式','analytic-lines','点到直线 Ax+By+C=0 的距离为 |Ax₀+By₀+C|/√(A²+B²)。','X1','2.3',72],
['HS-GEO-CIRCLE-EQUATION-001','圆的标准方程','确定圆心与半径','analytic-lines','圆心 (a,b)、半径 r 的圆满足 (x−a)²+(y−b)²=r²。','X1','2.4',82],
['HS-GEO-CIRCLE-GENERAL-001','圆的一般方程','识别二次项同系数','analytic-lines','x²+y²+Dx+Ey+F=0 在适当条件下表示圆。','X1','2.4',84],
['HS-GEO-ELLIPSE-001','椭圆定义与标准方程','焦点距离和为常数','conics','椭圆是到两定点距离之和为定值的点集，标准方程由长短轴确定。','X1','3.1',105],
['HS-GEO-ELLIPSE-PARAMETERS-001','椭圆焦点与离心率','由参数定位焦点','conics','椭圆满足 c²=a²−b²，离心率 e=c/a 且 0<e<1。','X1','3.1',107],
['HS-GEO-HYPERBOLA-001','双曲线定义与标准方程','焦点距离差为常数','conics','双曲线是到两定点距离之差的绝对值为定值的点集。','X1','3.2',118],
['HS-GEO-HYPERBOLA-ASYMPTOTE-001','双曲线渐近线与离心率','确定两支趋近方向','conics','双曲线渐近线由标准方程确定，离心率 e=c/a 且 e>1。','X1','3.2',120],
['HS-GEO-PARABOLA-001','抛物线定义与标准方程','到焦点与准线等距','conics','抛物线上各点到定点焦点和定直线准线的距离相等。','X1','3.3',130],
['HS-GEO-CONIC-EQUATION-001','圆锥曲线方程研究','方程反映曲线几何','conics','通过标准方程及其参数研究椭圆、双曲线和抛物线的几何性质。','X1','3.3',132],
];
const modules=[{id:'spatial-basics',nameZh:'基本立体图形'},{id:'spatial-drawings',nameZh:'直观图与三视图'},{id:'spatial-measure',nameZh:'表面积与体积'},{id:'spatial-position',nameZh:'空间位置关系'},{id:'spatial-parallel',nameZh:'空间平行'},{id:'spatial-perpendicular',nameZh:'空间垂直'},{id:'analytic-lines',nameZh:'直线与圆'},{id:'conics',nameZh:'圆锥曲线'}];
const source=(book:Book,section:string,page:number,summary:string):CurriculumSource=>{const offset=book==='B2'?7:5;return{volume:book,sourceRef:`PEP-A:${book}:${book==='B2'?'C8':'C2'}:S${section}`,printedPage:page,pdfPage:page+offset,evidence:{sourceRef:`PEP-A:${book}:${book==='B2'?'C8':'C2'}:S${section}`,printedPage:page,pdfPage:page+offset,evidenceStatus:'DIRECT',summary},scopeNote:`依据人教 A 版${book}教材正文；双页号偏移 ${offset}。`};};
export const geometrySystem={id:'geometry',nameZh:'几何与空间关系',nameEn:'GEOMETRY',description:'立体几何、空间位置关系、直线圆方程及圆锥曲线。',modules,concepts:rows.map(([id,canonicalName,achievementName,moduleId,summary,book,section,page],i)=>({id,canonicalName,achievementName,moduleId,summary,domainId:'geometry',importance:(i%5+1) as 1|2|3|4|5,difficulty:(i%4+2) as 1|2|3|4|5,aliases:[],mathNotationAliases:[],sources:[source(book,section,page,summary)],isKeyAchievement:[2,12,24,31,40,43,45,47].includes(i),keyAchievementRationale:[2,12,24,31,40,43,45,47].includes(i)?'该成果支撑空间位置推理或解析几何的独立解题。':null,reviewStatus:'APPROVED' as const}))} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;
const rationaleByPair=new Map<string,string>([
 ['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-SPACE-AXIOMS-001','空间基本事实描述点、直线和平面的关系。'],['HS-GEO-SPACE-AXIOMS-001>HS-GEO-PLANE-DETERMINATION-001','平面唯一性由空间基本事实支撑。'],['HS-GEO-SPACE-AXIOMS-001>HS-GEO-INTERSECTION-001','相交与交线判断使用空间位置基本事实。'],['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-PRISM-001','棱柱由平面多边形和空间平行关系定义。'],['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-PYRAMID-001','棱锥由底面与空间顶点构成。'],['HS-GEO-PRISM-001>HS-GEO-POLYHEDRON-001','棱柱是多面体的一类。'],['HS-GEO-PYRAMID-001>HS-GEO-POLYHEDRON-001','棱锥是多面体的一类。'],['HS-GEO-CYLINDER-CONE-SPHERE-001>HS-GEO-POLYHEDRON-001','旋转体与多面体按表面构成分类。'],
 ['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-OBLIQUE-PROJECTION-001','直观图投影空间几何对象。'],['HS-GEO-POLYHEDRON-001>HS-GEO-ORTHOGRAPHIC-VIEW-001','三视图从正侧俯方向表达几何体。'],['HS-GEO-ORTHOGRAPHIC-VIEW-001>HS-GEO-RECOGNIZE-SOLID-001','识别几何体依赖读取三视图。'],['HS-GEO-POLYHEDRON-001>HS-GEO-COMBINATION-001','组合体由基本几何体拼接或截取。'],
 ['HS-GEO-POLYHEDRON-001>HS-GEO-SURFACE-AREA-001','表面积求和依赖识别几何体的各表面。'],['HS-GEO-SURFACE-AREA-001>HS-GEO-PRISM-AREA-001','棱柱表面积是一般表面积方法的具体应用。'],['HS-GEO-SURFACE-AREA-001>HS-GEO-PYRAMID-AREA-001','棱锥表面积是一般表面积方法的具体应用。'],['HS-GEO-SURFACE-AREA-001>HS-GEO-CYLINDER-AREA-001','圆柱表面积依赖侧面展开及底面积。'],['HS-GEO-SURFACE-AREA-001>HS-GEO-CONE-AREA-001','圆锥表面积依赖扇形展开与面积。'],['HS-GEO-PRISM-001>HS-GEO-VOLUME-PRISM-001','柱体体积公式应用于棱柱等柱体。'],['HS-GEO-PYRAMID-001>HS-GEO-VOLUME-PYRAMID-001','锥体体积公式应用于棱锥等锥体。'],['HS-GEO-CYLINDER-CONE-SPHERE-001>HS-GEO-VOLUME-SPHERE-001','球的表面积与体积属于旋转体度量。'],
 ['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-LINE-PLANE-POSITION-001','线面位置关系研究空间直线与平面。'],['HS-GEO-POINT-LINE-PLANE-001>HS-GEO-LINE-LINE-POSITION-001','两直线位置关系研究空间中的直线。'],['HS-GEO-LINE-LINE-POSITION-001>HS-GEO-SKEW-LINES-001','异面直线是两直线位置关系的一种。'],
 ['HS-GEO-LINE-PLANE-POSITION-001>HS-GEO-LINE-PLANE-PARALLEL-001','线面平行判定属于线面位置关系。'],['HS-GEO-LINE-PLANE-PARALLEL-001>HS-GEO-LINE-PLANE-PARALLEL-PROPERTY-001','线面平行性质研究判定成立后的交线关系。'],['HS-GEO-LINE-PLANE-PARALLEL-001>HS-GEO-PLANE-PLANE-PARALLEL-001','面面平行判定使用面内直线与另一平面平行。'],['HS-GEO-PLANE-PLANE-PARALLEL-001>HS-GEO-PLANE-PLANE-PARALLEL-PROPERTY-001','面面平行性质以两平面平行为条件。'],['HS-GEO-PLANE-PLANE-PARALLEL-001>HS-GEO-PLANE-DISTANCE-001','平行平面间距离以平面平行为定义前提。'],['HS-GEO-LINE-PLANE-PARALLEL-001>HS-GEO-ANGLE-LINE-PLANE-001','线面角需区分斜线及其平面射影。'],
 ['HS-GEO-LINE-LINE-POSITION-001>HS-GEO-LINE-LINE-PERP-001','空间两直线垂直是其位置与夹角的特例。'],['HS-GEO-LINE-PLANE-POSITION-001>HS-GEO-LINE-PLANE-PERP-001','线面垂直属于线面位置关系。'],['HS-GEO-LINE-LINE-PERP-001>HS-GEO-LINE-PLANE-PERP-CRITERION-001','线面垂直判定检查平面内两条相交直线的垂直性。'],['HS-GEO-LINE-PLANE-PERP-001>HS-GEO-LINE-PLANE-PERP-PROPERTY-001','线面垂直性质以前述垂直关系为条件。'],['HS-GEO-LINE-PLANE-PERP-001>HS-GEO-PLANE-PLANE-PERP-001','面面垂直由相应线面垂直关系刻画。'],['HS-GEO-LINE-PLANE-PERP-001>HS-GEO-PLANE-PLANE-PERP-CRITERION-001','面面垂直判定依赖线面垂直。'],['HS-GEO-PLANE-PLANE-PERP-001>HS-GEO-PLANE-PLANE-PERP-PROPERTY-001','面面垂直性质以前述垂直关系为条件。'],['HS-GEO-PLANE-PLANE-PERP-001>HS-GEO-DIHEDRAL-ANGLE-001','二面角用于度量两个平面的夹角。'],['HS-GEO-LINE-PLANE-PERP-001>HS-GEO-LINE-DISTANCE-001','点到平面的距离由垂线段定义。'],
 ['HS-GEO-LINE-EQUATION-SLOPE-001>HS-GEO-LINE-EQUATION-POINT-SLOPE-001','点斜式用已知斜率表达直线。'],['HS-GEO-LINE-EQUATION-POINT-SLOPE-001>HS-GEO-LINE-EQUATION-FORMS-001','点斜式是直线方程常用形式之一。'],['HS-GEO-LINE-EQUATION-FORMS-001>HS-GEO-POINT-LINE-DISTANCE-001','点到直线距离公式使用直线一般式系数。'],['HS-GEO-CIRCLE-EQUATION-001>HS-GEO-CIRCLE-GENERAL-001','圆的一般方程由标准方程配方得到。'],['HS-GEO-ELLIPSE-001>HS-GEO-ELLIPSE-PARAMETERS-001','椭圆焦点与离心率由其标准参数确定。'],['HS-GEO-HYPERBOLA-001>HS-GEO-HYPERBOLA-ASYMPTOTE-001','渐近线与离心率由双曲线标准方程参数确定。'],['HS-GEO-ELLIPSE-001>HS-GEO-CONIC-EQUATION-001','圆锥曲线方程研究包含椭圆实例。'],['HS-GEO-HYPERBOLA-001>HS-GEO-CONIC-EQUATION-001','圆锥曲线方程研究包含双曲线实例。'],['HS-GEO-PARABOLA-001>HS-GEO-CONIC-EQUATION-001','圆锥曲线方程研究包含抛物线实例。'],
]);
const rowById=new Map(rows.map(row=>[row[0],row]));const relationRows=[...rationaleByPair].map(([pair,reason])=>{const [fromId,toId]=pair.split('>');return{source:rowById.get(fromId)!,target:rowById.get(toId)!,reason};});
const edges:KnowledgeEdge[]=relationRows.map(({source:from,target:to,reason},i)=>{const evidence=[{sourceRef:`PEP-A:${to[5]}:${to[5]==='B2'?'C8':'C2'}:S${to[6]}`,printedPage:to[7],pdfPage:to[7]+(to[5]==='B2'?7:5),evidenceStatus:'DIRECT' as const,summary:`教材第${to[7]}页讨论${to[1]}。`}],record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:`${from[1]}与${to[1]}的数学定义及适用条件。`,definitionAmbiguous:false,prerequisiteCounterfactual:reason,graphContext:`几何体系：${from[1]} → ${to[1]}`,rationale:reason,decision:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]},q=evaluateDependencyQuality(record);return{id:`GEOMETRY-EDGE-${String(i+1).padStart(3,'0')}`,sourceNodeId:from[0],targetNodeId:to[0],dependencyType:'strong',enabled:q.publicationEligible,reviewStatus:q.publicationEligible?'APPROVED':'REVIEW_REQUIRED',...record,qualityDecision:q.decision,qualityConfidence:q.confidence,qualityState:q.state,qualityRationale:reason};});
export const geometryGraph:Graph={nodes:geometrySystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!edges.some(e=>e.targetNodeId===n.id&&e.dependencyType==='strong')})),edges};
export const geometryValidation=validateGraph(geometryGraph);
const bridge={canonicalTextbookEvidence:[{sourceRef:'PEP-A:B2:C8:S8.4',printedPage:124,pdfPage:131,evidenceStatus:'DIRECT' as const,summary:'空间几何研究点线面及其位置关系。'},{sourceRef:'PEP-A:B1:C3:S3.1',printedPage:60,pdfPage:67,evidenceStatus:'DIRECT' as const,summary:'函数图象使用平面直角坐标表达数对关系。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'几何位置关系可由空间对象描述；函数图象由平面中的有序数对构成。',definitionAmbiguous:false,prerequisiteCounterfactual:'函数图象不要求先学完整立体几何。',graphContext:'解析几何与函数图象共享坐标平面表示。',rationale:'保留跨域索引关系，不参与函数解锁。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const geometryCrossDomainReviews=[{sourceNodeId:'HS-GEO-LINE-EQUATION-FORMS-001',targetNodeId:'HS-FUNC-GRAPH-001',sourceDomainId:'geometry',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...bridge,outcome:evaluateDependencyQuality(bridge)}];
export const geometrySeed={...geometrySystem,graph:geometryGraph,publicationEligible:geometryValidation.length===0,crossDomainReviews:geometryCrossDomainReviews};
