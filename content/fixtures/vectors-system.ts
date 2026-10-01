import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

const rows:[string,string,string,string,string,string,number][]=[
 ['HS-VECTOR-CONCEPT-001','平面向量的概念','用有向线段刻画位移','plane-vectors','既有大小又有方向的量称为向量；向量可用有向线段表示。','6.1',2],
 ['HS-VECTOR-MAGNITUDE-001','向量的模','求向量长度','plane-vectors','向量的大小称为模，零向量的模为零。','6.1',3],
 ['HS-VECTOR-EQUALITY-001','相等向量','同向且等长','plane-vectors','方向相同且模相等的向量相等；自由向量可平移。','6.1',4],
 ['HS-VECTOR-OPPOSITE-001','相反向量','模相等方向相反','plane-vectors','模相等且方向相反的向量互为相反向量。','6.1',4],
 ['HS-VECTOR-ZERO-001','零向量','识别零向量','plane-vectors','模为零的向量称为零向量，其方向不确定。','6.1',2],
 ['HS-VECTOR-COLLINEAR-001','共线向量','判断平行方向','plane-vectors','方向相同或相反的非零向量共线；零向量与任意向量共线。','6.1',4],
 ['HS-VECTOR-ADDITION-001','向量加法','首尾相接求和','plane-operations','向量和可用平行四边形法则或三角形法则表示。','6.2',7],
 ['HS-VECTOR-ADDITION-LAWS-001','向量加法运算律','交换与结合','plane-operations','向量加法满足交换律与结合律。','6.2',8],
 ['HS-VECTOR-SUBTRACTION-001','向量减法','转为加相反向量','plane-operations','a−b=a+(−b)，可用三角形法则表示差向量。','6.2',10],
 ['HS-VECTOR-SCALAR-MULTIPLICATION-001','向量数乘','缩放模并调整方向','plane-operations','实数 λ 与向量 a 的数乘改变模；λ 为负时方向反向。','6.2',11],
 ['HS-VECTOR-SCALAR-LAWS-001','数乘运算律','组合线性运算','plane-operations','数乘满足分配律、结合律及单位数乘性质。','6.2',12],
 ['HS-VECTOR-COLLINEAR-THEOREM-001','共线向量基本定理','用实数表示共线','plane-operations','非零向量 a 与 b 共线当且仅当存在唯一实数 λ 使 b=λa。','6.2',13],
 ['HS-VECTOR-LINEAR-COMBINATION-001','向量的线性运算','合并加法与数乘','plane-operations','向量的线性运算由加法和数乘构成并满足相应运算律。','6.2',15],
 ['HS-VECTOR-POSITION-001','向量表示点的位置','用起点终点表示','plane-operations','以点 O 为起点的向量可表示点 A 相对 O 的位置。','6.2',16],
 ['HS-VECTOR-PARALLELOGRAM-001','平行四边形法则','用两邻边求对角线','plane-operations','以同一点为起点的两个向量之和对应平行四边形对角线。','6.2',17],
 ['HS-VECTOR-DOT-PRODUCT-001','平面向量数量积','模与夹角定义','plane-dot-product','a·b=|a||b|cosθ，其中 θ 为两向量夹角。','6.2',18],
 ['HS-VECTOR-DOT-COMPUTE-001','数量积的坐标与几何计算','用夹角或投影计算','plane-dot-product','数量积可借助长度、夹角及投影关系计算。','6.2',19],
 ['HS-VECTOR-DOT-LAWS-001','数量积运算律','交换分配但非结合','plane-dot-product','数量积满足交换律及对向量加法的分配律，一般不满足结合律。','6.2',20],
 ['HS-VECTOR-ORTHOGONAL-001','向量垂直条件','数量积为零','plane-dot-product','两非零向量垂直当且仅当数量积为零。','6.2',21],
 ['HS-VECTOR-BASIS-001','平面向量基本定理','选取一组基底','plane-coordinates','平面内两个不共线向量可作为基底，每个向量可唯一表示为其线性组合。','6.3',25],
 ['HS-VECTOR-COORDINATES-001','向量的坐标表示','分解到基底方向','plane-coordinates','选定平面直角坐标系后，向量可用两个实数坐标表示。','6.3',26],
 ['HS-VECTOR-COORDINATE-OPERATIONS-001','向量坐标运算','逐分量运算','plane-coordinates','向量和、差及数乘可按坐标分量逐项计算。','6.3',27],
 ['HS-VECTOR-COORDINATE-MAGNITUDE-001','向量模的坐标公式','平方和开方','plane-coordinates','若 a=(x,y)，则 |a|=√(x²+y²)。','6.3',28],
 ['HS-VECTOR-COORDINATE-DOT-001','数量积的坐标公式','坐标乘积求和','plane-coordinates','若 a=(x₁,y₁)、b=(x₂,y₂)，则 a·b=x₁x₂+y₁y₂。','6.3',28],
 ['HS-VECTOR-ANGLE-COORDINATE-001','用坐标求向量夹角','点积归一求余弦','plane-coordinates','非零向量夹角余弦等于坐标点积除以两模乘积。','6.3',29],
 ['HS-VECTOR-APPLICATION-TRIANGLE-001','向量解决平面几何问题','向量化几何关系','plane-applications','用向量加法、共线及数量积关系表达几何条件并推理。','6.4',38],
 ['HS-VECTOR-DISTANCE-001','向量与距离计算','位置差等于位移','plane-applications','两点距离可由位置向量之差的模求出。','6.4',39],
 ['HS-VECTOR-AREA-001','向量与三角形面积','底高或坐标求面积','plane-applications','利用向量长度、夹角或坐标行列式求三角形面积。','6.4',40],
 ['HS-VECTOR-PROJECTION-001','向量投影','分解平行分量','plane-applications','向量在另一向量方向上的投影由夹角余弦和模确定。','6.4',42],
 ['HS-VECTOR-PHYSICS-001','向量的实际应用','描述力与位移','plane-applications','向量可刻画力、位移等具有大小和方向的量。','6.4',44],
];
const modules=[{id:'plane-vectors',nameZh:'向量概念'},{id:'plane-operations',nameZh:'向量运算'},{id:'plane-dot-product',nameZh:'数量积'},{id:'plane-coordinates',nameZh:'坐标表示'},{id:'plane-applications',nameZh:'平面应用'}];
const source=(section:string,page:number,summary:string):CurriculumSource=>({volume:'B2',sourceRef:`PEP-A:B2:C6:S${section}`,printedPage:page,pdfPage:page+7,evidence:{sourceRef:`PEP-A:B2:C6:S${section}`,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT',summary},scopeNote:'依据人教 A 版必修第二册第六章正文页；pdf_page 与 printed_page 偏移 +7。'});
export const vectorsSystem={id:'vectors',nameZh:'平面向量',nameEn:'VECTORS',description:'平面向量的概念、线性运算、数量积、坐标表示及几何应用。',modules,concepts:rows.map(([id,canonicalName,achievementName,moduleId,summary,section,page],i)=>({id,canonicalName,achievementName,moduleId,summary,domainId:'vectors',importance:(i%5+1) as 1|2|3|4|5,difficulty:(i%4+2) as 1|2|3|4|5,aliases:[],mathNotationAliases:[],sources:[source(section,page,summary)],isKeyAchievement:['HS-VECTOR-ADDITION-001','HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-BASIS-001','HS-VECTOR-APPLICATION-TRIANGLE-001'].includes(id),keyAchievementRationale:['HS-VECTOR-ADDITION-001','HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-BASIS-001','HS-VECTOR-APPLICATION-TRIANGLE-001'].includes(id)?'该成果支撑向量运算或几何问题的独立建模。':null,reviewStatus:'APPROVED' as const}))} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;
const vectorRelations:readonly [string,string,string][]=[
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-MAGNITUDE-001','向量的模是向量大小的定义，需要先知道向量具有大小和方向。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-EQUALITY-001','相等向量的判定依赖向量的方向与大小两个组成特征。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-ZERO-001','零向量是模为零的特殊向量。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-COLLINEAR-001','共线描述两个向量方向相同或相反的几何关系。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-ADDITION-001','向量加法以向量作为运算对象。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-SCALAR-MULTIPLICATION-001','数乘把实数作用于向量并改变其模或方向。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-DOT-PRODUCT-001','数量积以向量模与夹角定义。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-POSITION-001','位置向量用向量表示点相对起点的位置。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-BASIS-001','平面向量基本定理以平面向量及其线性组合为研究对象。'],
 ['HS-VECTOR-CONCEPT-001','HS-VECTOR-PHYSICS-001','力和位移等物理量用向量刻画大小与方向。'],
 ['HS-VECTOR-ADDITION-001','HS-VECTOR-ADDITION-LAWS-001','加法交换律与结合律是向量加法的运算性质。'],
 ['HS-VECTOR-ADDITION-001','HS-VECTOR-PARALLELOGRAM-001','平行四边形法则解释两个向量相加的几何结果。'],
 ['HS-VECTOR-ZERO-001','HS-VECTOR-OPPOSITE-001','相反向量的大小相等且方向相反，零向量是其边界情形。'],
 ['HS-VECTOR-EQUALITY-001','HS-VECTOR-OPPOSITE-001','相反向量由等模与反向确定。'],
 ['HS-VECTOR-ADDITION-001','HS-VECTOR-SUBTRACTION-001','向量减法定义为加上被减向量的相反向量。'],
 ['HS-VECTOR-OPPOSITE-001','HS-VECTOR-SUBTRACTION-001','向量减法需要先构造相反向量。'],
 ['HS-VECTOR-SCALAR-MULTIPLICATION-001','HS-VECTOR-SCALAR-LAWS-001','数乘运算律描述实数与向量数乘的组合关系。'],
 ['HS-VECTOR-COLLINEAR-001','HS-VECTOR-COLLINEAR-THEOREM-001','共线向量基本定理把几何共线转化为唯一实数倍关系。'],
 ['HS-VECTOR-ADDITION-LAWS-001','HS-VECTOR-LINEAR-COMBINATION-001','线性运算需要向量加法及其运算律。'],
 ['HS-VECTOR-SCALAR-LAWS-001','HS-VECTOR-LINEAR-COMBINATION-001','线性运算由加法与数乘及其运算律组成。'],
 ['HS-VECTOR-POSITION-001','HS-VECTOR-DISTANCE-001','两点距离等于相应位置向量之差的模。'],
 ['HS-VECTOR-BASIS-001','HS-VECTOR-COORDINATES-001','向量坐标是相对于选定基底的唯一系数表示。'],
 ['HS-VECTOR-COORDINATES-001','HS-VECTOR-COORDINATE-OPERATIONS-001','坐标运算逐分量表示向量的和、差与数乘。'],
 ['HS-VECTOR-LINEAR-COMBINATION-001','HS-VECTOR-COORDINATE-OPERATIONS-001','坐标运算规则对应向量线性运算的分量表达。'],
 ['HS-VECTOR-COORDINATES-001','HS-VECTOR-COORDINATE-MAGNITUDE-001','坐标模公式由坐标分量及勾股定理得到。'],
 ['HS-VECTOR-MAGNITUDE-001','HS-VECTOR-COORDINATE-MAGNITUDE-001','坐标模公式计算的是向量的模。'],
 ['HS-VECTOR-COORDINATES-001','HS-VECTOR-COORDINATE-DOT-001','坐标数量积公式把几何数量积写成分量运算。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-COORDINATE-DOT-001','分量点积公式是几何数量积在正交坐标基下的表达。'],
 ['HS-VECTOR-COORDINATE-DOT-001','HS-VECTOR-ANGLE-COORDINATE-001','坐标求夹角要先计算坐标数量积。'],
 ['HS-VECTOR-COORDINATE-MAGNITUDE-001','HS-VECTOR-ANGLE-COORDINATE-001','坐标求夹角的余弦分母由两个向量的模组成。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-DOT-COMPUTE-001','数量积可按其定义用长度、夹角和投影计算。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-DOT-LAWS-001','交换律与分配律是数量积的运算性质。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-ORTHOGONAL-001','垂直判定由数量积为零得到。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-PROJECTION-001','向量投影由数量积、模和夹角定义。'],
 ['HS-VECTOR-MAGNITUDE-001','HS-VECTOR-PROJECTION-001','投影长度计算需要向量模。'],
 ['HS-VECTOR-MAGNITUDE-001','HS-VECTOR-AREA-001','三角形面积计算需要边向量的模。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-AREA-001','由两边夹角求面积需要数量积确定夹角余弦。'],
 ['HS-VECTOR-ADDITION-001','HS-VECTOR-APPLICATION-TRIANGLE-001','向量加法用于表示平面几何中的边和位移关系。'],
 ['HS-VECTOR-COLLINEAR-THEOREM-001','HS-VECTOR-APPLICATION-TRIANGLE-001','几何共线条件可用向量基本定理转化为数乘关系。'],
 ['HS-VECTOR-DOT-PRODUCT-001','HS-VECTOR-APPLICATION-TRIANGLE-001','数量积可把垂直、夹角等几何条件转化为代数关系。'],
];
const conceptById=new Map(rows.map(row=>[row[0],row]));
const edges:KnowledgeEdge[]=vectorRelations.map(([sourceNodeId,targetNodeId,reason],i)=>{const from=conceptById.get(sourceNodeId)!,to=conceptById.get(targetNodeId)!;const ref=`PEP-A:B2:C6:S${to[5]}`,evidence=[{sourceRef:ref,printedPage:to[6],pdfPage:to[6]+7,evidenceStatus:'DIRECT' as const,summary:`教材第${to[6]}页定位到目标概念“${to[1]}”；此证据不单独证明该前置关系。`}],record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:`${from[1]}与${to[1]}的数学定义及应用条件。`,definitionAmbiguous:false,prerequisiteCounterfactual:reason,graphContext:`平面向量：${from[1]} → ${to[1]}`,rationale:reason,decision:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]},q=evaluateDependencyQuality(record);return{id:`VECTOR-EDGE-${String(i+1).padStart(3,'0')}`,sourceNodeId,targetNodeId,dependencyType:'strong',enabled:q.publicationEligible,reviewStatus:q.publicationEligible?'APPROVED':'REVIEW_REQUIRED',...record,qualityDecision:q.decision,qualityConfidence:q.confidence,qualityState:q.state,qualityRationale:reason};});
export const vectorsGraph:Graph={nodes:vectorsSystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!edges.some(edge=>edge.enabled&&edge.dependencyType==='strong'&&edge.targetNodeId===n.id)})),edges};
export const vectorsValidation=validateGraph(vectorsGraph);
const bridge={canonicalTextbookEvidence:[{sourceRef:'PEP-A:B2:C6:S6.1',printedPage:2,pdfPage:9,evidenceStatus:'DIRECT' as const,summary:'向量以有向线段表示方向与大小。'},{sourceRef:'PEP-A:B1:C3:S3.1',printedPage:60,pdfPage:67,evidenceStatus:'DIRECT' as const,summary:'函数图象使用平面直角坐标表示输入输出关系。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'向量有方向和大小；平面直角坐标系为向量提供坐标表示。',definitionAmbiguous:false,prerequisiteCounterfactual:'平面向量的几何定义可在不先学习函数概念的情况下建立。',graphContext:'向量坐标与函数图象共享平面坐标系。',rationale:'关联用于跨域导航，不作为学习前置。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const vectorsCrossDomainReviews=[{sourceNodeId:'HS-VECTOR-COORDINATES-001',targetNodeId:'HS-FUNC-GRAPH-001',sourceDomainId:'vectors',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...bridge,outcome:evaluateDependencyQuality(bridge)}];
export const vectorsSeed={...vectorsSystem,graph:vectorsGraph,publicationEligible:vectorsValidation.length===0,crossDomainReviews:vectorsCrossDomainReviews};
