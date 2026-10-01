import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumConcept,CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph,GraphNode} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

const source=(section:string,page:number,summary:string):CurriculumSource=>({
 volume:'X2',sourceRef:`PEP-A:X2:C4:S${section}`,printedPage:page,pdfPage:page+5,
 evidence:{sourceRef:`PEP-A:X2:C4:S${section}`,printedPage:page,pdfPage:page+5,evidenceStatus:'DIRECT',summary},
 scopeNote:'按人教 A 版选择性必修第二册第四章正文页核对；本页只证明概念内容定位，不单独决定依赖关系。',
});
type NodeInput=[id:string,name:string,achievement:string,module:string,summary:string,section:string,page:number,importance?:1|2|3|4|5,difficulty?:1|2|3|4|5];
const keyConceptIds=new Set(['HS-SEQ-DISCRETE-FUNCTION-001','HS-AP-SUM-001','HS-GP-SUM-001','HS-INDUCTION-SEQUENCE-PROOF-001']);
const concept=([id,canonicalName,achievementName,moduleId,summary,section,page,importance=3,difficulty=2]:NodeInput):CurriculumConcept=>({
 id,canonicalName,achievementName,domainId:'sequences',moduleId,summary,importance,difficulty,aliases:[],mathNotationAliases:[],sources:[source(section,page,summary)],isKeyAchievement:keyConceptIds.has(id),keyAchievementRationale:keyConceptIds.has(id)?'该节点标记一个可独立应用的核心学习成果。':null,reviewStatus:'APPROVED',
});

