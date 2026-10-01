import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

type Row=[string,string,string,string,string,string,number];
const rows:Row[]=[
['HS-CALC-RATE-OF-CHANGE-001','平均变化率','计算区间平均变化','derivative-concept','函数在区间 [x₁,x₂] 上的平均变化率为函数值改变量与自变量改变量之比。','5.1',59],
['HS-CALC-SECANT-SLOPE-001','割线斜率','用两点求割线','derivative-concept','函数图象上两点连线的斜率等于相应区间的平均变化率。','5.1',59],
['HS-CALC-INSTANT-RATE-001','瞬时变化率','考察趋近时的变化','derivative-concept','瞬时变化率由平均变化率在区间长度趋于零时的极限刻画。','5.1',60],
['HS-CALC-DIFFERENCE-QUOTIENT-001','差商','写出函数增量比','derivative-concept','差商 [f(x₀+h)−f(x₀)]/h 描述函数在邻近区间的平均变化率。','5.1',60],
['HS-CALC-DERIVATIVE-DEFINITION-001','导数的定义','求差商极限','derivative-concept','若差商在 h→0 时极限存在，则该极限为 f 在 x₀ 处的导数。','5.1',61],
['HS-CALC-DERIVATIVE-NOTATION-001','导数记号','识别 f′(x)','derivative-concept','导数可记为 f′(x)、y′ 或 dy/dx，表示瞬时变化率。','5.1',61],
['HS-CALC-DIFFERENTIABILITY-001','可导性','判断导数是否存在','derivative-concept','函数在一点的导数存在称为在该点可导。','5.1',62],
['HS-CALC-SQUARE-ROOT-RULE-001','平方根函数求导','应用幂函数导数公式','derivative-rules','在 x>0 时，(√x)′=1/(2√x)，由幂函数导数公式得到。','5.2',74],
['HS-CALC-TANGENT-SLOPE-001','导数与切线斜率','以导数确定斜率','derivative-concept','曲线在点 (x₀,f(x₀)) 处可导时，切线斜率为 f′(x₀)。','5.1',64],
['HS-CALC-TANGENT-EQUATION-001','曲线切线方程','点斜式写切线','derivative-concept','曲线 y=f(x) 在 x₀ 处切线方程为 y−f(x₀)=f′(x₀)(x−x₀)。','5.1',65],
['HS-CALC-VELOCITY-001','位置函数与瞬时速度','位置导数为速度','derivative-concept','物体位置关于时间的导数表示瞬时速度。','5.1',66],
['HS-CALC-DERIVATIVE-GRAPH-001','导数的图象意义','判断局部变化方向','derivative-concept','导数的符号表示函数局部递增或递减趋势，大小体现变化快慢。','5.1',67],
['HS-CALC-POWER-RULE-001','幂函数求导','指数移前降次','derivative-rules','幂函数 xⁿ 的导数为 n xⁿ⁻¹（在定义域内）。','5.2',72],
['HS-CALC-CONSTANT-RULE-001','常数函数求导','常数导数为零','derivative-rules','常数函数的导数恒为零。','5.2',73],
['HS-CALC-LINEARITY-001','导数的线性运算','常数因子与求和','derivative-rules','可导函数的线性组合满足逐项求导与常数因子提出法则。','5.2',73],
['HS-CALC-PRODUCT-RULE-001','乘积求导法则','前导后加前后导','derivative-rules','(uv)′=u′v+uv′。','5.2',74],
['HS-CALC-QUOTIENT-RULE-001','商的求导法则','分母平方作分母','derivative-rules','(u/v)′=(u′v−uv′)/v²，适用于 v≠0。','5.2',74],
['HS-CALC-CHAIN-RULE-001','复合函数求导法则','外导乘内导','derivative-rules','复合函数求导时对外层求导，再乘以内层函数的导数。','5.2',75],
['HS-CALC-EXPONENTIAL-RULE-001','指数函数求导','指数函数导数','derivative-rules','指数函数 aˣ 的导数为 aˣ ln a（a>0，a≠1）。','5.2',76],
['HS-CALC-LOGARITHM-RULE-001','对数函数求导','对数导数与自变量','derivative-rules','自然对数 ln x 的导数为 1/x（x>0）。','5.2',76],
['HS-CALC-TRIG-RULE-001','三角函数求导','正弦余弦导数','derivative-rules','(sin x)′=cos x，(cos x)′=−sin x。','5.2',77],
['HS-CALC-RECIPROCAL-RULE-001','倒数函数求导','应用负一次幂公式','derivative-rules','在 x≠0 时，(1/x)′=−1/x²，由幂函数导数公式得到。','5.2',73],
['HS-CALC-DERIVATIVE-EXPRESSION-001','复合表达式求导','拆解结构选择法则','derivative-rules','将表达式拆成和、积、商或复合结构后逐步应用求导法则。','5.2',79],
['HS-CALC-DERIVATIVE-AT-POINT-001','求函数在一点的导数','先求导再代入','derivative-rules','先求导函数表达式，再代入目标自变量求瞬时变化率。','5.2',80],
['HS-CALC-DERIVATIVE-APPLICATION-001','导数的实际意义','解释边际变化','derivative-rules','导数可表示速度、增长率或边际变化，解释时需附上变量单位。','5.2',81],
['HS-CALC-MONOTONICITY-CRITERION-001','导数与函数单调性','用导数符号判单调','function-study','在区间上导数恒正可判函数递增，恒负可判函数递减。','5.3',84],
['HS-CALC-CRITICAL-POINT-001','临界点','求导数为零或不存在','function-study','导数为零或不存在的定义域内点可能是极值候选点。','5.3',85],
['HS-CALC-MONOTONICITY-INTERVALS-001','用导数求单调区间','分区间分析导数符号','function-study','求导并确定导数零点或不可导点，按符号分区间判断单调性。','5.3',86],
['HS-CALC-LOCAL-MAXIMUM-001','函数极大值','识别局部由增转减','function-study','函数在某邻域内取到不小于邻近函数值的值时形成局部极大值。','5.3',87],
['HS-CALC-LOCAL-MINIMUM-001','函数极小值','识别局部由减转增','function-study','函数在某邻域内取到不大于邻近函数值的值时形成局部极小值。','5.3',87],
['HS-CALC-EXTREMA-FIRST-DERIVATIVE-001','用一阶导数判极值','检查临界点两侧符号','function-study','导数由正变负对应局部极大，由负变正对应局部极小。','5.3',88],
['HS-CALC-EXTREMA-NECESSARY-CONDITION-001','导数为零不是极值的充分条件','检查临界点两侧符号','function-study','导数为零是取得极值的必要条件，但不是充分条件；例如 x³ 在零点导数为零而无极值。','5.3',92],
['HS-CALC-LOG-BASE-RULE-001','常用对数函数求导','区分常用对数底数','derivative-rules','当 a>0 且 a≠1 时，(logₐx)′=1/(x ln a)，x>0。','5.2',74],
['HS-CALC-ABSOLUTE-EXTREMA-001','闭区间上的最值','比较端点与驻点','function-study','连续函数在闭区间上取得最大值和最小值，候选点包括端点及内部临界点。','5.3',91],
['HS-CALC-GLOBAL-MONOTONICITY-001','由导数符号建立全局单调性','完整检查定义域区间','function-study','将导数符号分析覆盖定义域各区间，再合并得到整体单调性。','5.3',92],
['HS-CALC-ZERO-COUNT-001','导数辅助判断零点个数','单调性限制交点数','function-study','函数在区间严格单调时至多有一个零点，结合端点函数值判断存在性。','5.3',93],
['HS-CALC-OPTIMIZATION-MODEL-001','导数建立最优化模型','建模后求临界点','function-study','把实际目标量表示为单变量函数，求定义域内候选最值并检验边界。','5.3',94],
['HS-CALC-OPTIMIZATION-CONSTRAINT-001','最优化的定义域约束','筛除不可行极值','function-study','实际应用中的最值必须满足原问题变量范围及约束条件。','5.3',95],
['HS-CALC-ROOT-APPROXIMATION-001','导数与零点近似分析','结合变化率定位','function-study','单调性和局部变化信息可辅助确定函数零点所在范围。','5.3',96],
['HS-CALC-FUNCTION-ANALYSIS-001','用导数综合研究函数','连接单调极值图象','function-study','综合导数符号、极值与端点信息刻画函数变化并绘制大致图象。','5.3',97],
['HS-CALC-MARGINAL-ANALYSIS-001','边际成本与边际收益','解释导数的经济含义','function-study','总量函数的导数可表示单位产量附近的边际变化。','5.3',98],
];
const modules=[{id:'derivative-concept',nameZh:'导数概念与意义'},{id:'derivative-rules',nameZh:'导数运算'},{id:'function-study',nameZh:'导数研究函数'}];
const source=(section:string,page:number,summary:string):CurriculumSource=>({volume:'X2',sourceRef:`PEP-A:X2:C5:S${section}`,printedPage:page,pdfPage:page+5,evidence:{sourceRef:`PEP-A:X2:C5:S${section}`,printedPage:page,pdfPage:page+5,evidenceStatus:'DIRECT',summary},scopeNote:'依据人教 A 版选择性必修第二册第五章正文页；pdf_page = printed_page + 5。'});
export const calculusSystem={id:'calculus',nameZh:'导数',nameEn:'CALCULUS',description:'导数概念与运算，以及用导数研究函数单调性、极值和最优化。',modules,concepts:rows.map(([id,canonicalName,achievementName,moduleId,summary,section,page],i)=>({id,canonicalName,achievementName,moduleId,summary,domainId:'calculus',importance:(i%5+1) as 1|2|3|4|5,difficulty:(i%4+2) as 1|2|3|4|5,aliases:[],mathNotationAliases:[],sources:[source(section,page,summary)],isKeyAchievement:[4,8,17,27,30,32,36,39].includes(i),keyAchievementRationale:[4,8,17,27,30,32,36,39].includes(i)?'该成果支撑导数计算或函数研究的独立应用。':null,reviewStatus:'APPROVED' as const}))} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;
const byId=new Map(rows.map(row=>[row[0],row]));
type Relation=[string,string,string];
// Strong links encode counterfactual prerequisites, not textbook reading order.
// The three learning strands converge at function synthesis so its first-click
// initialization is a meaningful cumulative unlock, rather than an arbitrary chain.
const relations:Relation[]=[
 ['HS-CALC-RATE-OF-CHANGE-001','HS-CALC-SECANT-SLOPE-001','先理解区间平均变化率，才能把它解释为图象上割线的斜率。'],
 ['HS-CALC-RATE-OF-CHANGE-001','HS-CALC-DIFFERENCE-QUOTIENT-001','差商是区间平均变化率的代数表达。'],
 ['HS-CALC-DIFFERENCE-QUOTIENT-001','HS-CALC-INSTANT-RATE-001','瞬时变化率由差商在区间长度趋于零时的极限刻画。'],
 ['HS-CALC-SECANT-SLOPE-001','HS-CALC-INSTANT-RATE-001','瞬时变化率是割线斜率在第二个点趋近切点时的极限。'],
 ['HS-CALC-INSTANT-RATE-001','HS-CALC-DERIVATIVE-DEFINITION-001','导数定义把瞬时变化率严格表述为差商极限。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-DERIVATIVE-NOTATION-001','导数记号表示由定义得到的瞬时变化率。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-DIFFERENTIABILITY-001','可导性由某点导数是否存在定义。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-TANGENT-SLOPE-001','导数作为切线斜率的解释建立在导数定义上。'],
 ['HS-CALC-TANGENT-SLOPE-001','HS-CALC-TANGENT-EQUATION-001','写切线方程需要先求出切点处的斜率。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-VELOCITY-001','瞬时速度是位置函数导数的实际解释。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-DERIVATIVE-GRAPH-001','图象局部变化率的导数解释依赖瞬时变化率定义。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-POWER-RULE-001','幂函数求导法则由导数定义推导。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-CONSTANT-RULE-001','常数函数导数为零可由导数定义直接得到。'],
 ['HS-CALC-POWER-RULE-001','HS-CALC-SQUARE-ROOT-RULE-001','平方根求导将根式改写为幂后应用幂函数法则。'],
 ['HS-CALC-POWER-RULE-001','HS-CALC-RECIPROCAL-RULE-001','倒数函数求导可由负一次幂的幂函数法则得到。'],
 ['HS-CALC-POWER-RULE-001','HS-CALC-LINEARITY-001','线性运算要能对各项的导数分别应用幂函数法则。'],
 ['HS-CALC-CONSTANT-RULE-001','HS-CALC-LINEARITY-001','线性组合求导需要处理其中的常数项。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-PRODUCT-RULE-001','乘积求导法则建立在导数定义及乘积差商变形上。'],
 ['HS-CALC-PRODUCT-RULE-001','HS-CALC-QUOTIENT-RULE-001','商求导可改写为乘积与倒数求导，因此需要乘积法则。'],
 ['HS-CALC-RECIPROCAL-RULE-001','HS-CALC-QUOTIENT-RULE-001','商求导需要能够处理分母倒数的导数。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-CHAIN-RULE-001','复合函数求导法则建立在导数定义及复合变化率上。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-EXPONENTIAL-RULE-001','指数函数导数来自导数定义及指数函数极限。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-LOGARITHM-RULE-001','对数函数导数来自导数定义及对数函数极限。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-TRIG-RULE-001','三角函数导数由导数定义与基本三角极限推出。'],
 ['HS-CALC-LOGARITHM-RULE-001','HS-CALC-LOG-BASE-RULE-001','一般底数对数求导由自然对数求导和换底公式得到。'],
 ['HS-CALC-LINEARITY-001','HS-CALC-DERIVATIVE-EXPRESSION-001','复合表达式求导需要先拆分和式并逐项求导。'],
 ['HS-CALC-QUOTIENT-RULE-001','HS-CALC-DERIVATIVE-EXPRESSION-001','识别乘积或商结构后才能选择相应的乘除求导法则。'],
 ['HS-CALC-CHAIN-RULE-001','HS-CALC-DERIVATIVE-EXPRESSION-001','识别复合结构后才能应用链式法则。'],
 ['HS-CALC-DERIVATIVE-EXPRESSION-001','HS-CALC-DERIVATIVE-AT-POINT-001','求一点导数通常先得到可计算的导函数表达式。'],
 ['HS-CALC-DERIVATIVE-AT-POINT-001','HS-CALC-DERIVATIVE-APPLICATION-001','解释具体点处的变化率需要先能求出该点导数。'],
 ['HS-CALC-DERIVATIVE-AT-POINT-001','HS-CALC-MARGINAL-ANALYSIS-001','边际量的计算需要求总量函数在给定产量处的导数。'],
 ['HS-CALC-DERIVATIVE-AT-POINT-001','HS-CALC-MONOTONICITY-CRITERION-001','导数符号判单调需要能够理解和计算函数导数。'],
 ['HS-CALC-DERIVATIVE-GRAPH-001','HS-CALC-MONOTONICITY-CRITERION-001','把导数符号对应到图象增减，为单调性判定提供解释。'],
 ['HS-CALC-DERIVATIVE-DEFINITION-001','HS-CALC-CRITICAL-POINT-001','临界点由导数为零或导数不存在来识别。'],
 ['HS-CALC-MONOTONICITY-CRITERION-001','HS-CALC-MONOTONICITY-INTERVALS-001','分区间分析导数符号需要先掌握导数与单调性的判定。'],
 ['HS-CALC-CRITICAL-POINT-001','HS-CALC-MONOTONICITY-INTERVALS-001','确定单调区间需要用临界点划分定义域。'],
 ['HS-CALC-MONOTONICITY-INTERVALS-001','HS-CALC-EXTREMA-FIRST-DERIVATIVE-001','一阶导数判极值要检查临界点两侧的单调变化。'],
 ['HS-CALC-LOCAL-MAXIMUM-001','HS-CALC-EXTREMA-FIRST-DERIVATIVE-001','判别局部极大值需理解局部极值的定义。'],
 ['HS-CALC-LOCAL-MINIMUM-001','HS-CALC-EXTREMA-FIRST-DERIVATIVE-001','判别局部极小值需理解局部极值的定义。'],
 ['HS-CALC-EXTREMA-FIRST-DERIVATIVE-001','HS-CALC-EXTREMA-NECESSARY-CONDITION-001','反例用于说明必要条件不能替代两侧符号检验。'],
 ['HS-CALC-MONOTONICITY-INTERVALS-001','HS-CALC-ABSOLUTE-EXTREMA-001','闭区间最值需要分析内部临界点及其附近的变化。'],
 ['HS-CALC-LOCAL-MAXIMUM-001','HS-CALC-ABSOLUTE-EXTREMA-001','比较闭区间候选值需要理解最大值的含义。'],
 ['HS-CALC-LOCAL-MINIMUM-001','HS-CALC-ABSOLUTE-EXTREMA-001','比较闭区间候选值需要理解最小值的含义。'],
 ['HS-CALC-MONOTONICITY-INTERVALS-001','HS-CALC-GLOBAL-MONOTONICITY-001','全局判断需要完整覆盖并合并各单调区间。'],
 ['HS-CALC-GLOBAL-MONOTONICITY-001','HS-CALC-ZERO-COUNT-001','利用严格单调性可证明区间内零点至多一个。'],
 ['HS-CALC-ABSOLUTE-EXTREMA-001','HS-CALC-OPTIMIZATION-MODEL-001','实际最优化需比较候选点和边界处的目标函数值。'],
 ['HS-CALC-OPTIMIZATION-MODEL-001','HS-CALC-OPTIMIZATION-CONSTRAINT-001','模型求出的候选极值还需按原问题可行域筛选。'],
 ['HS-CALC-ZERO-COUNT-001','HS-CALC-ROOT-APPROXIMATION-001','用变化趋势缩小零点区间需先能判断零点所在范围。'],
 ['HS-CALC-ZERO-COUNT-001','HS-CALC-FUNCTION-ANALYSIS-001','函数综合分析要结合单调性与零点信息刻画图象。'],
 ['HS-CALC-ABSOLUTE-EXTREMA-001','HS-CALC-FUNCTION-ANALYSIS-001','函数综合分析要结合极值与端点信息描述整体变化。'],
];
const edges:KnowledgeEdge[]=relations.map(([sourceNodeId,targetNodeId,reason],i)=>{const from=byId.get(sourceNodeId)!,to=byId.get(targetNodeId)!;const evidence=[{sourceRef:`PEP-A:X2:C5:S${to[5]}`,printedPage:to[6],pdfPage:to[6]+5,evidenceStatus:'DIRECT' as const,summary:`教材第${to[6]}页定位到目标概念“${to[1]}”；此证据不单独证明该前置关系。`}],record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:`${from[1]}与${to[1]}的数学定义及应用条件。`,definitionAmbiguous:false,prerequisiteCounterfactual:reason,graphContext:`导数知识图谱：${from[1]} → ${to[1]}`,rationale:reason,decision:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]},q=evaluateDependencyQuality(record);return{id:`CALCULUS-EDGE-${String(i+1).padStart(3,'0')}`,sourceNodeId,targetNodeId,dependencyType:'strong',enabled:q.publicationEligible,reviewStatus:q.publicationEligible?'APPROVED':'REVIEW_REQUIRED',...record,qualityDecision:q.decision,qualityConfidence:q.confidence,qualityState:q.state,qualityRationale:reason};});
export const calculusGraph:Graph={nodes:calculusSystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!edges.some(e=>e.enabled&&e.targetNodeId===n.id)})),edges};export const calculusValidation=validateGraph(calculusGraph);
const bridge={canonicalTextbookEvidence:[{sourceRef:'PEP-A:X2:C5:S5.3',printedPage:84,pdfPage:89,evidenceStatus:'DIRECT' as const,summary:'导数章节使用导数符号研究函数单调性和极值。'},{sourceRef:'PEP-A:B1:C3:S3.2',printedPage:76,pdfPage:83,evidenceStatus:'DIRECT' as const,summary:'函数性质章节介绍单调性与最值概念。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'函数单调性是区间上的序关系性质；导数符号可作为判定单调性的充分工具。',definitionAmbiguous:false,prerequisiteCounterfactual:'函数单调性可先由定义和图象学习，导数方法是后续判定工具。',graphContext:'导数为既有函数单调性、极值概念提供分析方法。',rationale:'导数到函数性质的跨域关系仅供导航，不改变函数体系解锁。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const calculusCrossDomainReviews=[{sourceNodeId:'HS-CALC-MONOTONICITY-CRITERION-001',targetNodeId:'HS-FUNC-MONO-001',sourceDomainId:'calculus',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...bridge,outcome:evaluateDependencyQuality(bridge)}];export const calculusSeed={...calculusSystem,graph:calculusGraph,publicationEligible:calculusValidation.length===0,crossDomainReviews:calculusCrossDomainReviews};
