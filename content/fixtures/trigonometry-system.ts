import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumConcept,CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph,GraphNode} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

const source=(section:string,page:number,summary:string):CurriculumSource=>({
 volume:'B1',sourceRef:`PEP-A:B1:C5:S${section}`,printedPage:page,pdfPage:page+7,
 evidence:{sourceRef:`PEP-A:B1:C5:S${section}`,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT',summary},
 scopeNote:'按人教 A 版必修第一册正文定位；教材版本细节见 TEXTBOOK-SOURCE.md。',
});
const keyConceptIds=new Set(['HS-TRIG-SINCOS-001','HS-TRIG-IDENTITY-TRANSFORM-001','HS-TRIG-SINUSOIDAL-FAMILY-001','HS-TRIG-MODEL-APPLICATION-001']);
const concept=(id:string,canonicalName:string,achievementName:string,moduleId:string,summary:string,section:string,page:number,importance:1|2|3|4|5=3,difficulty:1|2|3|4|5=2):CurriculumConcept=>({
 id,canonicalName,achievementName,domainId:'trigonometry',moduleId,summary,importance,difficulty,aliases:[],mathNotationAliases:[],
 sources:[source(section,page,summary)],isKeyAchievement:keyConceptIds.has(id),keyAchievementRationale:keyConceptIds.has(id)?'掌握后可独立运用该模块的核心概念或模型。':null,reviewStatus:'APPROVED',
});

export const trigonometrySystem={
 id:'trigonometry',nameZh:'三角函数',nameEn:'Trigonometry',description:'任意角、单位圆、三角函数、恒等变换、图象性质与周期模型。',
 modules:[{id:'angles',nameZh:'角与弧度'},{id:'definitions',nameZh:'函数定义'},{id:'identities',nameZh:'公式与恒等变换'},{id:'graphs',nameZh:'图象与性质'},{id:'modeling',nameZh:'周期模型与应用'}],
 concepts:[
  concept('HS-TRIG-ANGLE-001','任意角','旋转的方向','angles','以射线旋转定义角，并区分正角、负角和零角。','5.1',168),
  concept('HS-TRIG-QUADRANT-001','象限角','终边落在哪','angles','角的顶点置于原点、始边置于 x 轴非负半轴后，按终边位置分类。','5.1',169),
  concept('HS-TRIG-COTERMINAL-001','终边相同的角','绕回同一位置','angles','终边相同的角相差整数个周角。','5.1',170),
  concept('HS-TRIG-RADIAN-001','弧度制','用弧长量角','angles','以弧长与半径之比定义弧度数。','5.1',172),
  concept('HS-TRIG-DEGREE-RADIAN-001','角度与弧度互化','两种单位互换','angles','利用 180°=π rad 在角度制与弧度制间互化。','5.1',173),
  concept('HS-TRIG-ARC-LENGTH-001','弧长公式','角度决定弧长','angles','在弧度制下使用 l=rα 计算圆弧长度。','5.1',174),
  concept('HS-TRIG-SECTOR-AREA-001','扇形面积公式','弧与面积相连','angles','在弧度制下由弧长或圆心角计算扇形面积。','5.1',174),
  concept('HS-TRIG-UNIT-CIRCLE-001','单位圆','半径为一的圆','definitions','以原点为圆心、半径为 1 的圆，为任意角三角函数提供统一几何模型。','5.2',177,4,3),
  concept('HS-TRIG-SINCOS-001','任意角的正弦与余弦','圆上的坐标','definitions','终边与单位圆交点的纵、横坐标分别定义正弦与余弦。','5.2',178,4,3),
  concept('HS-TRIG-TAN-001','任意角的正切','正弦除以余弦','definitions','在余弦不为零时定义 tan α=sin α/cos α。','5.2',180),
  concept('HS-TRIG-SIGNS-001','三角函数值的符号','象限决定正负','definitions','依据终边所在象限判断正弦、余弦、正切的符号。','5.2',180),
  concept('HS-TRIG-SPECIAL-VALUES-001','特殊角三角函数值','记住关键坐标','definitions','求常用特殊角的正弦、余弦和正切精确值。','5.2',181),
  concept('HS-TRIG-QUOTIENT-IDENTITY-001','正切的商数关系','用正余弦求正切','identities','在定义域条件下使用 tan α=sin α/cos α。','5.2',182),
  concept('HS-TRIG-PYTHAGOREAN-IDENTITY-001','同角三角函数基本关系','平方和为一','identities','由单位圆得到 sin²α+cos²α=1，并在合法条件下作等价变形。','5.2',183,4,3),
  concept('HS-TRIG-INDUCED-FORMULAS-001','诱导公式','化角到熟悉范围','identities','利用对称和周期把相关角的三角函数转化为锐角三角函数。','5.3',188,4,3),
  concept('HS-TRIG-SIN-GRAPH-001','正弦函数图象','描出正弦曲线','graphs','用关键角取值与周期性绘制 y=sin x 的图象。','5.4',196,4,3),
  concept('HS-TRIG-COS-GRAPH-001','余弦函数图象','描出余弦曲线','graphs','用关键角取值与周期性绘制 y=cos x 的图象。','5.4',198,4,3),
  concept('HS-TRIG-PERIODICITY-001','三角函数周期性','重复出现的函数值','graphs','识别正弦、余弦、正切函数的周期及其图象重复规律。','5.4',199,4,3),
  concept('HS-TRIG-SIN-COS-PROPERTIES-001','正弦与余弦的图象性质','周期内读性质','graphs','从图象确定正弦、余弦的定义域、值域、单调区间与最值。','5.4',203,4,3),
  concept('HS-TRIG-TAN-GRAPH-001','正切函数图象','渐近线间的曲线','graphs','依据定义域和周期绘制正切曲线并识别垂直渐近线。','5.4',209,3,3),
  concept('HS-TRIG-TAN-PROPERTIES-001','正切函数的图象性质','识别正切变化','graphs','依据正切曲线确定定义域、值域、周期和单调性。','5.4',211,3,3),
  concept('HS-TRIG-SUM-DIFFERENCE-001','两角和与差公式','合角拆成两角','identities','使用正弦、余弦的两角和差公式计算或证明等式。','5.5',215,5,4),
  concept('HS-TRIG-DOUBLE-ANGLE-001','二倍角公式','把两角变成一角','identities','由两角和公式推出并使用二倍角公式。','5.5',219,4,3),
  concept('HS-TRIG-IDENTITY-TRANSFORM-001','三角恒等变换','等价变形求值证明','identities','选择诱导、和差、倍角等公式化简、求值或证明三角恒等式。','5.5',222,5,4),
  concept('HS-TRIG-SINUSOIDAL-FAMILY-001','函数 y=A sin(ωx+φ)','三个参数塑造波形','graphs','研究 A>0、ω>0 时正弦型函数的图象与基本变换。','5.6',231,5,4),
  concept('HS-TRIG-SINUSOIDAL-PARAMETERS-001','振幅、周期与相位','读懂正弦型参数','graphs','由 A、ω、φ 判断振幅、周期及相位变化。','5.6',233,4,3),
  concept('HS-TRIG-PERIODIC-MODELING-001','周期现象的三角函数模型','用波形描述周期','modeling','从周期数据或图象估计参数，建立并解释正弦型模型。','5.7',242,5,4),
  concept('HS-TRIG-MODEL-APPLICATION-001','三角函数模型的实际应用','把周期关系用于决策','modeling','把周期模型用于电流、运动或潮汐等情境，并解释解的实际意义。','5.7',245,4,4),
 ] as const,
} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;

const conceptById=new Map(trigonometrySystem.concepts.map(node=>[node.id,node]));
type Relation={source:string;target:string;because:string;section:string;page:number;type?:'strong'|'weak'};
const relations:readonly Relation[]=[
 {source:'HS-TRIG-ANGLE-001',target:'HS-TRIG-QUADRANT-001',because:'象限角的分类以任意角的始边、终边约定为基础。',section:'5.1',page:169},
 {source:'HS-TRIG-ANGLE-001',target:'HS-TRIG-COTERMINAL-001',because:'终边相同的角由任意角旋转整周的定义得到。',section:'5.1',page:170},
 {source:'HS-TRIG-ANGLE-001',target:'HS-TRIG-RADIAN-001',because:'弧度是对任意角大小的度量方式。',section:'5.1',page:172},
 {source:'HS-TRIG-RADIAN-001',target:'HS-TRIG-DEGREE-RADIAN-001',because:'角度与弧度互化直接使用弧度定义及半周对应 π。',section:'5.1',page:173},
 {source:'HS-TRIG-RADIAN-001',target:'HS-TRIG-ARC-LENGTH-001',because:'弧长公式 l=rα 中 α 必须按弧度计量。',section:'5.1',page:174},
 {source:'HS-TRIG-ARC-LENGTH-001',target:'HS-TRIG-SECTOR-AREA-001',because:'扇形面积可由弧长与半径计算。',section:'5.1',page:174},
 {source:'HS-TRIG-RADIAN-001',target:'HS-TRIG-UNIT-CIRCLE-001',because:'单位圆上的角位置按弧度表示并用于定义任意角函数。',section:'5.2',page:177},
 {source:'HS-TRIG-UNIT-CIRCLE-001',target:'HS-TRIG-SINCOS-001',because:'正弦与余弦由终边和单位圆交点坐标定义。',section:'5.2',page:178},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-TAN-001',because:'正切由正弦与余弦之商定义，且需检查余弦非零。',section:'5.2',page:180},
 {source:'HS-TRIG-QUADRANT-001',target:'HS-TRIG-SIGNS-001',because:'三角函数值符号按角终边所在象限分类。',section:'5.2',page:180},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-SIGNS-001',because:'正弦和余弦的符号来自单位圆交点坐标的正负。',section:'5.2',page:180},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-SPECIAL-VALUES-001',because:'特殊角精确值由单位圆上相应交点坐标求得。',section:'5.2',page:181},
 {source:'HS-TRIG-TAN-001',target:'HS-TRIG-QUOTIENT-IDENTITY-001',because:'商数关系是正切定义的等价表达，使用时必须保留定义域条件。',section:'5.2',page:182},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-PYTHAGOREAN-IDENTITY-001',because:'单位圆坐标满足 x²+y²=1，从而得到正弦余弦平方和关系。',section:'5.2',page:183},
 {source:'HS-TRIG-COTERMINAL-001',target:'HS-TRIG-INDUCED-FORMULAS-001',because:'诱导关系使用终边相同角与对称角之间的对应关系。',section:'5.3',page:188},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-INDUCED-FORMULAS-001',because:'诱导公式将不同角的正弦余弦值联系起来。',section:'5.3',page:188},
 {source:'HS-TRIG-SPECIAL-VALUES-001',target:'HS-TRIG-SIN-GRAPH-001',because:'正弦曲线通过关键角的精确函数值描点构造。',section:'5.4',page:196},
 {source:'HS-TRIG-SPECIAL-VALUES-001',target:'HS-TRIG-COS-GRAPH-001',because:'余弦曲线通过关键角的精确函数值描点构造。',section:'5.4',page:198},
 {source:'HS-TRIG-COTERMINAL-001',target:'HS-TRIG-PERIODICITY-001',because:'角相差整周时终边相同，导出三角函数值的周期性。',section:'5.4',page:199},
 {source:'HS-TRIG-SIN-GRAPH-001',target:'HS-TRIG-SIN-COS-PROPERTIES-001',because:'正弦的值域、单调区间和最值从其周期图象读取。',section:'5.4',page:203},
 {source:'HS-TRIG-COS-GRAPH-001',target:'HS-TRIG-SIN-COS-PROPERTIES-001',because:'余弦的值域、单调区间和最值从其周期图象读取。',section:'5.4',page:203},
 {source:'HS-TRIG-PERIODICITY-001',target:'HS-TRIG-SIN-COS-PROPERTIES-001',because:'报告三角函数性质时需利用一个基本周期覆盖全部图象。',section:'5.4',page:203},
 {source:'HS-TRIG-TAN-001',target:'HS-TRIG-TAN-GRAPH-001',because:'正切定义域限制与周期性共同决定正切曲线形状。',section:'5.4',page:209},
 {source:'HS-TRIG-TAN-GRAPH-001',target:'HS-TRIG-TAN-PROPERTIES-001',because:'正切函数性质由其周期曲线及渐近线确定。',section:'5.4',page:211},
 {source:'HS-TRIG-SINCOS-001',target:'HS-TRIG-SUM-DIFFERENCE-001',because:'和差公式表达两个角的正弦余弦与其和差角的关系。',section:'5.5',page:215},
 {source:'HS-TRIG-SUM-DIFFERENCE-001',target:'HS-TRIG-DOUBLE-ANGLE-001',because:'令和差公式中的两个角相等可推出二倍角公式。',section:'5.5',page:219},
 {source:'HS-TRIG-INDUCED-FORMULAS-001',target:'HS-TRIG-IDENTITY-TRANSFORM-001',because:'诱导公式是三角恒等变换中化角与化函数的重要规则。',section:'5.5',page:222},
 {source:'HS-TRIG-SUM-DIFFERENCE-001',target:'HS-TRIG-IDENTITY-TRANSFORM-001',because:'和差公式可直接用于恒等变换，但强依赖路径已由二倍角公式覆盖，故保留为理解性弱关系。',section:'5.5',page:222,type:'weak'},
 {source:'HS-TRIG-DOUBLE-ANGLE-001',target:'HS-TRIG-IDENTITY-TRANSFORM-001',because:'二倍角公式用于三角恒等式的等价变形。',section:'5.5',page:222},
 {source:'HS-TRIG-SIN-GRAPH-001',target:'HS-TRIG-SINUSOIDAL-FAMILY-001',because:'正弦型函数图象由标准正弦函数图象经过参数变换得到。',section:'5.6',page:231},
 {source:'HS-TRIG-SINUSOIDAL-FAMILY-001',target:'HS-TRIG-SINUSOIDAL-PARAMETERS-001',because:'振幅、周期和相位由正弦型函数的参数决定。',section:'5.6',page:233},
 {source:'HS-TRIG-SINUSOIDAL-PARAMETERS-001',target:'HS-TRIG-PERIODIC-MODELING-001',because:'拟合周期数据需从图象或数据确定振幅、周期和相位参数。',section:'5.7',page:242},
 {source:'HS-TRIG-SINUSOIDAL-FAMILY-001',target:'HS-TRIG-PERIODIC-MODELING-001',because:'周期模型使用正弦型函数，但强依赖路径已由参数分析覆盖，故保留为理解性弱关系。',section:'5.7',page:242,type:'weak'},
 {source:'HS-TRIG-PERIODIC-MODELING-001',target:'HS-TRIG-MODEL-APPLICATION-001',because:'实际应用在建立周期模型后求解情境条件并解释结果。',section:'5.7',page:245},
];

