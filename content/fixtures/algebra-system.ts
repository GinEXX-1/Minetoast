import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumConcept,CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph,GraphNode} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

const source=(section:string,page:number,summary:string):CurriculumSource=>({volume:'B1',sourceRef:`PEP-A:B1:C2:S${section}`,printedPage:page,pdfPage:page+7,evidence:{sourceRef:`PEP-A:B1:C2:S${section}`,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT',summary},scopeNote:'依据人教 A 版必修第一册第二章正文；教材版本与页码核验状态见 TEXTBOOK-SOURCE.md。'});
type Row=[id:string,name:string,achievement:string,module:string,summary:string,section:string,page:number,importance?:1|2|3|4|5,difficulty?:1|2|3|4|5];
const keyIds=new Set(['HS-INEQUALITY-PROPERTIES-001','HS-BASIC-INEQUALITY-001','HS-QUADRATIC-INEQUALITY-SOLVE-001','HS-QUADRATIC-FUNCTION-EQUATION-INEQUALITY-001']);
const concept=([id,canonicalName,achievementName,moduleId,summary,section,page,importance=3,difficulty=2]:Row):CurriculumConcept=>({id,canonicalName,achievementName,moduleId,summary,domainId:'algebra',importance,difficulty,aliases:[],mathNotationAliases:[],sources:[source(section,page,summary)],isKeyAchievement:keyIds.has(id),keyAchievementRationale:keyIds.has(id)?'该成果用于独立处理不等式推理或二次函数与方程不等式综合问题。':null,reviewStatus:'APPROVED'});

export const algebraSystem={id:'algebra',nameZh:'代数与不等式',nameEn:'ALGEBRA & INEQUALITIES',description:'实数大小、不等式性质、基本不等式及二次函数与方程不等式的联系。',modules:[{id:'inequality-basics',nameZh:'不等式性质'},{id:'basic-inequality',nameZh:'基本不等式'},{id:'quadratics',nameZh:'二次函数与不等式'}],concepts:[
 concept(['HS-INEQUALITY-CONCEPT-001','不等关系与不等式','用式子表达大小关系','inequality-basics','相等关系用等式表示，不等关系可用不等式或不等式组刻画。','2.1',37,3,2]),
 concept(['HS-REAL-ORDER-001','实数大小关系基本事实','比较差与零','inequality-basics','a>b、a=b、a<b 分别等价于 a−b>0、a−b=0、a−b<0。','2.1',38,4,3]),
 concept(['HS-INEQUALITY-PROPERTIES-001','不等式的基本性质','保持方向或反向','inequality-basics','不等式两边加同一数保持方向；同乘正数保持方向，同乘负数反向；大小关系具传递性。','2.1',40,5,4]),
 concept(['HS-INEQUALITY-ADD-001','不等式同加与移项','同加不改变方向','inequality-basics','若 a>b，则 a+c>b+c；移项时改变该项符号。','2.1',41,3,2]),
 concept(['HS-INEQUALITY-MULTIPLY-001','不等式同乘与同除','判断乘数符号','inequality-basics','两边同乘或同除正数不改变方向，乘或除负数时方向反转。','2.1',41,4,3]),
 concept(['HS-INEQUALITY-COMPOUND-001','不等式的合并传递','逐项比较后合并','inequality-basics','若 a>b 且 c>d，则 a+c>b+d；正数因子可用于传递乘法比较。','2.1',42,3,3]),
 concept(['HS-INEQUALITY-SQUARE-001','平方差与非负性','用平方证大小','inequality-basics','(a−b)²≥0 给出 a²+b²≥2ab，等号当且仅当 a=b。','2.1',39,4,3]),
 concept(['HS-BASIC-INEQUALITY-001','基本不等式','算术平均不小于几何平均','basic-inequality','a,b>0 时 (a+b)/2≥√(ab)，等号当且仅当 a=b。','2.2',44,5,4]),
 concept(['HS-BASIC-INEQUALITY-EQUALITY-001','基本不等式的等号条件','检验正数且相等','basic-inequality','基本不等式取等须满足两个正数相等；最值题还须保证该条件可取到。','2.2',45,4,4]),
 concept(['HS-BASIC-INEQUALITY-MINIMUM-001','定积求和最小值','乘积固定时均值最小','basic-inequality','x,y>0 且 xy=P 时，x+y≥2√P，等号在 x=y=√P 取得。','2.2',45,4,3]),
 concept(['HS-BASIC-INEQUALITY-MAXIMUM-001','定和求积最大值','和固定时乘积最大','basic-inequality','x,y>0 且 x+y=S 时，xy≤S²/4，等号在 x=y=S/2 取得。','2.2',45,4,3]),
 concept(['HS-BASIC-INEQUALITY-OPTIMIZATION-001','基本不等式求最值','凑定值并验证取等','basic-inequality','构造正数和的定积或定和形式，再检查等号可达及定义域约束。','2.2',46,5,4]),
 concept(['HS-QUADRATIC-INEQUALITY-CONCEPT-001','一元二次不等式','识别二次不等式','quadratics','只含一个未知数且最高次数为二的不等式，二次项系数非零。','2.3',50,4,2]),
 concept(['HS-QUADRATIC-FUNCTION-001','二次函数图象与开口','二次项系数决定开口','quadratics','y=ax²+bx+c 的图象为抛物线；a>0 开口向上，a<0 开口向下。','2.3',50,4,3]),
 concept(['HS-QUADRATIC-EQUATION-DISCRIMINANT-001','一元二次方程判别式','用判别式判断实根','quadratics','Δ=b²−4ac 决定一元二次方程实根个数：正数两个、零一个重根、负数无实根。','2.3',51,4,3]),
 concept(['HS-QUADRATIC-ZEROS-001','二次函数零点','方程根对应横轴交点','quadratics','使 ax²+bx+c=0 的实数是对应二次函数的零点，也是图象与 x 轴交点的横坐标。','2.3',51,4,3]),
 concept(['HS-QUADRATIC-ROOT-INTERVALS-001','二次函数符号区间','按根与开口判符号','quadratics','有两个实根时，二次式在两根之间与两侧的符号由开口方向决定。','2.3',51,4,4]),
 concept(['HS-QUADRATIC-INEQUALITY-SOLVE-001','求解一元二次不等式','判根后用图象定区间','quadratics','先求对应二次方程实根，再结合抛物线与 x 轴位置确定严格或非严格不等式解集。','2.3',52,5,4]),
 concept(['HS-QUADRATIC-INEQUALITY-NO-ROOT-001','无实根时的符号判断','结合开口判断恒正负','quadratics','Δ<0 时图象不交 x 轴，二次式恒与二次项系数同号。','2.3',52,3,3]),
 concept(['HS-QUADRATIC-INEQUALITY-DOUBLE-ROOT-001','重根时的不等式解集','区分严格与非严格','quadratics','Δ=0 时二次式在顶点处取零；严格同号解集排除重根，反向严格不等式无解。','2.3',52,3,4]),
 concept(['HS-QUADRATIC-FUNCTION-EQUATION-INEQUALITY-001','二次函数、方程与不等式的联系','用图象统一求解','quadratics','二次方程的根是函数零点；不等式解集对应图象在 x 轴上方或下方的横坐标集合。','2.3',51,5,4]),
 concept(['HS-QUADRATIC-APPLICATION-001','用二次不等式解决实际问题','建模后结合变量范围','quadratics','将实际限制转为二次不等式，求代数解集后与变量的实际范围、整数性相交。','2.3',53,4,4]),
 concept(['HS-INEQUALITY-MODELING-001','实际不等关系建模','定义变量并列约束','inequality-basics','定义变量范围，将“至少、至多、大于、不低于”等语义翻译为不等式或不等式组。','2.1',37,3,3]),
 concept(['HS-BASIC-INEQUALITY-GEOMETRY-001','基本不等式的几何解释','直角弦的均值关系','basic-inequality','以半圆弦长不超过直径说明几何平均数不大于算术平均数。','2.2',44,2,3]),
 concept(['HS-QUADRATIC-VERTEX-001','二次函数顶点与最值','配方确定极值点','quadratics','通过配方得到顶点横坐标 −b/(2a)，开口方向决定全局最小值或最大值。','2.3',50,4,3]),
 concept(['HS-INEQUALITY-PROOF-001','不等式证明的差值法','作差化为非负式','inequality-basics','比较两式时可考察差并将其化为恒非负或恒非正的形式。','2.1',38,3,3]),
 concept(['HS-INEQUALITY-RECIPROCAL-001','正数倒数的大小关系','取倒数需反向','inequality-basics','若 a>b>0，则 1/a<1/b；倒数比较依赖正数条件并反转方向。','2.1',41,3,3]),
 concept(['HS-QUADRATIC-ROOT-BOUND-001','判别式与二次式恒号','无根与恒号相连','quadratics','结合二次项符号与 Δ 判断二次式是否对所有实数保持严格同号。','2.3',52,3,4]),
 concept(['HS-BASIC-INEQUALITY-APPLICATION-001','基本不等式的实际最优化','把约束转成定和定积','basic-inequality','将几何或成本约束转成正数定和/定积模型，求最值并核验边界可达。','2.2',46,3,4]),
 concept(['HS-QUADRATIC-INEQUALITY-SET-OPERATIONS-001','不等式解集的集合运算','合并多个约束范围','quadratics','多个不等式约束同时成立时取解集交集，满足其一时取并集。','2.3',55,3,3]),
] } satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;

const byId=new Map(algebraSystem.concepts.map(node=>[node.id,node]));
type Rel=[source:string,target:string,because:string,section:string,page:number,type?:'strong'|'weak'];
const relations:Rel[]=[
 ['HS-INEQUALITY-CONCEPT-001','HS-INEQUALITY-MODELING-001','实际问题中的大小限制先抽象为不等式。','2.1',37],
 ['HS-REAL-ORDER-001','HS-INEQUALITY-PROPERTIES-001','不等式性质建立在实数差值与零的比较事实之上。','2.1',40],
 ['HS-INEQUALITY-PROPERTIES-001','HS-INEQUALITY-ADD-001','同加性质是基本性质的直接形式。','2.1',41],
 ['HS-INEQUALITY-PROPERTIES-001','HS-INEQUALITY-MULTIPLY-001','同乘正负数对方向的影响是基本性质的直接形式。','2.1',41],
 ['HS-INEQUALITY-ADD-001','HS-INEQUALITY-COMPOUND-001','同加性质与传递性推出不等式相加。','2.1',42],
 ['HS-INEQUALITY-MULTIPLY-001','HS-INEQUALITY-COMPOUND-001','正数乘法比较使用同乘性质和传递性。','2.1',42],
 ['HS-REAL-ORDER-001','HS-INEQUALITY-SQUARE-001','实数平方非负可经差值转化为不等关系。','2.1',39],
 ['HS-INEQUALITY-SQUARE-001','HS-BASIC-INEQUALITY-001','令实数取正数平方根可推出基本不等式。','2.2',44],
 ['HS-BASIC-INEQUALITY-001','HS-BASIC-INEQUALITY-EQUALITY-001','证明和最值必须同时检查等号成立条件。','2.2',45],
 ['HS-BASIC-INEQUALITY-EQUALITY-001','HS-BASIC-INEQUALITY-MINIMUM-001','定积求和最小在两个正数相等时取到。','2.2',45],
 ['HS-BASIC-INEQUALITY-EQUALITY-001','HS-BASIC-INEQUALITY-MAXIMUM-001','定和求积最大在两个正数相等时取到。','2.2',45],
 ['HS-BASIC-INEQUALITY-MINIMUM-001','HS-BASIC-INEQUALITY-OPTIMIZATION-001','定积最小和是基本最值模型。','2.2',46],
 ['HS-BASIC-INEQUALITY-MAXIMUM-001','HS-BASIC-INEQUALITY-OPTIMIZATION-001','定和最大积是基本最值模型。','2.2',45],
 ['HS-BASIC-INEQUALITY-OPTIMIZATION-001','HS-BASIC-INEQUALITY-APPLICATION-001','实际优化需要构造正数和/积约束并检验等号可达。','2.2',46],
 ['HS-BASIC-INEQUALITY-001','HS-BASIC-INEQUALITY-GEOMETRY-001','几何解释直接呈现基本不等式中的均值比较关系。','2.2',44],
 ['HS-QUADRATIC-INEQUALITY-CONCEPT-001','HS-QUADRATIC-FUNCTION-001','二次不等式的求解借助对应二次函数。','2.3',50],
 ['HS-QUADRATIC-FUNCTION-001','HS-QUADRATIC-VERTEX-001','配方揭示抛物线顶点及开口方向。','2.3',50],
 ['HS-QUADRATIC-FUNCTION-001','HS-QUADRATIC-EQUATION-DISCRIMINANT-001','方程实根个数决定图象与横轴交点个数。','2.3',51],
 ['HS-QUADRATIC-EQUATION-DISCRIMINANT-001','HS-QUADRATIC-ZEROS-001','判别式判断根是否存在，根即函数零点。','2.3',51],
 ['HS-QUADRATIC-ZEROS-001','HS-QUADRATIC-ROOT-INTERVALS-001','零点把数轴划分为符号区间。','2.3',51],
 ['HS-QUADRATIC-FUNCTION-001','HS-QUADRATIC-ROOT-INTERVALS-001','开口方向决定零点之间和两侧的符号；符号区间仍需零点信息，故此处仅作语义关联。','2.3',51,'weak'],
 ['HS-QUADRATIC-ROOT-INTERVALS-001','HS-QUADRATIC-INEQUALITY-SOLVE-001','根据符号区间可写出一元二次不等式解集。','2.3',52],
 ['HS-QUADRATIC-EQUATION-DISCRIMINANT-001','HS-QUADRATIC-INEQUALITY-NO-ROOT-001','无实根情况对应图象不与横轴相交。','2.3',52],
 ['HS-QUADRATIC-EQUATION-DISCRIMINANT-001','HS-QUADRATIC-INEQUALITY-DOUBLE-ROOT-001','重根情况对应图象与横轴相切。','2.3',52],
 ['HS-QUADRATIC-INEQUALITY-NO-ROOT-001','HS-QUADRATIC-ROOT-BOUND-001','无实根时可结合开口判断二次式恒号。','2.3',52],
 ['HS-QUADRATIC-INEQUALITY-DOUBLE-ROOT-001','HS-QUADRATIC-INEQUALITY-SOLVE-001','边界根是否包含决定严格与非严格解集。','2.3',52],
 ['HS-QUADRATIC-INEQUALITY-SOLVE-001','HS-QUADRATIC-FUNCTION-EQUATION-INEQUALITY-001','求解过程体现三类对象之间的函数图象联系。','2.3',51],
 ['HS-QUADRATIC-FUNCTION-EQUATION-INEQUALITY-001','HS-QUADRATIC-APPLICATION-001','实际问题通过二次函数与不等式求满足条件的变量范围。','2.3',53],
 ['HS-INEQUALITY-MODELING-001','HS-QUADRATIC-APPLICATION-001','实际变量约束必须与代数解集取交集。','2.3',53],
 ['HS-QUADRATIC-APPLICATION-001','HS-QUADRATIC-INEQUALITY-SET-OPERATIONS-001','多条件应用问题需要合并不等式解集。','2.3',55],
 ['HS-INEQUALITY-CONCEPT-001','HS-INEQUALITY-PROOF-001','比较不等式可归约为差值符号判断。','2.1',38],
 ['HS-REAL-ORDER-001','HS-INEQUALITY-PROOF-001','差值法使用实数差正负刻画大小关系。','2.1',38],
 ['HS-INEQUALITY-MULTIPLY-001','HS-INEQUALITY-RECIPROCAL-001','正数倒数比较由同乘性质推得并反向。','2.1',42],
 ['HS-QUADRATIC-EQUATION-DISCRIMINANT-001','HS-QUADRATIC-FUNCTION-EQUATION-INEQUALITY-001','判别式提供根与图象横轴交点分类。','2.3',51,'weak'],
];

const edges:KnowledgeEdge[]=relations.map(([source,target,because,section,page,type='strong'],i)=>{
 const ref=`PEP-A:B1:C2:S${section}`,evidence=[{sourceRef:ref,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT' as const,summary:`教材第${page}页讨论${byId.get(target)!.canonicalName}；此定位证明目标内容存在，不单独决定前置关系。`}];
 const record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:`${byId.get(source)!.canonicalName}与${byId.get(target)!.canonicalName}按高中数学定义使用。`,definitionAmbiguous:false,prerequisiteCounterfactual:because,graphContext:`代数与不等式体系内：${byId.get(source)!.canonicalName} → ${byId.get(target)!.canonicalName}。`,rationale:because,decision:type==='weak'?'DOWNGRADE_TO_WEAK' as const:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]};
 const quality=evaluateDependencyQuality(record);
 return {id:`ALGEBRA-EDGE-${String(i+1).padStart(3,'0')}`,sourceNodeId:source,targetNodeId:target,dependencyType:type,enabled:quality.publicationEligible,reviewStatus:quality.publicationEligible?'APPROVED':'REVIEW_REQUIRED',...record,qualityDecision:quality.decision,qualityConfidence:quality.confidence,qualityState:quality.state,qualityRationale:because};
});
export const algebraGraph:Graph={nodes:algebraSystem.concepts.map(node=>({id:node.id,nameZh:node.canonicalName,domainId:node.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!edges.some(edge=>edge.enabled&&edge.dependencyType==='strong'&&edge.targetNodeId===node.id)} as GraphNode)),edges};
export const algebraValidation=validateGraph(algebraGraph);
const bridgeEvidence=[{sourceRef:'PEP-A:B1:C2:S2.1',printedPage:38,pdfPage:45,evidenceStatus:'DIRECT' as const,summary:'不等式性质建立在实数大小关系和数轴表示基础上。'},{sourceRef:'PEP-A:B1:C3:S3.2',printedPage:76,pdfPage:83,evidenceStatus:'DIRECT' as const,summary:'函数性质章节使用不等关系描述函数单调变化及最值。'}];
const bridge={canonicalTextbookEvidence:bridgeEvidence,canonicalEvidenceConflict:false,mathematicalDefinition:'不等式表达实数之间的大小关系；函数单调性比较定义域内自变量及函数值的大小。',definitionAmbiguous:false,prerequisiteCounterfactual:'函数概念和图象可先于本章系统学习；函数章节使用大小关系，但不要求完成全部不等式体系。',graphContext:'不等式为函数单调性、最值和零点区间判断提供比较语言。',rationale:'这是跨域的能力支撑关系，作为 Weak 语义链接，不作为学习解锁条件。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const algebraCrossDomainReviews=[{sourceNodeId:'HS-INEQUALITY-PROPERTIES-001',targetNodeId:'HS-FUNC-MONO-001',sourceDomainId:'algebra',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...bridge,outcome:evaluateDependencyQuality(bridge)}];
export const algebraSeed={...algebraSystem,graph:algebraGraph,publicationEligible:algebraValidation.length===0,crossDomainReviews:algebraCrossDomainReviews};
