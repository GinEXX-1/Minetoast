import type { KnowledgeNode, KnowledgeEdge } from '../../packages/domain/src/index';
export const FIXTURE_VERSION = 'phase1-function-20-v1';
export const nodeSpecs = [
 ['MS-NUM-REAL-001','实数','数的起点','middle_school','有理数与无理数统称实数。','\\mathbb{R}',0,0],
 ['MS-ALG-LINE-001','数轴','给数一个位置','middle_school','规定原点、正方向和单位长度的直线称为数轴。','-2<-1<0<1<2',1,0],
 ['MS-GEO-COORD-001','平面直角坐标系','找到坐标','middle_school','用互相垂直的两条数轴确定平面中点的位置。','P=(x,y)',1,2],
 ['HS-SET-CONCEPT-001','集合的概念','收集与分类','high_school','集合是某些确定的对象组成的整体；对象称为元素。','a\\in A',1,1],
 ['HS-FUNC-INTERVAL-001','区间表示','读懂范围','high_school','用区间表示连续的实数集合；端点是否包含由括号表示。','[a,b]=\\{x\\in\\mathbb R\\mid a\\le x\\le b\\}',2,0],
 ['HS-FUNC-MAPPING-001','对应关系','输入与输出','high_school','考察两个集合的元素之间如何对应，为函数定义做准备。','x\\mapsto y',2,2],
 ['HS-FUNC-CONCEPT-001','函数的概念','唯一的回应','high_school','对非空数集 A 中每一个 x，按对应关系 f，在非空数集 B 中都有唯一确定的 y 与之对应。','y=f(x),\\quad x\\in A',3,2],
 ['HS-FUNC-DOMAIN-001','函数的定义域','输入的边界','high_school','定义域是使函数有意义的全部自变量取值组成的集合。','f(x)=\\sqrt{x}\\quad\\Rightarrow\\quad D=[0,+\\infty)',4,0],
 ['HS-FUNC-RANGE-001','函数的值域','输出的疆域','high_school','值域是自变量遍历定义域时，所有函数值组成的集合。','f(x)=x^2,\\ x\\in\\mathbb R\\quad\\Rightarrow\\quad R=[0,+\\infty)',4,1],
 ['HS-FUNC-VALUE-001','求函数值','代入与计算','high_school','将定义域内给定的自变量值代入函数表达式。','f(x)=2x+1\\quad\\Rightarrow\\quad f(3)=7',4,2],
 ['HS-FUNC-GRAPH-001','函数的图像','把关系画出来','high_school','函数图像由所有满足 y=f(x) 且 x 属于定义域的点组成。','\\{(x,f(x))\\mid x\\in D\\}',5,2],
 ['HS-FUNC-MONO-001','函数的单调性','变化的方向','high_school','在给定区间内，比较任意两个自变量及其函数值的大小关系。','x_1<x_2\\Rightarrow f(x_1)<f(x_2)',6,0],
 ['HS-FUNC-PARITY-001','函数的奇偶性','对称的秘密','high_school','先检查定义域是否关于原点对称，再判断函数值之间的关系。','f(-x)=f(x)\\quad\\text{或}\\quad f(-x)=-f(x)',6,1],
 ['HS-FUNC-EXTREME-001','函数的最大值与最小值','高处与低处','high_school','最大值与最小值必须在定义域内实际取得，不能只凭趋近判断。','f(x)=x^2,\\ x\\in[-1,2]\\quad\\Rightarrow\\quad \\min f=0,\\ \\max f=4',6,2],
 ['HS-FUNC-LINEAR-001','一次函数的图像与性质','直线的方向','high_school','一次函数 y=kx+b（k≠0）的图像是一条直线；斜率决定变化方向。','y=kx+b,\\quad k\\ne0',6,3],
 ['HS-FUNC-QUAD-001','二次函数的图像与性质','抛物线之谷','high_school','二次函数图像是抛物线；顶点式帮助识别对称轴和顶点。','y=a(x-h)^2+k,\\quad a\\ne0',6,4],
 ['HS-FUNC-SHIFT-001','函数图像的平移','移动而不变形','high_school','理解图像左右、上下平移时自变量和函数值如何变化。','y=f(x-h)+k',7,3],
 ['HS-FUNC-ZERO-001','函数的零点','与横轴相遇','high_school','使函数值为零的实数 x 称为函数的零点；零点是数，不是点。','f(x)=0',7,4],
 ['HS-FUNC-PIECE-001','分段函数求值','选择正确的路','high_school','先按自变量所在范围选定对应表达式，再计算函数值。','f(x)=\\begin{cases}x,&x\\ge0\\\\-x,&x<0\\end{cases}',5,0],
 ['HS-FUNC-APPLY-001','函数模型的简单应用','连接真实问题','high_school','根据情境选择表达式、说明变量含义，并检查实际取值范围。','y=f(x),\\quad x\\in D_{\\text{实际}}',8,2],
] as const;
export const fixtureNodes: KnowledgeNode[] = nodeSpecs.map((s,i)=>({
 id:s[0],nameZh:s[1],achievementName:s[2],stage:s[3],descriptionShort:s[4],contentDetailed:s[4],
 domainId:'functions',moduleId:s[3]==='middle_school'?'foundation':'function-core',tags:s[3]==='middle_school'?['初中','测试']:['测试'],
 nodeType:i===19?'key_achievement':i===6?'core':'normal',difficulty:2,gaokaoImportance:3,
 textbookReferences:[],formulas:[{id:'main',latex:s[5],explanation:s[4],conditions:i===11?'此处展示的是给定区间内严格增函数的定义条件。':'使用前须检查对应表达式的定义域和参数条件。'}],
 skillsRequired:[],commonQuestionTypes:[],commonMistakes:[],namePinyin:'',pinyinInitials:'',aliases:[],studentAliases:i===15?['抛物线','开口向上']:[],mathNotationAliases:[],
 worldLandmark:false,isRoot:i===0,rootRationale:i===0?'测试切片的基础入口，不代表实数没有更基础的知识。':undefined,
 maxStrongPrerequisites:3,keyAchievementRationale:i===19?'函数切片中多条知识路径的综合应用测试。':undefined,
 reviewStatus:'REVIEW_REQUIRED',retired:false,createdAt:'2026-09-06T00:00:00.000Z',updatedAt:'2026-09-06T00:00:00.000Z'
}));
// Indexes are fixture authoring shorthand only. Persisted edges use permanent IDs.
const strong: [number,number,string][] = [
 [0,1,'用实数表示数轴上点对应的数。'],[0,2,'用有序实数对描述平面位置。'],[0,3,'本切片使用实数集作为集合的具体对象。'],
 [1,4,'区间端点与连续范围需要数轴定位。'],[3,4,'区间是实数集合的一种表示。'],
 [3,5,'对应关系需要明确元素所在的集合。'],[2,5,'以有序数对帮助理解本测试中的数值对应。'],[5,6,'函数是具有唯一输出要求的对应关系。'],
 [6,7,'定义域是函数定义中的自变量集合。'],[4,7,'本切片用区间表达定义域。'],
 [6,8,'值域由函数的实际输出构成。'],[4,8,'本切片使用区间表示值域。'],[6,9,'计算前须理解自变量与函数值的对应。'],
 [9,10,'用自变量和对应函数值构造图像上的点。'],
 [10,11,'本测试通过图像解释变化方向。'],[4,11,'单调性在指定区间内讨论。'],
 [10,12,'通过图像对称性理解奇偶性。'],[7,12,'奇偶性首先要求定义域关于原点对称。'],
 [8,13,'最大最小值涉及实际可取的输出范围。'],[10,13,'图像帮助辨识是否实际取得最高最低函数值。'],
 [10,14,'一次函数性质的本测试以图像为基础。'],[10,15,'本测试通过抛物线认识二次函数性质。'],
 [10,16,'图像平移需要理解点与函数图像的关系。'],[10,17,'本测试通过图像与横轴的关系解释零点。'],
 [7,18,'分段规则必须按自变量所属范围选择。'],[9,18,'选定分支后计算对应函数值。'],
 [15,19,'本测试的应用包含二次函数情境。'],[18,19,'本测试的应用包含按范围分段的情境。']
];
const weak: [number,number,string][] = [[14,15,'直线与抛物线的比较有助于理解，但不作为解锁门槛。'],[11,13,'单调性有助于定位最值，但本切片可直接从图像读取。'],[12,16,'对称性有助于比较平移前后的图像，不决定解锁。']];
export const fixtureEdges: KnowledgeEdge[] = [...strong.map(e=>[...e,'strong'] as const),...weak.map(e=>[...e,'weak'] as const)].map((e,i)=>({
 id:`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,sourceNodeId:nodeSpecs[e[0]][0],targetNodeId:nodeSpecs[e[1]][0],rationale:e[2],dependencyType:e[3],enabled:true,reviewStatus:'REVIEW_REQUIRED'
}));
export const fixture = {schemaVersion:1 as const,fixtureVersion:FIXTURE_VERSION,contentMode:'test' as const,notice:'20 个交互测试节点；依赖与内容尚未经过正式教研审核，不作为完整学习路径。',nodes:fixtureNodes,edges:fixtureEdges};
