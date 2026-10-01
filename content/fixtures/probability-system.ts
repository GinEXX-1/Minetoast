import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

type Volume='B2'|'X3';type Row=[string,string,string,string,string,Volume,string,number];
const rows:Row[]=[
['HS-STAT-POPULATION-001','总体与样本','确定研究对象范围','sampling','统计研究通常从总体中抽取样本，据样本信息推断总体特征。','B2','9.1',174],['HS-STAT-CENSUS-001','普查与抽样调查','区分全面与抽样','sampling','普查调查总体中的每个个体；抽样调查只调查抽取的样本。','B2','9.1',175],['HS-STAT-SIMPLE-RANDOM-001','简单随机抽样','等概率抽取个体','sampling','简单随机抽样保证总体中每个个体被抽取的机会相等。','B2','9.1',176],['HS-STAT-RANDOM-NUMBER-001','随机数表抽样','按随机数选样','sampling','随机数表可用于从总体编号中抽取简单随机样本。','B2','9.1',177],['HS-STAT-SYSTEMATIC-001','系统抽样','按等距间隔抽取','sampling','将总体分段后按预先确定的间隔抽取个体。','B2','9.1',178],['HS-STAT-STRATIFIED-001','分层随机抽样','分层后独立抽样','sampling','按差异特征将总体分层，再从各层按比例或方案抽样。','B2','9.1',180],['HS-STAT-SAMPLE-BIAS-001','抽样偏差','识别样本代表性问题','sampling','抽样方式、样本覆盖与无应答可能造成样本偏差。','B2','9.1',182],['HS-STAT-SAMPLE-SIZE-001','样本量与调查误差','权衡成本与精度','sampling','样本量会影响估计精度，也会影响调查成本。','B2','9.1',184],['HS-STAT-FREQUENCY-001','频率分布表','整理样本频数','sampling','将样本数据分组并记录频数和频率以概括分布。','B2','9.1',186],['HS-STAT-HISTOGRAM-001','频率分布直方图','用面积表示频率','sampling','分组宽度相同时频率可由柱高表示；组距不同时用面积表示频率。','B2','9.1',188],['HS-STAT-SAMPLE-MEAN-001','样本平均数','求样本中心水平','sampling','样本平均数以各观测值的算术平均概括数据中心。','B2','9.1',190],['HS-STAT-SAMPLE-VARIANCE-001','样本方差','衡量样本离散程度','sampling','样本方差概括观测值偏离样本平均数的平方离差。','B2','9.1',191],['HS-STAT-SAMPLE-STD-001','样本标准差','以原单位表示离散性','sampling','样本标准差为样本方差的算术平方根。','B2','9.1',192],['HS-STAT-SAMPLE-QUARTILES-001','样本分位数','定位数据相对位置','sampling','分位数将有序数据按比例分割，用于描述分布位置。','B2','9.1',193],
['HS-STAT-SAMPLE-TO-POP-001','由样本估计总体','推广样本信息','estimation','用样本统计量估计总体参数时需考虑随机性和抽样误差。','B2','9.2',194],['HS-STAT-SAMPLE-MEAN-ESTIMATE-001','总体均值的样本估计','用样本均值估计','estimation','样本均值可作为总体均值的点估计。','B2','9.2',195],['HS-STAT-SAMPLE-PROP-001','总体比例的样本估计','用样本频率估计','estimation','样本中具有某特征的频率可估计总体相应比例。','B2','9.2',196],['HS-STAT-SAMPLE-VARIANCE-ESTIMATE-001','总体方差估计','从样本离散性推断','estimation','根据样本离差估计总体离散程度，计算时注意自由度修正。','B2','9.2',197],['HS-STAT-SAMPLING-DISTRIBUTION-001','抽样分布','认识估计量随机性','estimation','反复抽样时统计量呈现随机变化，其分布称为抽样分布。','B2','9.2',198],['HS-STAT-CLT-001','频率稳定性','样本比例趋近总体比例','estimation','在独立重复抽样条件下，样本频率随样本量增大通常更稳定。','B2','9.2',199],['HS-STAT-ESTIMATION-INTERVAL-001','估计区间与不确定性','用区间表达精度','estimation','估计结果可结合样本量和波动程度表达其不确定性。','B2','9.2',201],['HS-STAT-SAMPLE-COMPARISON-001','样本数据比较','对齐统计口径','estimation','比较组间样本需明确总体、抽样方式、变量与统计口径。','B2','9.2',203],['HS-STAT-BOOTSTRAP-INTUITION-001','重复抽样思想','模拟抽样波动','estimation','通过重复抽样理解统计量在不同样本中的变化。','B2','9.2',204],['HS-STAT-DATA-REPORT-001','统计调查报告','交代数据与结论','estimation','报告说明问题、数据来源、抽样方法、分析结果及局限。','B2','9.3',221],['HS-STAT-ASSOCIATION-001','变量关联与统计案例','区分描述与因果','estimation','统计关联不自动推出因果关系，解释时需结合研究设计。','B2','9.3',223],['HS-STAT-SURVEY-DESIGN-001','统计调查方案设计','明确抽样框与变量','sampling','调查方案需确定调查对象、抽样框、数据采集和误差控制。','B2','9.1',183],
['HS-PROB-RANDOM-EXPERIMENT-001','随机试验','条件相同结果不确定','probability-basics','在相同条件下重复进行而结果不确定的试验称为随机试验。','B2','10.1',228],['HS-PROB-SAMPLE-SPACE-001','样本空间','列出基本结果','probability-basics','随机试验所有可能基本结果组成样本空间。','B2','10.1',229],['HS-PROB-EVENT-001','随机事件','用结果集合表示事件','probability-basics','随机事件可视为样本空间的子集。','B2','10.1',230],['HS-PROB-CERTAIN-IMPOSSIBLE-001','必然事件与不可能事件','识别全集与空集','probability-basics','必然事件对应样本空间，不可能事件对应空集。','B2','10.1',231],['HS-PROB-COMPLEMENT-001','对立事件','补集表示事件不发生','probability-basics','事件 A 的对立事件由样本空间中不属于 A 的结果组成。','B2','10.1',232],['HS-PROB-UNION-INTERSECTION-001','事件的并与交','表达至少一个或同时','probability-basics','A∪B 表示至少一个发生，A∩B 表示二者同时发生。','B2','10.1',233],['HS-PROB-CLASSICAL-001','古典概型','等可能基本结果计数','probability-basics','有限样本空间中基本结果等可能时，事件概率为有利结果数除以总结果数。','B2','10.1',236],['HS-PROB-GEOMETRIC-001','几何概型','用测度比求概率','probability-basics','等可能落在区域时，事件概率为有利区域测度与总区域测度之比。','B2','10.1',238],['HS-PROB-ADDITION-001','概率加法公式','处理互斥与重叠','probability-basics','P(A∪B)=P(A)+P(B)−P(A∩B)；互斥时交事件概率为零。','B2','10.1',240],['HS-PROB-CONDITIONAL-001','条件概率','限制到已知事件','probability-basics','P(A|B)=P(A∩B)/P(B)，其中 P(B)>0。','B2','10.1',242],['HS-PROB-INDEPENDENCE-001','事件独立性','概率乘法判独立','independence','A 与 B 独立当且仅当 P(A∩B)=P(A)P(B)。','B2','10.2',249],['HS-PROB-MULTIPLICATION-001','独立事件乘法公式','相乘计算同时发生','independence','相互独立事件同时发生的概率等于各事件概率的乘积。','B2','10.2',250],['HS-PROB-INDEPENDENT-TRIALS-001','独立重复试验','重复独立同条件试验','independence','每次试验相互独立且成功概率相同，可用重复试验模型计数。','B2','10.2',252],['HS-PROB-FREQUENCY-001','频率与概率','频率估计稳定概率','probability-basics','频率由有限次试验统计得到；重复次数增大时可用于估计概率。','B2','10.3',254],['HS-PROB-FREQUENCY-ERROR-001','频率波动','有限试验有随机误差','probability-basics','有限次试验的频率会围绕概率波动，不必恰好等于概率。','B2','10.3',255],
['HS-COUNTING-ADDITION-001','分类加法计数原理','分类后相加','counting','完成一件事有互斥的不同类别时，总方法数等于各类方法数之和。','X3','6.1',3],['HS-COUNTING-MULTIPLICATION-001','分步乘法计数原理','分步后相乘','counting','一件事需连续完成若干步骤时，总方法数等于各步方法数之积。','X3','6.1',5],['HS-COUNTING-CLASSIFY-001','分类与分步计数','判断互斥或连续','counting','计数前判断任务由不同类别完成，还是由连续步骤完成。','X3','6.1',6],['HS-PERMUTATION-001','排列','有序选取并排位','counting','从 n 个不同元素中取 m 个按顺序排成一列称为排列。','X3','6.2',14],['HS-PERMUTATION-NUMBER-001','排列数公式','计算有序选法','counting','排列数 A(n,m)=n(n−1)…(n−m+1)=n!/(n−m)!。','X3','6.2',15],['HS-COMBINATION-001','组合','无序选取','counting','从 n 个不同元素中取 m 个组成一组，与顺序无关。','X3','6.2',16],['HS-COMBINATION-NUMBER-001','组合数公式','计算无序选法','counting','组合数 C(n,m)=n!/[m!(n−m)!]。','X3','6.2',17],['HS-COMBINATION-SYMMETRY-001','组合数对称性质','选择与补选对应','counting','C(n,m)=C(n,n−m)。','X3','6.2',17],['HS-BINOMIAL-THEOREM-001','二项式定理','展开两项和的幂','counting','(a+b)^n=Σ C(n,k)a^(n−k)b^k。','X3','6.3',29],['HS-BINOMIAL-COEFFICIENTS-001','二项展开通项与系数','定位指定项','counting','二项展开第 k+1 项为 C(n,k)a^(n−k)b^k。','X3','6.3',30],['HS-BINOMIAL-IDENTITIES-001','二项式系数性质','由展开式求和','counting','代入特定 a、b 可得到二项式系数和等恒等式。','X3','6.3',31],
['HS-RV-DISCRETE-001','离散型随机变量','以数值表示随机结果','random-variables','将随机试验结果映为实数后得到随机变量；取值有限或可列为离散型。','X3','7.2',56],['HS-RV-DISTRIBUTION-001','离散型随机变量分布列','列出取值与概率','random-variables','分布列记录随机变量各可能取值及对应概率，概率和为一。','X3','7.2',57],['HS-RV-EXPECTATION-001','数学期望','概率加权平均','random-variables','离散型随机变量数学期望为各取值乘其概率后求和。','X3','7.3',62],['HS-RV-VARIANCE-001','方差','期望平方偏差','random-variables','方差为随机变量与其期望之差的平方的期望。','X3','7.3',63],['HS-RV-STD-001','标准差','方差开平方','random-variables','标准差为方差的非负平方根。','X3','7.3',64],['HS-RV-BINOMIAL-001','二项分布','固定次数独立成功','random-variables','n 次独立伯努利试验成功次数服从参数 n、p 的二项分布。','X3','7.4',72],['HS-RV-BINOMIAL-PROB-001','二项分布概率公式','计算指定成功次数','random-variables','P(X=k)=C(n,k)p^k(1−p)^(n−k)。','X3','7.4',73],['HS-RV-HYPERGEOMETRIC-001','超几何分布','无放回抽样计数','random-variables','从有限总体无放回抽样时，样本中指定类别个数服从超几何分布。','X3','7.4',75],['HS-RV-NORMAL-001','正态分布','识别钟形连续分布','random-variables','正态分布由均值 μ 和标准差 σ 确定，密度曲线关于 μ 对称。','X3','7.5',83],['HS-RV-NORMAL-STANDARDIZE-001','正态分布标准化','转化为标准正态','random-variables','若 X~N(μ,σ²)，则 Z=(X−μ)/σ 为标准正态变量。','X3','7.5',85],
['HS-PAIRED-DATA-CORRELATION-001','成对数据与相关关系','识别变量关联','paired-data','成对数据记录两个变量在同一对象上的观测值，可分析其相关关系。','X3','8.1',93],['HS-PAIRED-SCATTER-001','散点图','观察相关方向','paired-data','散点图用点表示成对观测，可初步观察线性趋势、方向和异常值。','X3','8.1',94],['HS-REGRESSION-LINEAR-001','一元线性回归模型','用直线描述趋势','paired-data','一元线性回归用直线模型刻画一个解释变量与一个响应变量的线性关系。','X3','8.2',105],['HS-LEAST-SQUARES-001','最小二乘估计','最小化残差平方和','paired-data','最小二乘法通过最小化残差平方和确定回归直线参数。','X3','8.2',106],['HS-REGRESSION-RESIDUAL-001','残差与拟合效果','比较观测与预测','paired-data','残差是观测值与回归预测值之差，可辅助判断拟合效果。','X3','8.2',107],['HS-CONTINGENCY-TABLE-001','列联表','汇总分类变量频数','paired-data','列联表记录两个分类变量各类别组合的频数。','X3','8.3',124],['HS-CHI-SQUARE-INDEPENDENCE-001','独立性检验','比较观察与期望频数','paired-data','依据列联表中观察频数与独立假设下期望频数的差异检验关联。','X3','8.3',125],
];
const modules=[{id:'sampling',nameZh:'抽样与样本描述'},{id:'estimation',nameZh:'总体估计'},{id:'probability-basics',nameZh:'概率与随机事件'},{id:'independence',nameZh:'条件概率与独立性'},{id:'counting',nameZh:'计数原理与组合'},{id:'random-variables',nameZh:'随机变量分布'},{id:'paired-data',nameZh:'相关、回归与检验'}];
const source=(book:Volume,section:string,page:number,summary:string):CurriculumSource=>{const offset=book==='B2'?7:5;const ch=book==='B2'?(section.startsWith('9.')?'C9':'C10'):(section.startsWith('6.')?'C6':section.startsWith('7.')?'C7':'C8');const ref=`PEP-A:${book}:${ch}:S${section}`;return{volume:book,sourceRef:ref,printedPage:page,pdfPage:page+offset,evidence:{sourceRef:ref,printedPage:page,pdfPage:page+offset,evidenceStatus:'DIRECT',summary},scopeNote:`依据人教 A 版${book}教材章节正文；双页号偏移 ${offset}。`};};
export const probabilitySystem={id:'probability',nameZh:'概率与统计',nameEn:'PROBABILITY & STATISTICS',description:'数据抽样与估计、概率模型、计数、随机变量及统计推断。',modules,concepts:rows.map(([id,canonicalName,achievementName,moduleId,summary,book,section,page],i)=>({id,canonicalName,achievementName,moduleId,summary,domainId:'probability',importance:(i%5+1) as 1|2|3|4|5,difficulty:(i%4+2) as 1|2|3|4|5,aliases:[],mathNotationAliases:[],sources:[source(book,section,page,summary)],isKeyAchievement:[10,21,34,40,48,55,59,66].includes(i),keyAchievementRationale:[10,21,34,40,48,55,59,66].includes(i)?'该成果支持数据解释、概率计算或随机模型的独立应用。':null,reviewStatus:'APPROVED' as const}))} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;
type Relation=[string,string,string];
const relations:readonly Relation[]=[
 ['HS-STAT-POPULATION-001','HS-STAT-CENSUS-001','普查的调查范围是总体中的每个个体。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SIMPLE-RANDOM-001','简单随机抽样从已界定的总体中抽取样本。'],
 ['HS-STAT-SIMPLE-RANDOM-001','HS-STAT-RANDOM-NUMBER-001','随机数表法是实现简单随机抽样的一种程序。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SYSTEMATIC-001','系统抽样需要先确定总体及其排列框架。'],
 ['HS-STAT-POPULATION-001','HS-STAT-STRATIFIED-001','分层抽样先按总体个体特征划分层。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SAMPLE-BIAS-001','抽样偏差要结合目标总体及样本覆盖情况判断。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SAMPLE-SIZE-001','样本量表示从目标总体获取的观测规模。'],
 ['HS-STAT-STRATIFIED-001','HS-STAT-SURVEY-DESIGN-001','抽样方案需根据总体结构选择合适的抽样设计。'],
 ['HS-STAT-SAMPLE-SIZE-001','HS-STAT-SURVEY-DESIGN-001','调查方案需在精度需求与调查成本间确定样本量。'],
 ['HS-STAT-SAMPLE-BIAS-001','HS-STAT-SURVEY-DESIGN-001','调查方案应控制覆盖、抽取及无应答造成的偏差。'],
 ['HS-STAT-POPULATION-001','HS-STAT-FREQUENCY-001','频数与频率表用来概括所采集样本的数据分布。'],
 ['HS-STAT-FREQUENCY-001','HS-STAT-HISTOGRAM-001','直方图以分组频率表示数据分布。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SAMPLE-MEAN-001','样本平均数由总体抽样所得观测值计算。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SAMPLE-VARIANCE-001','样本方差由样本观测值及其中心计算。'],
 ['HS-STAT-SAMPLE-VARIANCE-001','HS-STAT-SAMPLE-STD-001','样本标准差定义为样本方差的算术平方根。'],
 ['HS-STAT-POPULATION-001','HS-STAT-SAMPLE-QUARTILES-001','样本分位数依据样本观测值的有序位置确定。'],
 ['HS-STAT-SIMPLE-RANDOM-001','HS-STAT-SAMPLE-TO-POP-001','由样本推断总体时要考虑样本如何随机抽取。'],
 ['HS-STAT-SAMPLE-TO-POP-001','HS-STAT-SAMPLE-MEAN-ESTIMATE-001','总体均值估计是由样本推断总体参数的具体任务。'],
 ['HS-STAT-SAMPLE-MEAN-001','HS-STAT-SAMPLE-MEAN-ESTIMATE-001','样本均值可作为总体均值的点估计量。'],
 ['HS-STAT-SAMPLE-TO-POP-001','HS-STAT-SAMPLE-PROP-001','总体比例估计属于由样本统计量推断总体参数。'],
 ['HS-STAT-FREQUENCY-001','HS-STAT-SAMPLE-PROP-001','样本中特征所占频率可用于估计总体比例。'],
 ['HS-STAT-SAMPLE-TO-POP-001','HS-STAT-SAMPLE-VARIANCE-ESTIMATE-001','总体离散程度估计是由样本推断总体参数的任务。'],
 ['HS-STAT-SAMPLE-VARIANCE-001','HS-STAT-SAMPLE-VARIANCE-ESTIMATE-001','总体方差估计需要理解样本离差及自由度修正。'],
 ['HS-STAT-SAMPLE-TO-POP-001','HS-STAT-SAMPLING-DISTRIBUTION-001','抽样分布描述样本统计量在重复抽样下的随机变化。'],
 ['HS-STAT-BOOTSTRAP-INTUITION-001','HS-STAT-SAMPLING-DISTRIBUTION-001','重复抽样思想用于理解统计量抽样分布的变异。'],
 ['HS-STAT-SAMPLING-DISTRIBUTION-001','HS-STAT-CLT-001','频率稳定性可从样本频率抽样分布随样本量变化理解。'],
 ['HS-STAT-SAMPLE-PROP-001','HS-STAT-CLT-001','样本频率稳定性针对样本比例这一统计量。'],
 ['HS-STAT-SAMPLING-DISTRIBUTION-001','HS-STAT-ESTIMATION-INTERVAL-001','估计区间需要用统计量的抽样变异表达不确定性。'],
 ['HS-STAT-SAMPLE-SIZE-001','HS-STAT-ESTIMATION-INTERVAL-001','区间估计精度受样本量影响。'],
 ['HS-STAT-SAMPLE-MEAN-001','HS-STAT-SAMPLE-COMPARISON-001','比较组间数据需要明确可比的样本统计量。'],
 ['HS-STAT-SAMPLE-VARIANCE-001','HS-STAT-SAMPLE-COMPARISON-001','比较组间离散程度需要理解样本波动指标。'],
 ['HS-STAT-SURVEY-DESIGN-001','HS-STAT-DATA-REPORT-001','统计报告需要交代调查对象与抽样方案。'],
 ['HS-STAT-ESTIMATION-INTERVAL-001','HS-STAT-DATA-REPORT-001','报告估计结果时需说明不确定性及其限制。'],
 ['HS-PROB-RANDOM-EXPERIMENT-001','HS-PROB-SAMPLE-SPACE-001','样本空间列出随机试验的所有可能基本结果。'],
 ['HS-PROB-SAMPLE-SPACE-001','HS-PROB-EVENT-001','随机事件是样本空间的子集。'],
 ['HS-PROB-SAMPLE-SPACE-001','HS-PROB-CERTAIN-IMPOSSIBLE-001','必然与不可能事件分别对应完整样本空间与空集。'],
 ['HS-PROB-EVENT-001','HS-PROB-COMPLEMENT-001','对立事件由原事件在样本空间中的补集定义。'],
 ['HS-PROB-EVENT-001','HS-PROB-UNION-INTERSECTION-001','事件的并与交通过事件集合运算定义。'],
 ['HS-PROB-EVENT-001','HS-PROB-CLASSICAL-001','古典概型按事件包含的有利基本结果计数。'],
 ['HS-PROB-EVENT-001','HS-PROB-GEOMETRIC-001','几何概型要求把事件表示为样本空间中的有利区域。'],
 ['HS-PROB-UNION-INTERSECTION-001','HS-PROB-ADDITION-001','概率加法公式以并事件和交事件的定义为基础。'],
 ['HS-PROB-UNION-INTERSECTION-001','HS-PROB-CONDITIONAL-001','条件概率分子用交事件表示。'],
 ['HS-PROB-CONDITIONAL-001','HS-PROB-INDEPENDENCE-001','独立性可用条件概率不改变另一事件概率来刻画。'],
 ['HS-PROB-INDEPENDENCE-001','HS-PROB-MULTIPLICATION-001','独立事件同时发生的概率由独立性条件推出。'],
 ['HS-PROB-INDEPENDENCE-001','HS-PROB-INDEPENDENT-TRIALS-001','独立重复试验由各次试验相互独立构成。'],
 ['HS-PROB-RANDOM-EXPERIMENT-001','HS-PROB-FREQUENCY-001','概率频率观点通过重复随机试验的观测频率估计概率。'],
 ['HS-PROB-FREQUENCY-001','HS-PROB-FREQUENCY-ERROR-001','有限次试验的频率围绕真实概率波动。'],
 ['HS-COUNTING-ADDITION-001','HS-COUNTING-CLASSIFY-001','分类计数需要识别互斥类别并分别统计方法数。'],
 ['HS-COUNTING-MULTIPLICATION-001','HS-COUNTING-CLASSIFY-001','分步计数需要识别任务由连续步骤组成。'],
 ['HS-COUNTING-MULTIPLICATION-001','HS-PERMUTATION-001','按顺序选取并排列不同元素可分步计数。'],
 ['HS-PERMUTATION-001','HS-PERMUTATION-NUMBER-001','排列数公式计算排列对象的总数。'],
 ['HS-COMBINATION-001','HS-COMBINATION-NUMBER-001','组合数公式计算不计顺序的选取方法数。'],
 ['HS-COMBINATION-NUMBER-001','HS-COMBINATION-SYMMETRY-001','组合数对称性质来自 C(n,m)=C(n,n−m)。'],
 ['HS-COMBINATION-001','HS-BINOMIAL-THEOREM-001','二项式展开各项系数由组合数给出。'],
 ['HS-BINOMIAL-THEOREM-001','HS-BINOMIAL-COEFFICIENTS-001','通项与系数由二项展开式逐项读取。'],
 ['HS-BINOMIAL-COEFFICIENTS-001','HS-BINOMIAL-IDENTITIES-001','系数和等恒等式由二项展开通项及特定代入得到。'],
 ['HS-RV-DISCRETE-001','HS-RV-DISTRIBUTION-001','分布列列出离散型随机变量的取值及其概率。'],
 ['HS-RV-DISTRIBUTION-001','HS-RV-EXPECTATION-001','数学期望由分布列中的取值和概率加权求和。'],
 ['HS-RV-EXPECTATION-001','HS-RV-VARIANCE-001','方差以随机变量的数学期望为中心衡量波动。'],
 ['HS-RV-VARIANCE-001','HS-RV-STD-001','标准差是方差的非负平方根。'],
 ['HS-PROB-INDEPENDENT-TRIALS-001','HS-RV-BINOMIAL-001','二项分布描述固定次数独立重复试验中的成功次数。'],
 ['HS-RV-DISCRETE-001','HS-RV-BINOMIAL-001','二项分布以离散随机变量记录成功次数。'],
 ['HS-RV-BINOMIAL-001','HS-RV-BINOMIAL-PROB-001','二项分布概率公式计算成功次数对应的概率。'],
 ['HS-COMBINATION-NUMBER-001','HS-RV-BINOMIAL-PROB-001','二项分布概率中的组合系数由组合数公式计算。'],
 ['HS-RV-DISCRETE-001','HS-RV-HYPERGEOMETRIC-001','超几何分布的随机变量记录无放回抽样中的类别数。'],
 ['HS-COMBINATION-NUMBER-001','HS-RV-HYPERGEOMETRIC-001','超几何概率通过组合数计算无放回抽样结果。'],
 ['HS-RV-DISCRETE-001','HS-RV-NORMAL-001','正态分布是连续型随机变量的重要概率模型。'],
 ['HS-RV-NORMAL-001','HS-RV-NORMAL-STANDARDIZE-001','标准化把一般正态变量转化为标准正态变量。'],
 ['HS-PAIRED-DATA-CORRELATION-001','HS-PAIRED-SCATTER-001','散点图用点表示每一对成对观测。'],
 ['HS-PAIRED-SCATTER-001','HS-REGRESSION-LINEAR-001','散点分布为判断是否适合线性回归提供依据。'],
 ['HS-REGRESSION-LINEAR-001','HS-LEAST-SQUARES-001','最小二乘法为线性回归直线估计参数。'],
 ['HS-REGRESSION-LINEAR-001','HS-REGRESSION-RESIDUAL-001','残差由观测值与拟合模型预测值之差计算。'],
 ['HS-PAIRED-DATA-CORRELATION-001','HS-CONTINGENCY-TABLE-001','列联表以两个分类变量的配对观测汇总频数。'],
 ['HS-CONTINGENCY-TABLE-001','HS-CHI-SQUARE-INDEPENDENCE-001','独立性检验使用列联表中的观察频数与期望频数。'],
 ['HS-REGRESSION-RESIDUAL-001','HS-STAT-ASSOCIATION-001','回归残差和拟合诊断提醒关联模型存在解释边界。'],
 ['HS-STAT-SAMPLE-COMPARISON-001','HS-STAT-ASSOCIATION-001','组间比较与关联解释都需区分描述性关系和因果结论。'],
];
const rowById=new Map(rows.map(row=>[row[0],row]));
const edges:KnowledgeEdge[]=relations.map(([sourceNodeId,targetNodeId,reason],i)=>{const from=rowById.get(sourceNodeId)!,to=rowById.get(targetNodeId)!,book=to[5],section=to[6],page=to[7],ref=`PEP-A:${book}:${book==='B2'?(section.startsWith('9.')?'C9':'C10'):section.startsWith('6.')?'C6':section.startsWith('7.')?'C7':'C8'}:S${section}`,evidence=[{sourceRef:ref,printedPage:page,pdfPage:page+(book==='B2'?7:5),evidenceStatus:'DIRECT' as const,summary:`教材第${page}页定位到目标概念“${to[1]}”；此证据不单独证明该前置关系。`}],record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:`${from[1]}与${to[1]}的数学定义及应用条件。`,definitionAmbiguous:false,prerequisiteCounterfactual:reason,graphContext:`概率与统计：${from[1]} → ${to[1]}`,rationale:reason,decision:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]},q=evaluateDependencyQuality(record);return{id:`PROB-EDGE-${String(i+1).padStart(3,'0')}`,sourceNodeId,targetNodeId,dependencyType:'strong',enabled:q.publicationEligible,reviewStatus:q.publicationEligible?'APPROVED':'REVIEW_REQUIRED',...record,qualityDecision:q.decision,qualityConfidence:q.confidence,qualityState:q.state,qualityRationale:reason};});
export const probabilityGraph:Graph={nodes:probabilitySystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!edges.some(e=>e.enabled&&e.targetNodeId===n.id)})),edges};export const probabilityValidation=validateGraph(probabilityGraph);
const bridge={canonicalTextbookEvidence:[{sourceRef:'PEP-A:B2:C9:S9.2',printedPage:193,pdfPage:200,evidenceStatus:'DIRECT' as const,summary:'统计估计使用样本统计量推断总体特征。'},{sourceRef:'PEP-A:B1:C3:S3.4',printedPage:93,pdfPage:100,evidenceStatus:'DIRECT' as const,summary:'函数模型可用于描述变量关系并解决应用问题。'}],canonicalEvidenceConflict:false,mathematicalDefinition:'统计推断由数据样本估计总体参数；函数模型表达变量间的定量关系。',definitionAmbiguous:false,prerequisiteCounterfactual:'统计抽样与估计不要求先学习函数模型应用专题。',graphContext:'函数模型用于表达数据趋势，统计推断用于量化数据不确定性。',rationale:'跨域参照不作为概率统计体系学习前置。',decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const probabilityCrossDomainReviews=[{sourceNodeId:'HS-STAT-SAMPLE-TO-POP-001',targetNodeId:'HS-FUNC-APPLY-001',sourceDomainId:'probability',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...bridge,outcome:evaluateDependencyQuality(bridge)}];export const probabilitySeed={...probabilitySystem,graph:probabilityGraph,publicationEligible:probabilityValidation.length===0,crossDomainReviews:probabilityCrossDomainReviews};
