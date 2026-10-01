import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {CurriculumConcept,CurriculumSource} from '../../packages/domain/src/knowledge-system';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph,GraphNode} from '../../packages/graph-core/src/index';
import {validateGraph} from '../../packages/graph-core/src/index';

const source=(section:string,page:number,summary:string):CurriculumSource=>({
 volume:'B1',sourceRef:`PEP-A:B1:C1:S${section}`,printedPage:page,pdfPage:page+7,
 evidence:{sourceRef:`PEP-A:B1:C1:S${section}`,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT',summary},
 scopeNote:'依据人教 A 版必修第一册第一章正文；教材版本与页码核验状态见 TEXTBOOK-SOURCE.md。',
});
type NodeInput=[id:string,name:string,achievement:string,module:string,summary:string,section:string,page:number,importance?:1|2|3|4|5,difficulty?:1|2|3|4|5];
const keyConceptIds=new Set(['HS-SET-EQUALITY-001','HS-SET-UNION-001','HS-LOGIC-BICONDITIONAL-001','HS-LOGIC-UNIVERSAL-NEGATION-001']);
const concept=([id,canonicalName,achievementName,moduleId,summary,section,page,importance=3,difficulty=2]:NodeInput):CurriculumConcept=>({
 id,canonicalName,achievementName,domainId:'sets-logic',moduleId,summary,importance,difficulty,aliases:[],mathNotationAliases:[],sources:[source(section,page,summary)],isKeyAchievement:keyConceptIds.has(id),keyAchievementRationale:keyConceptIds.has(id)?'该成果支撑集合表达或逻辑论证中的独立应用。':null,reviewStatus:'APPROVED',
});

export const setsLogicSystem={
 id:'sets-logic',nameZh:'集合与逻辑',nameEn:'SETS & LOGIC',description:'集合概念、表示、关系与运算，以及条件命题和量词逻辑。',
 modules:[{id:'sets-basics',nameZh:'集合概念与表示'},{id:'set-relations',nameZh:'集合间关系'},{id:'set-operations',nameZh:'集合运算'},{id:'propositions',nameZh:'命题与条件'},{id:'quantifiers',nameZh:'量词与否定'}],
 concepts:[
  concept(['HS-SET-CONCEPT-001','集合的概念','确定对象组成整体','sets-basics','集合是由一些确定对象组成的总体，对象称为元素。','1.1',2,4,2]),
  concept(['HS-SET-NATURAL-LANGUAGE-001','集合的自然语言表示','用文字刻画集合','sets-basics','可以先用自然语言描述研究对象组成的集合，再依据需要改写为列举法或描述法。','1.1',2,3,2]),
  concept(['HS-SET-DETERMINACY-001','集合元素的确定性','判断对象是否属于','sets-basics','给定集合后，任一对象属于或不属于该集合必须能够确定。','1.1',2,4,2]),
  concept(['HS-SET-DISTINCTNESS-001','集合元素的互异性','相同元素只计一次','sets-basics','集合中的元素互不相同，重复列出不会产生新元素。','1.1',2,3,2]),
  concept(['HS-SET-ORDER-INDEPENDENCE-001','集合元素的无序性','交换列举顺序','sets-basics','集合由元素决定，列举元素的先后顺序不影响集合。','1.1',3,3,2]),
  concept(['HS-SET-MEMBERSHIP-001','元素与集合的关系','使用属于符号','sets-basics','a∈A 表示 a 是集合 A 的元素；a∉A 表示 a 不是 A 的元素。','1.1',2,4,2]),
  concept(['HS-SET-NUMBER-SYSTEMS-001','常用数集','识别 N、Z、Q、R','sets-basics','识别自然数集、正整数集、整数集、有理数集和实数集及其记号。','1.1',2,3,2]),
  concept(['HS-SET-ROSTER-001','集合的列举法','逐项写出元素','sets-basics','把集合的全部元素逐一列出并用花括号括起。','1.1',3]),
  concept(['HS-SET-BUILDER-001','集合的描述法','用共同特征刻画','sets-basics','用集合范围和元素满足的性质描述集合，如 {x∈A | P(x)}。','1.1',4,3]),
  concept(['HS-SET-EQUALITY-001','集合相等','比较元素是否相同','sets-basics','两个集合包含完全相同的元素时相等；元素顺序和重复书写不影响相等性。','1.1',4,3]),
  concept(['HS-SET-SUBSET-001','子集','逐元素检验包含','set-relations','A⊆B 表示 A 中每个元素都属于 B。','1.2',7,4,3]),
  concept(['HS-SET-PROPER-SUBSET-001','真子集','包含且不相等','set-relations','A⊊B 表示 A⊆B 且存在 B 中元素不属于 A。','1.2',8,3,3]),
  concept(['HS-SET-EMPTY-001','空集','不含任何元素','set-relations','不含任何元素的集合称为空集，记作 ∅；空集是任何集合的子集。','1.2',8,4,3]),
  concept(['HS-SET-INCLUSION-LAWS-001','子集的基本性质','自反与传递','set-relations','A⊆A；若 A⊆B 且 B⊆C，则 A⊆C。','1.2',8,3,3]),
  concept(['HS-SET-UNIVERSAL-001','全集','确定讨论范围','set-operations','含有所研究问题涉及的全部对象的集合称为全集，常记作 U。','1.3',12,3,2]),
  concept(['HS-SET-UNION-001','集合的并集','满足至少一个条件','set-operations','A∪B 由属于 A 或属于 B 的全部元素组成，重复元素只计一次。','1.3',10,4,3]),
  concept(['HS-SET-INTERSECTION-001','集合的交集','同时满足两个条件','set-operations','A∩B 由同时属于 A 和 B 的元素组成。','1.3',11,4,3]),
  concept(['HS-SET-COMPLEMENT-001','集合的补集','全集中排除 A','set-operations','∁ᵤA 由属于全集 U 且不属于 A 的元素组成，结果依赖所选全集。','1.3',13,4,3]),
  concept(['HS-SET-FINITE-CARDINALITY-001','有限集与基数','计算不同元素个数','set-operations','含有限个元素的集合为有限集；card(A) 表示其元素个数。','1.3',15,3,2]),
  concept(['HS-SET-INCLUSION-EXCLUSION-001','两个有限集合的容斥','加总后扣除重叠','set-operations','有限集合满足 card(A∪B)=card(A)+card(B)−card(A∩B)。','1.3',15,4,3]),
  concept(['HS-LOGIC-PROPOSITION-001','命题','可判断真假的陈述','propositions','命题是能够判断真假的陈述句；真命题为真，假命题为假。','1.4',17,4,2]),
  concept(['HS-LOGIC-CONDITION-CONCLUSION-001','条件与结论','拆解若 p 则 q','propositions','在“若 p，则 q”中，p 是条件，q 是结论。','1.4',17,3,2]),
  concept(['HS-LOGIC-IMPLICATION-001','命题的推出关系','从 p 推出 q','propositions','“若 p，则 q”为真时记作 p⇒q；否则 p 不能推出 q。','1.4',17,4,3]),
  concept(['HS-LOGIC-SUFFICIENT-001','充分条件','条件足以推出结论','propositions','p⇒q 时，p 是 q 的充分条件。充分条件可以不唯一。','1.4',17,4,3]),
  concept(['HS-LOGIC-NECESSARY-001','必要条件','结论必须满足条件','propositions','p⇒q 时，q 是 p 的必要条件；若 q 不成立则 p 不成立。','1.4',17,4,3]),
  concept(['HS-LOGIC-CONVERSE-001','命题的逆命题','交换条件与结论','propositions','将“若 p，则 q”的条件与结论互换，得到逆命题“若 q，则 p”。','1.4',20,3,3]),
  concept(['HS-LOGIC-BICONDITIONAL-001','充要条件','双向推出等价','propositions','p⇔q 表示 p⇒q 且 q⇒p；此时 p、q 互为充要条件。','1.4',20,5,4]),
  concept(['HS-LOGIC-COUNTEREXAMPLE-001','反例与命题判伪','一个反例足以否定','propositions','找到满足条件但不满足结论的例子，即可证明全称形式的推出命题为假。','1.4',18,4,3]),
  concept(['HS-LOGIC-QUANTIFIER-001','量词','限定变量范围','quantifiers','用短语限定变量取值范围，使含变量的陈述句成为可判断真假的命题。','1.5',26,3,3]),
  concept(['HS-LOGIC-UNIVERSAL-001','全称量词命题','范围内全部成立','quantifiers','“对所有 x∈M，P(x)”可记为 ∀x∈M P(x)，要求范围内每个对象都满足 P。','1.5',27,4,3]),
  concept(['HS-LOGIC-EXISTENTIAL-001','存在量词命题','找到至少一个对象','quantifiers','“存在 x∈M，使 P(x)”可记为 ∃x∈M P(x)，找到一个见证即可证明其为真。','1.5',28,4,3]),
  concept(['HS-LOGIC-UNIVERSAL-NEGATION-001','全称命题的否定','用反例否定全部','quantifiers','∀x∈M P(x) 的否定是 ∃x∈M ¬P(x)，须给出反例。','1.5',29,5,4]),
  concept(['HS-LOGIC-EXISTENTIAL-NEGATION-001','存在命题的否定','证明范围内都不成立','quantifiers','∃x∈M P(x) 的否定是 ∀x∈M ¬P(x)，不能只否定某个候选对象。','1.5',30,5,4]),
  concept(['HS-LOGIC-NEGATION-TRUTH-001','命题否定与真假','原命题与否定一真一假','quantifiers','命题及其正确否定互为矛盾关系，二者恰有一个为真。','1.5',30,4,4]),
 ] as const,
} satisfies import('../../packages/domain/src/knowledge-system').CurriculumSystem;

const conceptById=new Map(setsLogicSystem.concepts.map(node=>[node.id,node]));
type Relation={source:string;target:string;because:string;section:string;page:number;type?:'strong'|'weak'};
const relations:readonly Relation[]=[
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-NATURAL-LANGUAGE-001',because:'先理解集合是研究对象组成的总体，才能用自然语言描述其元素范围。',section:'1.1',page:2},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-DETERMINACY-001',because:'集合定义要求组成集合的研究对象能够明确判定。',section:'1.1',page:2},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-DISTINCTNESS-001',because:'集合元素按定义互不相同，重复对象不形成新元素。',section:'1.1',page:2},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-ORDER-INDEPENDENCE-001',because:'集合由元素构成而非列举次序决定。',section:'1.1',page:3},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-MEMBERSHIP-001',because:'概念上直接相关，但确定性已通过集合概念作为 Strong 前置覆盖；保留为语义链接。',section:'1.1',page:3,type:'weak'},
 {source:'HS-SET-DETERMINACY-001',target:'HS-SET-MEMBERSHIP-001',because:'只有对象是否属于集合能够确定时，属于关系才可判定。',section:'1.1',page:3},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-NUMBER-SYSTEMS-001',because:'数集记号用于判断具体数是否属于相应数集。',section:'1.1',page:3},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-ROSTER-001',because:'列举法把有限集合的元素逐项列出。',section:'1.1',page:3},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-BUILDER-001',because:'概念上直接相关，但集合概念到元素关系再到描述法已形成 Strong 路径；保留为语义链接。',section:'1.1',page:4,type:'weak'},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-BUILDER-001',because:'描述法中的元素必须属于指定范围并满足谓词条件。',section:'1.1',page:4},
 {source:'HS-SET-DISTINCTNESS-001',target:'HS-SET-EQUALITY-001',because:'比较集合相等时以实际不同元素为准，重复列项不改变集合。',section:'1.1',page:3},
 {source:'HS-SET-ORDER-INDEPENDENCE-001',target:'HS-SET-EQUALITY-001',because:'集合相等由元素相同决定，与列举顺序无关。',section:'1.1',page:3},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-EQUALITY-001',because:'两个集合包含相同元素时相等。',section:'1.1',page:3},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-SUBSET-001',because:'子集关系要求检查 A 的每个元素是否属于 B。',section:'1.2',page:7},
 {source:'HS-SET-SUBSET-001',target:'HS-SET-PROPER-SUBSET-001',because:'真子集先满足子集关系，再排除两个集合相等。',section:'1.2',page:8},
 {source:'HS-SET-SUBSET-001',target:'HS-SET-EMPTY-001',because:'空集不含反例元素，因此是任意集合的子集。',section:'1.2',page:8},
 {source:'HS-SET-SUBSET-001',target:'HS-SET-INCLUSION-LAWS-001',because:'子集定义推出自反性与传递性。',section:'1.2',page:8},
 {source:'HS-SET-EQUALITY-001',target:'HS-SET-INCLUSION-LAWS-001',because:'两个集合互为子集当且仅当集合相等。',section:'1.2',page:7,type:'weak'},
 {source:'HS-SET-CONCEPT-001',target:'HS-SET-UNIVERSAL-001',because:'全集用于明确当前集合运算所讨论对象的完整范围。',section:'1.3',page:12},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-UNION-001',because:'并集由至少属于 A、B 之一的元素组成。',section:'1.3',page:10},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-INTERSECTION-001',because:'交集由同时属于 A 与 B 的元素组成。',section:'1.3',page:11},
 {source:'HS-SET-UNIVERSAL-001',target:'HS-SET-COMPLEMENT-001',because:'补集必须相对于指定全集排除集合 A 的元素。',section:'1.3',page:13},
 {source:'HS-SET-MEMBERSHIP-001',target:'HS-SET-COMPLEMENT-001',because:'补集通过属于全集且不属于 A 的条件刻画。',section:'1.3',page:13},
 {source:'HS-SET-DISTINCTNESS-001',target:'HS-SET-FINITE-CARDINALITY-001',because:'有限集基数计数的是不同元素而非列举次数。',section:'1.3',page:15},
 {source:'HS-SET-UNION-001',target:'HS-SET-INCLUSION-EXCLUSION-001',because:'并集基数需要扣除并集中被重复计数的交集元素。',section:'1.3',page:15},
 {source:'HS-SET-INTERSECTION-001',target:'HS-SET-INCLUSION-EXCLUSION-001',because:'容斥公式用交集基数校正两集合基数之和。',section:'1.3',page:15},
 {source:'HS-SET-FINITE-CARDINALITY-001',target:'HS-SET-INCLUSION-EXCLUSION-001',because:'容斥关系涉及有限集合的基数运算。',section:'1.3',page:15},
 {source:'HS-LOGIC-PROPOSITION-001',target:'HS-LOGIC-CONDITION-CONCLUSION-001',because:'若 p 则 q 的命题由条件 p 和结论 q 组成。',section:'1.4',page:17},
 {source:'HS-LOGIC-CONDITION-CONCLUSION-001',target:'HS-LOGIC-IMPLICATION-001',because:'由条件推得结论时记为 p⇒q。',section:'1.4',page:17},
 {source:'HS-LOGIC-IMPLICATION-001',target:'HS-LOGIC-SUFFICIENT-001',because:'p⇒q 正是 p 为 q 充分条件的定义。',section:'1.4',page:17},
 {source:'HS-LOGIC-IMPLICATION-001',target:'HS-LOGIC-NECESSARY-001',because:'p⇒q 正是 q 为 p 必要条件的定义。',section:'1.4',page:17},
 {source:'HS-LOGIC-CONDITION-CONCLUSION-001',target:'HS-LOGIC-CONVERSE-001',because:'逆命题通过交换原命题条件与结论构造。',section:'1.4',page:20},
 {source:'HS-LOGIC-IMPLICATION-001',target:'HS-LOGIC-BICONDITIONAL-001',because:'充要条件要求正向和逆向两个推出关系都成立。',section:'1.4',page:20},
 {source:'HS-LOGIC-CONVERSE-001',target:'HS-LOGIC-BICONDITIONAL-001',because:'原命题与其逆命题都为真时形成双向等价。',section:'1.4',page:20},
 {source:'HS-LOGIC-IMPLICATION-001',target:'HS-LOGIC-COUNTEREXAMPLE-001',because:'反例检验是否存在条件成立而结论不成立的对象。',section:'1.4',page:18},
 {source:'HS-LOGIC-PROPOSITION-001',target:'HS-LOGIC-QUANTIFIER-001',because:'量词限定含变量陈述中的取值范围，使陈述成为命题。',section:'1.5',page:26},
 {source:'HS-LOGIC-QUANTIFIER-001',target:'HS-LOGIC-UNIVERSAL-001',because:'全称量词命题对给定范围内每个变量取值作出断言。',section:'1.5',page:27},
 {source:'HS-LOGIC-QUANTIFIER-001',target:'HS-LOGIC-EXISTENTIAL-001',because:'存在量词命题断言给定范围内至少有一个变量取值满足谓词。',section:'1.5',page:28},
 {source:'HS-LOGIC-UNIVERSAL-001',target:'HS-LOGIC-UNIVERSAL-NEGATION-001',because:'否定全称命题等价于找到一个使谓词不成立的反例。',section:'1.5',page:29},
 {source:'HS-LOGIC-EXISTENTIAL-001',target:'HS-LOGIC-EXISTENTIAL-NEGATION-001',because:'否定存在命题要求范围内每个对象都不满足谓词。',section:'1.5',page:30},
 {source:'HS-LOGIC-UNIVERSAL-NEGATION-001',target:'HS-LOGIC-NEGATION-TRUTH-001',because:'全称命题及其正确否定恰有一个为真。',section:'1.5',page:30},
 {source:'HS-LOGIC-EXISTENTIAL-NEGATION-001',target:'HS-LOGIC-NEGATION-TRUTH-001',because:'存在命题及其正确否定恰有一个为真。',section:'1.5',page:30},
];

