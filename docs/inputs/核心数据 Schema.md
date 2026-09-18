**KnowledgeNode**

interface KnowledgeNode {

  id: string;

  

  nameZh: string;

  achievementName: string;

  

  nameEn?: string;

  

  descriptionShort: string;

  contentDetailed: string;

  

  domainId: string;

  moduleId: string;

  

  stage: "middle_school" | "high_school";

  

  tags: string[];

  

  nodeType:

    | "normal"

    | "core"

    | "key_achievement";

  

  difficulty: 1 | 2 | 3 | 4 | 5;

  

  gaokaoImportance: 1 | 2 | 3 | 4 | 5;

  

  textbookReferences: TextbookReference[];

  

  formulas: MathFormula[];

  

  skillsRequired: string[];

  

  commonQuestionTypes: string[];

  

  commonMistakes: string[];

  

  namePinyin: string;

  

  pinyinInitials: string;

  

  aliases: string[];

  

  studentAliases: string[];

  

  mathNotationAliases: string[];

  

  iconAsset?: string;

  

  backgroundTheme?: string;

  

  worldLandmark?: boolean;

  

  createdAt: string;

  

  updatedAt: string;

}

  

**KnowledgeEdge**

interface KnowledgeEdge {

  id: string;

  

  sourceNodeId: string;

  

  targetNodeId: string;

  

  dependencyType:

    | "strong"

    | "weak";

  

  rationale: string;

  

  enabled: boolean;

}

rationale 非常重要。

AI 创建任何 prerequisite 时必须解释：

为什么 A 是 B 的前置知识。

这是后续人工审核的重要依据。

  

**Domain**

interface MathDomain {

  id: string;

  

  nameZh: string;

  

  nameEn: string;

  

  achievementThemeName?: string;

  

  description: string;

  

  iconAsset?: string;

  

  backgroundAsset?: string;

  

  mapRegionId?: string;

  

  displayOrder: number;

}

  

**Module**

interface MathModule {

  id: string;

  

  domainId: string;

  

  nameZh: string;

  

  nameEn?: string;

  

  description: string;

}

  

**User**

interface User {

  id: string;

  

  username: string;

  

  passwordHash: string;

  

  createdAt: string;

  

  lastLoginAt?: string;

}

  

**UserProgress**

interface UserProgress {

  userId: string;

  

  nodeId: string;

  

  status:

    | "locked"

    | "available"

    | "unlocked";

  

  manuallyUnlocked: boolean;

  

  initializationUnlocked: boolean;

  

  unlockedAt?: string;

  

  updatedAt: string;

}

实际上 locked / available 最好由图谱实时计算。

数据库原则上重点存：

unlocked=true/false

避免状态冗余出现数据不一致。

  

**47. Node ID Standard**

高中：

HS-FUNC-CONCEPT-001

HS-FUNC-MONO-002

HS-DERIV-LIMIT-001

HS-GEO-VECTOR-004

初中：

MS-ALG-QUAD-001

MS-NUM-REAL-002

原则：

永久 ID 不因中文名称调整而变化。

  

**48. PostgreSQL 推荐表结构**

至少包含：

users

  

math_domains

  

math_modules

  

knowledge_nodes

  

knowledge_edges

  

user_unlocked_nodes

  

achievement_events

  

map_regions

  

map_landmarks

  

node_layouts

  

assets

不使用 Neo4j。

知识图谱关系采用：

PostgreSQL 标准关系表。