export const sequencesSystem={
 id:'sequences',nameZh:'数列',nameEn:'SEQUENCES',description:'离散函数、递推规律、等差与等比数列及数学归纳法。',
 modules:[{id:'sequence-basics',nameZh:'数列基础'},{id:'arithmetic',nameZh:'等差数列'},{id:'geometric',nameZh:'等比数列'},{id:'induction',nameZh:'数学归纳法'}],
 concepts:[
  concept(['HS-SEQ-CONCEPT-001','数列的概念','按序排列','sequence-basics','数列是按照确定顺序排列的一列数，每个数称为一项。','4.1',2,4,2]),
  concept(['HS-SEQ-INDEX-001','项与序号','位置对应项','sequence-basics','项的序号确定其在数列中的位置，通常用 n 表示。','4.1',2]),
  concept(['HS-SEQ-FINITE-INFINITE-001','有穷数列与无穷数列','判断项数范围','sequence-basics','按项数有限或无限区分有穷数列与无穷数列。','4.1',3]),
  concept(['HS-SEQ-DISCRETE-FUNCTION-001','数列是离散函数','序号映到数值','sequence-basics','把正整数 n 映到第 n 项 aₙ，可将数列看作定义在正整数集或其有限子集上的函数。','4.1',3,4,3]),
  concept(['HS-SEQ-REPRESENTATION-001','数列的表示','表格图象与式子','sequence-basics','数列可用列举、表格、图象、通项公式或递推公式表示。','4.1',3]),
  concept(['HS-SEQ-GENERAL-TERM-001','数列的通项公式','由序号求第 n 项','sequence-basics','通项公式给出序号 n 与对应项 aₙ 的关系。','4.1',4,3]),
  concept(['HS-SEQ-RECURSIVE-001','数列的递推公式','由前项生成后项','sequence-basics','递推公式刻画相邻若干项的关系；给出初始项后可依次确定后续项。','4.1',4,3]),
  concept(['HS-SEQ-MONOTONIC-001','数列的单调性','辨认项的变化','sequence-basics','从第二项起逐项递增、逐项递减或各项相等的数列分别称为递增、递减或常数列。','4.1',3,3]),
  concept(['HS-SEQ-TERM-MEMBERSHIP-001','判断数是否为数列的项','解序号方程','sequence-basics','已知通项时，将候选数代入通项方程，并检查序号是否为正整数。','4.1',3,3]),
  concept(['HS-SEQ-PARTIAL-SUM-001','数列的前 n 项和','逐项累加至 n','sequence-basics','Sₙ 表示 a₁+a₂+…+aₙ；相邻前项和之差可恢复对应项。','4.1',4,3]),
  concept(['HS-SEQ-SUM-TO-TERM-001','由前 n 项和求通项','作相邻和之差','sequence-basics','由 a₁=S₁ 及 n≥2 时 aₙ=Sₙ−Sₙ₋₁，从前 n 项和公式恢复通项。','4.1',4,3]),
  concept(['HS-SEQ-RECURSIVE-MODEL-001','递推数列建模','刻画逐步变化','sequence-basics','把按阶段演变的数量表示为数列，并用初始值和递推关系刻画过程。','4.1',4,4]),
  concept(['HS-AP-CONCEPT-001','等差数列','相邻差保持不变','arithmetic','从第二项起，每一项与前一项的差等于同一常数的数列称为等差数列。','4.2',4,2]),
  concept(['HS-AP-COMMON-DIFFERENCE-001','等差数列的公差','识别固定差','arithmetic','等差数列相邻两项的差为常数 d，称为公差。','4.2',13,3]),
  concept(['HS-AP-MEAN-001','等差中项','两端平均为中项','arithmetic','若 a、A、b 成等差数列，则 2A=a+b。','4.2',12,3]),
  concept(['HS-AP-TERM-001','等差数列通项公式','首项公差定任意项','arithmetic','首项 a₁、公差 d 的等差数列满足 aₙ=a₁+(n−1)d。','4.2',13,4,3]),
  concept(['HS-AP-LINEAR-001','等差数列与一次函数','离散点落在直线上','arithmetic','当 d≠0 时，等差数列各项是一次函数图象在正整数序号处的函数值。','4.2',13,3,4]),
  concept(['HS-AP-SUM-001','等差数列前 n 项和','首末项配对求和','arithmetic','等差数列前 n 项和 Sₙ=n(a₁+aₙ)/2，也可用 Sₙ=na₁+n(n−1)d/2。','4.2',20,5,3]),
  concept(['HS-AP-SYMMETRY-001','等差数列等距项性质','等距项和相等','arithmetic','等差数列中，序号和相同的两项之和相等；首末项配对是其特例。','4.2',18,3,4]),
  concept(['HS-AP-INSERT-001','等差数列插项','均分相邻项差','arithmetic','在两数间插入若干数使整体成等差数列，可先用总间隔确定公差。','4.2',16,3,3]),
  concept(['HS-AP-OPTIMIZE-001','等差数列求和最值','考察项符号变化','arithmetic','利用项的单调变化或前 n 项和关于 n 的二次函数，判断离散取值上的最大或最小值。','4.2',23,4,4]),
  concept(['HS-AP-APPLICATION-001','等差数列实际应用','把等量变化写成数列','arithmetic','座位递增、设备折旧等每阶段增加固定量的情境可用等差数列建模。','4.2',21,4,3]),
  concept(['HS-GP-CONCEPT-001','等比数列','相邻项比值固定','geometric','从第二项起，每一项与前一项的比等于同一非零常数的数列称为等比数列。','4.3',27,4,2]),
  concept(['HS-GP-COMMON-RATIO-001','等比数列的公比','识别固定比','geometric','等比数列相邻两项的比 q 为公比；公比不为零。','4.3',28,3]),
  concept(['HS-GP-MEAN-001','等比中项','平方等于两端乘积','geometric','若 a、G、b 成等比数列，则 G²=ab；实数范围内还需检查平方根条件。','4.3',28,3,3]),
  concept(['HS-GP-TERM-001','等比数列通项公式','首项公比定任意项','geometric','首项 a₁、公比 q 的等比数列满足 aₙ=a₁qⁿ⁻¹。','4.3',28,4,3]),
  concept(['HS-GP-EXPONENTIAL-001','等比数列与指数函数','离散点落在指数曲线上','geometric','正首项且公比为正时，等比数列的项可视为指数函数在正整数序号处的取值。','4.3',28,3,4]),
  concept(['HS-GP-SUM-001','等比数列前 n 项和','错位相减求和','geometric','q≠1 时 Sₙ=a₁(1−qⁿ)/(1−q)，推导使用错位相减。','4.3',35,5,4]),
  concept(['HS-GP-SUM-Q1-001','公比为 1 的等比数列求和','相同项直接相加','geometric','q=1 时每项都等于 a₁，故 Sₙ=na₁；不可代入 q≠1 的商式。','4.3',35,3,3]),
  concept(['HS-GP-APPLICATION-001','等比数列实际应用','固定比例逐期变化','geometric','复利、数量增长或衰减等每阶段按固定比例变化的情境可用等比数列建模。','4.3',30,5,3]),
  concept(['HS-GP-RECURRENCE-TRANSFORM-001','平移递推数列转化','减去不动点得等比','geometric','对 xₙ₊₁=rxₙ+c，可寻找不动点 k=c/(1−r)，使 xₙ₊₁−k=r(xₙ−k) 成为等比数列（r≠1）。','4.3',39,4,5]),
  concept(['HS-INDUCTION-PRINCIPLE-001','数学归纳法原理','基步连上递推步','induction','数学归纳法用一个起始命题和相邻命题的蕴含关系，推出指定范围内所有后续命题成立。','4.4',44,4,4]),
  concept(['HS-INDUCTION-BASE-001','归纳奠基','验证首个命题','induction','对起始整数 n₀ 验证命题 P(n₀) 成立。','4.4',45,4,3]),
  concept(['HS-INDUCTION-HYPOTHESIS-001','归纳假设','暂假设 P(k) 成立','induction','在递推步骤中，将 P(k) 作为条件；不能把待证的 P(k+1) 偷换成假设。','4.4',46,4,4]),
  concept(['HS-INDUCTION-STEP-001','归纳递推步骤','由 P(k) 推出 P(k+1)','induction','对任意 k≥n₀，使用定义、已知条件和归纳假设推导 P(k+1)。','4.4',45,5,4]),
  concept(['HS-INDUCTION-CONCLUSION-001','归纳法结论','两步合成全称结论','induction','起始验证与递推步骤缺一不可；两者完成后才能断定 P(n) 对所有 n≥n₀ 成立。','4.4',46,4,4]),
  concept(['HS-INDUCTION-SEQUENCE-PROOF-001','用数学归纳法证明数列公式','证明对所有正整数成立','induction','用数学归纳法证明通项、求和等关于正整数 n 的公式，须明确基步、归纳假设和递推推导。','4.4',46,4,4]),
 ] as const,
} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;

