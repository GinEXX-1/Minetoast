import type {DependencyAIReview} from '../../packages/domain/src/dependency-quality';
/** Independent run: only frozen ontology/mapping supplied, no first-round conclusions. */
export const independentReviews: readonly {code:string;review:DependencyAIReview}[] = [
  {
    "code": "CONCEPT>DOMAIN",
    "review": {
      "reviewId": "p2b-independent-1",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "rationale": "允许输入的集合必须具有函数语义；只会代数限制不能完整解释定义域。概念内的术语辨认不等于target的求域技能，不能反向创建环。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "INTERVAL>MONO",
    "review": {
      "reviewId": "p2b-independent-2",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "rationale": "可以用a<x<b等条件指定范围而不掌握完整区间转换；表示技能是帮助而非必要条件。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "DOMAIN>PARITY",
    "review": {
      "reviewId": "p2b-independent-3",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "rationale": "冻结能力要求先检查允许输入对相反数封闭；只检验代数等式会误判受限域。给定域题目未必需完整求域技巧，故MEDIUM。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "PARITY>SYMMETRY",
    "review": {
      "reviewId": "p2b-independent-4",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "rationale": "可从点对(x,y)、(-x,y)或(-x,-y)解释函数值关系，无需先掌握完整奇偶分类流程。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "EXTREME>QUAD",
    "review": {
      "reviewId": "p2b-independent-5",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "rationale": "冻结target未要求所有受限域最值任务，配方、顶点和形状可在抽象最值判定前理解。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "LINEAR>APPLY",
    "review": {
      "reviewId": "p2b-independent-6",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "rationale": "通用建模可选其他基本函数，一次模型只是模型工具之一，不能构成AND门槛。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "QUAD>APPLY",
    "review": {
      "reviewId": "p2b-independent-7",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "rationale": "不掌握二次函数仍可完成一次或其他简单函数模型；二次优化只是一个分支。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "DOMAIN>RECIPROCAL",
    "review": {
      "reviewId": "p2b-independent-8",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "rationale": "冻结target明确包含k/x的定义域、分支和区间单调性；不理解分母限制会连过零或混淆分支。必要的是域意识而非全部高难求域技能。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "MONO>POWER",
    "review": {
      "reviewId": "p2b-independent-9",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "rationale": "五类幂函数性质研究含区间增减，缺少严格比较概念便不能可靠解释x²及1/x等性质。范围解释来自教材89–91页。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "GRAPH>ZERO",
    "review": {
      "reviewId": "p2b-independent-10",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "rationale": "target明确包含横轴交点横坐标，单独会解f(x)=0不能完成其三种表述联系。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "REAL>LINE",
    "review": {
      "reviewId": "p2b-independent-11",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "REVIEW_REQUIRED",
      "confidence": "LOW",
      "rationale": "有理数数轴可先建立，但target是否涵盖任意实数与点的一一对应不明；双方只有38/45高中使用语境，需界定范围。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "REAL>SET",
    "review": {
      "reviewId": "p2b-independent-12",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "REMOVE",
      "confidence": "HIGH",
      "rationale": "集合可用非实数对象完成核心辨认，实数只是实例，非一般集合定义的前置。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  },
  {
    "code": "COORD>MAPPING",
    "review": {
      "reviewId": "p2b-independent-13",
      "reviewerRunId": "/root/independent_dependency_review",
      "model": "gpt-6",
      "decision": "REMOVE",
      "confidence": "HIGH",
      "rationale": "数值对应可用箭头、表格或文字表示；目标并非坐标图表示，不需坐标系。",
      "reviewedAt": "2026-09-24T09:25:17.000Z"
    }
  }
];
export const prerequisiteDecisions = [
  {
    "nodeId": "MS-NUM-REAL-001",
    "decision": "EXTERNAL_REFERENCE",
    "homeDomain": "number-systems",
    "visible": false,
    "rationale": "本切片默认基本实数运算；高中语料不覆盖完整实数概念教学。登记跨领域外部基础，不能把它当集合或数轴的统一Strong门。",
    "referenceTargetIds": [
      "HS-FUNC-MAPPING-001",
      "MS-ALG-LINE-001",
      "HS-ALG-INEQUALITY-001"
    ]
  },
  {
    "nodeId": "MS-ALG-LINE-001",
    "decision": "KEEP_AS_PREREQUISITE",
    "homeDomain": "algebra-foundation",
    "visible": true,
    "rationale": "区间节点明确包含数轴表示，需可见地解释端点与范围；保留初中使用证据的局限。",
    "referenceTargetIds": [
      "HS-FUNC-INTERVAL-001"
    ]
  },
  {
    "nodeId": "MS-GEO-COORD-001",
    "decision": "KEEP_AS_PREREQUISITE",
    "homeDomain": "coordinate-geometry",
    "visible": true,
    "rationale": "函数图象需要有序对定位；可见跨域前置，不据此要求对应关系先学坐标。",
    "referenceTargetIds": [
      "HS-FUNC-GRAPH-001"
    ]
  },
  {
    "nodeId": "HS-SET-CONCEPT-001",
    "decision": "KEEP_AS_PREREQUISITE",
    "homeDomain": "sets-and-logic",
    "visible": true,
    "rationale": "函数定义使用集合与元素语言，有直接高中来源；保留跨域可见节点。",
    "referenceTargetIds": [
      "HS-FUNC-MAPPING-001",
      "HS-FUNC-INTERVAL-001"
    ]
  },
  {
    "nodeId": "HS-ALG-INEQUALITY-001",
    "decision": "KEEP_AS_PREREQUISITE",
    "homeDomain": "algebra-inequalities",
    "visible": true,
    "rationale": "按定义作差证明增减需要不等式规则，有直接教材来源；不把整个不等式专题锁给所有函数节点。",
    "referenceTargetIds": [
      "HS-FUNC-MONOPROOF-001"
    ]
  },
  {
    "nodeId": "MS-ALG-EQUATION-001",
    "decision": "EXTERNAL_REFERENCE",
    "homeDomain": "algebra-equations",
    "visible": false,
    "rationale": "求解、检验方程为跨领域既有基础；当前初中定义来源未完整定位，以外部参考保留，不额外创建节点。",
    "referenceTargetIds": [
      "HS-FUNC-ZERO-001"
    ]
  }
] as const;
export const rootDecisions = [
  {
    "nodeId": "HS-SET-CONCEPT-001",
    "rationale": "集合与元素作为本切片入口，不要求完整实数分类；非声称数学上无任何前置。"
  },
  {
    "nodeId": "MS-ALG-LINE-001",
    "rationale": "数轴以初中定位能力作为切片入口；完整实数分类的候选依赖存在争议而被隔离。"
  },
  {
    "nodeId": "MS-GEO-COORD-001",
    "rationale": "坐标定位作为跨域入口；数轴方向等内部基础由该冻结能力涵盖，不新增未评估门槛。"
  },
  {
    "nodeId": "HS-ALG-INEQUALITY-001",
    "rationale": "基本比较与不等式变换作为代数入口；切片外算术能力以外部假设记录。"
  }
] as const;
export const keyAchievementDecisions = [
  {
    "nodeId": "HS-FUNC-CONCEPT-001",
    "decision": "CONFIRM_KEY",
    "rationale": "函数定义是领域里程碑，且具有多个直接Strong后继；图统计另行列出。"
  },
  {
    "nodeId": "HS-FUNC-MONO-001",
    "decision": "CONFIRM_KEY",
    "rationale": "单调性服务定义证明、区间判定与多种函数性质，是可验证的gateway。"
  },
  {
    "nodeId": "HS-FUNC-PARITY-001",
    "decision": "CONFIRM_KEY",
    "rationale": "保留为函数整体性质的领域里程碑；不借有争议的奇偶性→图象对称性宣称路径汇聚。"
  },
  {
    "nodeId": "HS-FUNC-QUAD-001",
    "decision": "CONFIRM_KEY",
    "rationale": "抛物线、顶点与定义域综合是基本函数的重要里程碑；不强制所有建模经二次函数。"
  },
  {
    "nodeId": "HS-FUNC-APPLY-001",
    "decision": "CONFIRM_KEY",
    "rationale": "定义域与解析表示两路汇聚，承担变量、实际范围和模型解释的综合能力。"
  }
] as const;
export const pendingScopeNodeIds = ['HS-FUNC-SHIFT-001','HS-FUNC-SCALE-001'] as const;