const makeEdge=({source,target,because,section,page,type='strong'}:Relation,index:number):KnowledgeEdge=>{
 const sourceRef=`PEP-A:B1:C5:S${section}`;
 const evidence=[{sourceRef,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT' as const,summary:`教材第${page}页起讨论${conceptById.get(target)!.canonicalName}；此定位证明相关概念存在，不单独决定前置关系。`}];
 const record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,
  mathematicalDefinition:`${conceptById.get(source)!.canonicalName}与${conceptById.get(target)!.canonicalName}按高中数学定义使用。`,definitionAmbiguous:false,
  prerequisiteCounterfactual:because,graphContext:`三角函数体系内：${conceptById.get(source)!.canonicalName} → ${conceptById.get(target)!.canonicalName}。`,
  rationale:because,decision:type==='weak'?'DOWNGRADE_TO_WEAK' as const:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]};
 const outcome=evaluateDependencyQuality(record);
 return {id:`TRIG-EDGE-${String(index+1).padStart(3,'0')}`,sourceNodeId:source,targetNodeId:target,
  dependencyType:type,rationale:because,enabled:outcome.publicationEligible,reviewStatus:outcome.publicationEligible?'APPROVED':'REVIEW_REQUIRED',
  canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:record.mathematicalDefinition,
  prerequisiteCounterfactual:record.prerequisiteCounterfactual,graphContext:record.graphContext,definitionAmbiguous:false,
  qualityDecision:outcome.decision,qualityConfidence:outcome.confidence,qualityState:outcome.state,qualityRationale:because,aiReviews:[]};
};
export const trigonometryEdges:readonly KnowledgeEdge[]=relations.map(makeEdge);
const graphNodes:GraphNode[]=trigonometrySystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!trigonometryEdges.some(e=>e.enabled&&e.dependencyType==='strong'&&e.targetNodeId===n.id)}));
export const trigonometryGraph:Graph={nodes:graphNodes,edges:trigonometryEdges};
export const trigonometryValidation=validateGraph(trigonometryGraph);
const functionBridge={canonicalTextbookEvidence:[{sourceRef:'PEP-A:B1:C3:S3.1',printedPage:60,pdfPage:67,evidenceStatus:'DIRECT' as const,summary:'函数章节给出函数的一般定义。'},{sourceRef:'PEP-A:B1:C5:S5.2',printedPage:178,pdfPage:185,evidenceStatus:'DIRECT' as const,summary:'三角函数可由单位圆与任意角定义。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'函数是定义域中每个输入唯一对应一个函数值的对应关系；三角函数可由单位圆坐标独立定义。',definitionAmbiguous:false,prerequisiteCounterfactual:'可先通过单位圆定义任意角的正弦和余弦，不必先完成抽象函数概念专题。',graphContext:'一般函数概念帮助解释正弦余弦的函数性质，但单位圆路线可独立建立三角函数。',rationale:'保留函数概念与正弦余弦之间的导航关联，不作为三角函数图谱的解锁前置。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const trigonometryCrossDomainReviews=[{sourceNodeId:'HS-FUNC-CONCEPT-001',targetNodeId:'HS-TRIG-SINCOS-001',sourceDomainId:'functions',targetDomainId:'trigonometry',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...functionBridge,outcome:evaluateDependencyQuality(functionBridge)}];
export const trigonometrySeed={...trigonometrySystem,graph:trigonometryGraph,publicationEligible:trigonometryValidation.length===0,crossDomainReviews:trigonometryCrossDomainReviews};