const conceptById=new Map(sequencesSystem.concepts.map(node=>[node.id,node]));
type Relation={source:string;target:string;because:string;section:string;page:number;type?:'strong'|'weak'};
const relations:readonly Relation[]=[
 {source:'HS-SEQ-CONCEPT-001',target:'HS-SEQ-INDEX-001',because:'数列项按确定顺序排列，序号标记每一项所在的位置。',section:'4.1',page:2},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-SEQ-FINITE-INFINITE-001',because:'有穷与无穷数列按数列项数是否有限定义。',section:'4.1',page:3},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-SEQ-DISCRETE-FUNCTION-001',because:'把序号作为自变量、对应项作为函数值即可解释数列与函数的关系。',section:'4.1',page:3},
 {source:'HS-SEQ-INDEX-001',target:'HS-SEQ-REPRESENTATION-001',because:'表格、图象和公式均需将序号与数列项对应起来。',section:'4.1',page:3},
 {source:'HS-SEQ-DISCRETE-FUNCTION-001',target:'HS-SEQ-REPRESENTATION-001',because:'数列作为离散函数可用表格、图象和解析式表示。',section:'4.1',page:3},
 {source:'HS-SEQ-INDEX-001',target:'HS-SEQ-GENERAL-TERM-001',because:'通项公式给出任意正整数序号对应的数列项。',section:'4.1',page:4},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-SEQ-RECURSIVE-001',because:'递推公式描述数列相邻项之间的关系并依序确定各项。',section:'4.1',page:6},
 {source:'HS-SEQ-INDEX-001',target:'HS-SEQ-MONOTONIC-001',because:'数列单调性按项序比较每一项与其前一项的大小。',section:'4.1',page:3},
 {source:'HS-SEQ-GENERAL-TERM-001',target:'HS-SEQ-TERM-MEMBERSHIP-001',because:'判断候选值是否为项需将其代入通项并解序号方程。',section:'4.1',page:5},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-SEQ-PARTIAL-SUM-001',because:'前 n 项和定义为按序排列的前 n 个数列项之和。',section:'4.1',page:7},
 {source:'HS-SEQ-PARTIAL-SUM-001',target:'HS-SEQ-SUM-TO-TERM-001',because:'相邻部分和相减可恢复从第二项起的数列通项。',section:'4.1',page:7},
 {source:'HS-SEQ-RECURSIVE-001',target:'HS-SEQ-RECURSIVE-MODEL-001',because:'阶段演变模型以初值和前后阶段递推关系刻画数量。',section:'4.1',page:6},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-AP-CONCEPT-001',because:'等差数列是在一般数列上附加相邻项差恒定条件得到的特殊数列。',section:'4.2',page:12},
 {source:'HS-AP-CONCEPT-001',target:'HS-AP-COMMON-DIFFERENCE-001',because:'相邻项差恒定的常数定义为等差数列的公差。',section:'4.2',page:13},
 {source:'HS-AP-CONCEPT-001',target:'HS-AP-MEAN-001',because:'等差中项的定义由三项组成等差数列直接得到。',section:'4.2',page:12},
 {source:'HS-AP-COMMON-DIFFERENCE-001',target:'HS-AP-TERM-001',because:'反复使用相邻项差为 d 可推出 aₙ=a₁+(n−1)d。',section:'4.2',page:13},
 {source:'HS-AP-TERM-001',target:'HS-AP-LINEAR-001',because:'整理通项为 dn+(a₁−d)，可将其解释为一次函数在整数点的取值。',section:'4.2',page:13},
 {source:'HS-AP-TERM-001',target:'HS-AP-SUM-001',because:'首末项可由通项公式计算，并与倒序相加法共同导出求和公式。',section:'4.2',page:20},
 {source:'HS-SEQ-PARTIAL-SUM-001',target:'HS-AP-SUM-001',because:'等差数列求和是前 n 项和定义在等差结构下的计算方法。',section:'4.2',page:20},
 {source:'HS-AP-CONCEPT-001',target:'HS-AP-SYMMETRY-001',because:'等差数列通项中序号系数相同的项相加可得等距项和相等。',section:'4.2',page:18},
 {source:'HS-AP-COMMON-DIFFERENCE-001',target:'HS-AP-INSERT-001',because:'插项后各相邻差相等，利用总间隔确定所求公差。',section:'4.2',page:16},
 {source:'HS-AP-SUM-001',target:'HS-AP-OPTIMIZE-001',because:'求和公式把 Sₙ 表为 n 的二次式，可分析整数 n 处的最值。',section:'4.2',page:23},
 {source:'HS-AP-TERM-001',target:'HS-AP-APPLICATION-001',because:'固定增量的阶段变化可用公差和通项公式表示；解锁路径已由求和节点覆盖，保留为理解性弱关系。',section:'4.2',page:21,type:'weak'},
 {source:'HS-AP-SUM-001',target:'HS-AP-APPLICATION-001',because:'累计座位数、累计行程等模型需要对等差变化求前 n 项和。',section:'4.2',page:24},
 {source:'HS-SEQ-CONCEPT-001',target:'HS-GP-CONCEPT-001',because:'等比数列是在一般数列上附加相邻项比恒定条件得到的特殊数列。',section:'4.3',page:27},
 {source:'HS-GP-CONCEPT-001',target:'HS-GP-COMMON-RATIO-001',because:'相邻项的固定比值定义为等比数列的公比。',section:'4.3',page:28},
 {source:'HS-GP-CONCEPT-001',target:'HS-GP-MEAN-001',because:'等比中项由三项组成等比数列的定义直接推出。',section:'4.3',page:28},
 {source:'HS-GP-COMMON-RATIO-001',target:'HS-GP-TERM-001',because:'反复使用相邻项比为 q 可推出通项公式 aₙ=a₁qⁿ⁻¹。',section:'4.3',page:28},
 {source:'HS-GP-TERM-001',target:'HS-GP-EXPONENTIAL-001',because:'正首项和正公比时通项可写作指数函数在整数序号处的取值。',section:'4.3',page:28},
 {source:'HS-GP-TERM-001',target:'HS-GP-SUM-001',because:'将通项代入前 n 项和并错位相减，可推导公比不为 1 的公式。',section:'4.3',page:35},
 {source:'HS-SEQ-PARTIAL-SUM-001',target:'HS-GP-SUM-001',because:'等比数列求和是前 n 项和定义在等比结构下的计算方法。',section:'4.3',page:35},
 {source:'HS-GP-COMMON-RATIO-001',target:'HS-GP-SUM-Q1-001',because:'当公比恰为 1 时每项相等，前 n 项和退化为 n 倍首项。',section:'4.3',page:35},
 {source:'HS-GP-TERM-001',target:'HS-GP-APPLICATION-001',because:'按固定比例变化的阶段数量可由公比和通项公式表示；解锁路径已由求和节点覆盖，保留为理解性弱关系。',section:'4.3',page:30,type:'weak'},
 {source:'HS-GP-SUM-001',target:'HS-GP-APPLICATION-001',because:'复利或累计增长模型需要利用等比数列前 n 项和。',section:'4.3',page:37},
 {source:'HS-SEQ-RECURSIVE-001',target:'HS-GP-RECURRENCE-TRANSFORM-001',because:'先从线性递推关系中识别固定点，再转化为相邻项成比例的数列。',section:'4.3',page:39},
 {source:'HS-GP-COMMON-RATIO-001',target:'HS-GP-RECURRENCE-TRANSFORM-001',because:'递推平移后相邻差之比为常数，才可使用等比数列通项。',section:'4.3',page:39},
 {source:'HS-INDUCTION-PRINCIPLE-001',target:'HS-INDUCTION-BASE-001',because:'归纳原理首先要求验证命题成立的起始整数。',section:'4.4',page:45},
 {source:'HS-INDUCTION-PRINCIPLE-001',target:'HS-INDUCTION-HYPOTHESIS-001',because:'归纳递推以任意 k 处命题成立作为推导条件。',section:'4.4',page:46},
 {source:'HS-INDUCTION-HYPOTHESIS-001',target:'HS-INDUCTION-STEP-001',because:'递推步骤必须将 P(k) 作为条件推出 P(k+1)。',section:'4.4',page:46},
 {source:'HS-INDUCTION-BASE-001',target:'HS-INDUCTION-CONCLUSION-001',because:'起始命题成立是归纳法推出全称结论的必要条件。',section:'4.4',page:46},
 {source:'HS-INDUCTION-STEP-001',target:'HS-INDUCTION-CONCLUSION-001',because:'相邻命题递推成立才能从起始整数逐步覆盖后续整数。',section:'4.4',page:46},
 {source:'HS-INDUCTION-CONCLUSION-001',target:'HS-INDUCTION-SEQUENCE-PROOF-001',because:'数列通项或求和公式对所有正整数成立时可用归纳法证明。',section:'4.4',page:47},
];