const makeEdge=({source,target,because,section,page,type='strong'}:Relation,index:number):KnowledgeEdge=>{
 const sourceRef=`PEP-A:B1:C1:S${section}`;
 const evidence=[{sourceRef,printedPage:page,pdfPage:page+7,evidenceStatus:'DIRECT' as const,summary:`教材第${page}页讨论${conceptById.get(target)!.canonicalName}；此定位证明概念内容存在，不单独决定前置关系。`}];
 const record={canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,
  mathematicalDefinition:`${conceptById.get(source)!.canonicalName}与${conceptById.get(target)!.canonicalName}按高中数学定义使用。`,definitionAmbiguous:false,
  prerequisiteCounterfactual:because,graphContext:`集合与逻辑体系内：${conceptById.get(source)!.canonicalName} → ${conceptById.get(target)!.canonicalName}。`,
  rationale:because,decision:type==='weak'?'DOWNGRADE_TO_WEAK' as const:'KEEP_STRONG' as const,confidence:'HIGH' as const,aiReviews:[]};
 const outcome=evaluateDependencyQuality(record);
 return {id:`SET-LOGIC-EDGE-${String(index+1).padStart(3,'0')}`,sourceNodeId:source,targetNodeId:target,
  dependencyType:type,rationale:because,enabled:outcome.publicationEligible,reviewStatus:outcome.publicationEligible?'APPROVED':'REVIEW_REQUIRED',
  canonicalTextbookEvidence:evidence,canonicalEvidenceConflict:false,mathematicalDefinition:record.mathematicalDefinition,
  prerequisiteCounterfactual:record.prerequisiteCounterfactual,graphContext:record.graphContext,definitionAmbiguous:false,
  qualityDecision:outcome.decision,qualityConfidence:outcome.confidence,qualityState:outcome.state,qualityRationale:because,aiReviews:[]};
};
export const setsLogicEdges:readonly KnowledgeEdge[]=relations.map(makeEdge);
const graphNodes:GraphNode[]=setsLogicSystem.concepts.map(n=>({id:n.id,nameZh:n.canonicalName,domainId:n.domainId,retired:false,maxStrongPrerequisites:3,isRoot:!setsLogicEdges.some(e=>e.enabled&&e.dependencyType==='strong'&&e.targetNodeId===n.id)}));
export const setsLogicGraph:Graph={nodes:graphNodes,edges:setsLogicEdges};
export const setsLogicValidation=validateGraph(setsLogicGraph);
const functionBridgeEvidence=[
 {sourceRef:'PEP-A:B1:C1:S1.1',printedPage:2,pdfPage:9,evidenceStatus:'DIRECT' as const,summary:'集合章节定义集合及其元素，确立元素属于集合的语言。'},
 {sourceRef:'PEP-A:B1:C3:S3.1',printedPage:60,pdfPage:67,evidenceStatus:'DIRECT' as const,summary:'函数章节定义函数并使用集合描述定义域、对应关系。'},
];
const crossDomainRecord={canonicalTextbookEvidence:functionBridgeEvidence,canonicalEvidenceConflict:false,
 mathematicalDefinition:'集合描述对象范围；函数以定义域中的每个元素为输入并对应唯一函数值。',definitionAmbiguous:false,
 prerequisiteCounterfactual:'函数概念仍可通过对应关系先行引入；当前函数体系已把定义域概念置于本域，不要求先完成集合专题。',
 graphContext:'集合语言为函数定义域和对应关系提供数学背景，但属于跨域参照，不参与函数体系解锁。',
 rationale:'集合与函数具有直接的语言基础联系，但不把整套集合专题作为函数解锁前置，故标记 Weak。',
 decision:'DOWNGRADE_TO_WEAK' as const,confidence:'HIGH' as const,aiReviews:[]};
export const setsLogicCrossDomainReviews=[{sourceNodeId:'HS-SET-CONCEPT-001',targetNodeId:'HS-FUNC-CONCEPT-001',sourceDomainId:'sets-logic',targetDomainId:'functions',dependencyType:'weak' as const,reviewStatus:'APPROVED' as const,...crossDomainRecord,outcome:evaluateDependencyQuality(crossDomainRecord)}];
export const setsLogicSeed={...setsLogicSystem,graph:setsLogicGraph,publicationEligible:setsLogicValidation.length===0,crossDomainReviews:setsLogicCrossDomainReviews};