const makeEdge=({source,target,because,section,page,type='strong'}:Relation,index:number):KnowledgeEdge=>{
 const sourceRef=`PEP-A:X2:C4:S${section}`;
 const evidence=[{sourceRef,printedPage:page,pdfPage:page+5,evidenceStatus:'DIRECT' as const,summary:`教材第${page}页讨论${conceptById.get(target)!.canonicalName}；此定位证明目标内容存在，不单独决定其前置关系。`}];
 const record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,
  mathematicalDefinition:`${conceptById.get(source)!.canonicalName}与${conceptById.get(target)!.canonicalName}按高中数学定义使用。`,definitionAmbiguous:false,
  prerequisiteCounterfactual:because,graphContext:`数列体系内：${conceptById.get(source)!.canonicalName} → ${conceptById.get(target)!.canonicalName}。`,
  rationale:because,decision:type==='weak'?'DOWNGRADE_TO_WEAK' as const:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]};
 const outcome=evaluateDependencyQuality(record);
 return {id:`SEQ-EDGE-${String(index+1).padStart(3,'0')}`,sourceNodeId:source,targetNodeId:target,
  dependencyType:type,rationale:because,enabled:outcome.publicationEligible,reviewStatus:outcome.publicationEligible?'APPROVED':'REVIEW_REQUIRED',
  canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:record.mathematicalDefinition,
  prerequisiteCounterfactual:record.prerequisiteCounterfactual,graphContext:record.graphContext,definitionAmbiguous:false,
  qualityDecision:outcome.decision,qualityConfidence:outcome.confidence,qualityState:outcome.state,qualityRationale:because,aiReviews:[]};
};
export const sequencesEdges:readonly KnowledgeEdge[]=relations.map(makeEdge);
const graphNodes:GraphNode[]=sequencesSystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!sequencesEdges.some(e=>e.enabled&&e.dependencyType==='strong'&&e.targetNodeId===n.id)}));
export const sequencesGraph:Graph={nodes:graphNodes,edges:sequencesEdges};
export const sequencesValidation=validateGraph(sequencesGraph);
const functionBridgeEvidence=[
 {sourceRef:'PEP-A:B1:C3:S3.1',printedPage:60,pdfPage:67,evidenceStatus:'DIRECT' as const,summary:'函数章节给出函数的定义及输入值与唯一函数值的对应关系。'},
 {sourceRef:'PEP-A:X2:C4:S4.1',printedPage:3,pdfPage:8,evidenceStatus:'DIRECT' as const,summary:'数列章节把序号作为自变量，将数列解释为定义在正整数集上的离散函数。'},
];
const crossDomainRecord={canonicalTextbookEvidence:functionBridgeEvidence,canonicalEvidenceConflict:false,
 mathematicalDefinition:'函数把定义域中的每个自变量对应到唯一函数值；数列将正整数序号对应到数列项。',definitionAmbiguous:false,
 prerequisiteCounterfactual:'学会数列不要求先学习一般函数，因此一般函数概念不是数列体系的解锁前置。',
 graphContext:'函数与数列共享输入输出结构；数列可视为定义在离散定义域上的特殊函数。',
 rationale:'本关系用于跨域建立概念参照；一般函数概念不是学习数列概念的必要前置，故只保留 Weak 语义链接。',
 decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const sequencesCrossDomainReviews=[{sourceNodeId:'HS-FUNC-CONCEPT-001',targetNodeId:'HS-SEQ-DISCRETE-FUNCTION-001',sourceDomainId:'functions',targetDomainId:'sequences',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...crossDomainRecord,outcome:evaluateDependencyQuality(crossDomainRecord)}];
export const sequencesSeed={...sequencesSystem,graph:sequencesGraph,publicationEligible:sequencesValidation.length===0,crossDomainReviews:sequencesCrossDomainReviews};
