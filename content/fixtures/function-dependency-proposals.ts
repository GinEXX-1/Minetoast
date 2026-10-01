import type {DependencyQualityRecord} from '../../packages/domain/src/dependency-quality';
export interface FunctionDependencyProposal {
 id: string;
 sourceNodeId: string;
 targetNodeId: string;
 proposedDependencyType: 'strong' | 'weak';
 firstAssessment: DependencyQualityRecord;
 firstReviewCode: string;
 stage: 'strong' | 'medium' | 'weak' | 'removed' | 'review';
}
/** First-round decisions frozen before incorporating independent review. */
export const functionDependencyProposals: readonly FunctionDependencyProposal[] = [
  {
    "id": "20000000-0000-4000-8000-000000000001",
    "sourceNodeId": "HS-SET-CONCEPT-001",
    "targetNodeId": "HS-FUNC-MAPPING-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C1:S1.1",
          "printedPage": 2,
          "pdfPage": 9,
          "evidenceStatus": "DIRECT",
          "summary": "集合与元素；教材范围：支撑函数定义中的集合语言。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：范围限数值对应，不扩展抽象映射理论。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认集合、元素及确定性。Target核心能力：解释两个数集间的输入输出对应及唯一性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "数值对应的源集合、目标集合及元素必须可辨认，否则无法解释哪个输入对应哪个输出。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "数值对应的源集合、目标集合及元素必须可辨认，否则无法解释哪个输入对应哪个输出。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "SET>MAPPING",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000002",
    "sourceNodeId": "HS-FUNC-MAPPING-001",
    "targetNodeId": "HS-FUNC-CONCEPT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：范围限数值对应，不扩展抽象映射理论。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释两个数集间的输入输出对应及唯一性。Target核心能力：用定义域和对应关系判断是否构成函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "函数判定的核心是每个允许输入恰有一个输出；不理解对应关系便无法检查该唯一性约束。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "函数判定的核心是每个允许输入恰有一个输出；不理解对应关系便无法检查该唯一性约束。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MAPPING>CONCEPT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000003",
    "sourceNodeId": "HS-SET-CONCEPT-001",
    "targetNodeId": "HS-FUNC-INTERVAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C1:S1.1",
          "printedPage": 2,
          "pdfPage": 9,
          "evidenceStatus": "DIRECT",
          "summary": "集合与元素；教材范围：支撑函数定义中的集合语言。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 64,
          "pdfPage": 71,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：开闭端点与无穷端点统一在一个节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认集合、元素及确定性。Target核心能力：在区间、集合和数轴之间表达实数范围。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "区间表示的是满足条件的实数集合，不理解元素是否属于集合就无法区分区间端点包含与排除。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "区间表示的是满足条件的实数集合，不理解元素是否属于集合就无法区分区间端点包含与排除。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "SET>INTERVAL",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000004",
    "sourceNodeId": "MS-ALG-LINE-001",
    "targetNodeId": "HS-FUNC-INTERVAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C2:S2.1",
          "printedPage": 38,
          "pdfPage": 45,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "数轴与大小关系；教材范围：正文使用数轴；原点、方向、单位的完整定义需初中来源。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 64,
          "pdfPage": 71,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：开闭端点与无穷端点统一在一个节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用数轴表示数与范围。Target核心能力：在区间、集合和数轴之间表达实数范围。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标明确包含区间与数轴间转换；不能在数轴上定位数和范围就不能完成这一核心表征。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标明确包含区间与数轴间转换；不能在数轴上定位数和范围就不能完成这一核心表征。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "LINE>INTERVAL",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000005",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-RANGE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：基本范围辨认，不包含所有求值域技巧。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：辨认实际输出集合并区别于陪域。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "实际输出集合依赖函数的输入输出规则；不能识别函数输出就不能区别值域与给定目标集合。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "实际输出集合依赖函数的输入输出规则；不能识别函数输出就不能区别值域与给定目标集合。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>RANGE",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000006",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-VALUE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：函数值概念与计算合并。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：在定义域内代入并计算给定函数值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "求函数值必须知道输入、对应规则和输出的含义，否则容易把f(x)当乘法或算错对象。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "求函数值必须知道输入、对应规则和输出的含义，否则容易把f(x)当乘法或算错对象。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>VALUE",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000007",
    "sourceNodeId": "HS-FUNC-DOMAIN-001",
    "targetNodeId": "HS-FUNC-IDENTITY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：包含分母与根式条件的交集。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 66,
          "pdfPage": 73,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：变量字母不同不导致函数不同。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：根据解析式限制和实际背景确定允许输入。Target核心能力：比较定义域与对应关系判定两个表达是否同一函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "判定同一函数必须比较允许输入集合；不会确定允许输入就可能把化简后表达式相同误判为同一函数。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "判定同一函数必须比较允许输入集合；不会确定允许输入就可能把化简后表达式相同误判为同一函数。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "DOMAIN>IDENTITY",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000008",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-ANALYTIC-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：不同于给定解析式后的代入运算。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：用解析式及定义域表达对应关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "解析表示必须表达一个函数的确定对应，缺少函数概念不能检查每个输入是否唯一输出。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "解析表示必须表达一个函数的确定对应，缺少函数概念不能检查每个输入是否唯一输出。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>ANALYTIC",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000009",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-TABLE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：有限采样不自动代表连续函数的全部取值。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：读取与构造输入输出表并识别信息范围。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "输入输出表的每列必须代表同一个函数关系，不能辨认输入与输出就不能解释表格。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "输入输出表的每列必须代表同一个函数关系，不能辨认输入与输出就不能解释表格。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>TABLE",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000010",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-GRAPH-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：解释图象上的点和函数的对应关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "图象上的点必须表达允许输入与唯一函数值，缺少这一含义就无法判断图形是否表示函数。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "图象上的点必须表达允许输入与唯一函数值，缺少这一含义就无法判断图形是否表示函数。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>GRAPH",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000011",
    "sourceNodeId": "MS-GEO-COORD-001",
    "targetNodeId": "HS-FUNC-GRAPH-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C1:S1.2",
          "printedPage": 9,
          "pdfPage": 16,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "习题1.2；教材范围：仅为坐标系使用证据，非完整初中定义。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在平面中解释有序数对与点的位置。Target核心能力：解释图象上的点和函数的对应关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "图象依靠横坐标表示输入、纵坐标表示输出；不理解有序对与平面点就无法读出图象所表达的函数关系。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "图象依靠横坐标表示输入、纵坐标表示输出；不理解有序对与平面点就无法读出图象所表达的函数关系。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "COORD>GRAPH",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000012",
    "sourceNodeId": "HS-FUNC-ANALYTIC-001",
    "targetNodeId": "HS-FUNC-PIECEDEF-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：不同于给定解析式后的代入运算。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 68,
          "pdfPage": 75,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：覆盖分段表示、分界与定义域，不重复求值技能。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用解析式及定义域表达对应关系。Target核心能力：用分支表达式与条件表示同一个函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "分段表示需要为各条件写出对应表达式，不能用解析式表达关系便不能构建分支规则。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "分段表示需要为各条件写出对应表达式，不能用解析式表达关系便不能构建分支规则。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "ANALYTIC>PIECEDEF",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000013",
    "sourceNodeId": "HS-FUNC-PIECEDEF-001",
    "targetNodeId": "HS-FUNC-PIECE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 68,
          "pdfPage": 75,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：覆盖分段表示、分界与定义域，不重复求值技能。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 68,
          "pdfPage": 75,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：沿用P1 ID；保留边界归属检查。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用分支表达式与条件表示同一个函数。Target核心能力：根据输入选取分支再计算函数值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "求值须先按条件选择正确分支；不理解分段表示会在分界处使用错误的表达式。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "求值须先按条件选择正确分支；不理解分段表示会在分界处使用错误的表达式。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "PIECEDEF>PIECE",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000014",
    "sourceNodeId": "HS-FUNC-VALUE-001",
    "targetNodeId": "HS-FUNC-PIECE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：函数值概念与计算合并。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 68,
          "pdfPage": 75,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：沿用P1 ID；保留边界归属检查。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在定义域内代入并计算给定函数值。Target核心能力：根据输入选取分支再计算函数值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "选定分支后仍须计算该输入的函数值，缺少代入求值能力不能完成目标。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "选定分支后仍须计算该输入的函数值，缺少代入求值能力不能完成目标。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "VALUE>PIECE",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000015",
    "sourceNodeId": "HS-FUNC-ANALYTIC-001",
    "targetNodeId": "HS-FUNC-REPRESENT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：不同于给定解析式后的代入运算。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：综合转换任务，不另设空泛的函数表示法父节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用解析式及定义域表达对应关系。Target核心能力：在解析式、表格和图象间转换并解释信息损失。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "三种表示间转换包含构造或解释解析式，不掌握解析表示就缺少一种必要的目标表征。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "三种表示间转换包含构造或解释解析式，不掌握解析表示就缺少一种必要的目标表征。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "ANALYTIC>REPRESENT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000016",
    "sourceNodeId": "HS-FUNC-TABLE-001",
    "targetNodeId": "HS-FUNC-REPRESENT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：有限采样不自动代表连续函数的全部取值。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：综合转换任务，不另设空泛的函数表示法父节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：读取与构造输入输出表并识别信息范围。Target核心能力：在解析式、表格和图象间转换并解释信息损失。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "三种表示间转换包含读取和构造对应值表，缺少列表表示能力无法完成该部分转换。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "三种表示间转换包含读取和构造对应值表，缺少列表表示能力无法完成该部分转换。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "TABLE>REPRESENT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000017",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-REPRESENT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：综合转换任务，不另设空泛的函数表示法父节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：在解析式、表格和图象间转换并解释信息损失。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "三种表示间转换包含解释或生成函数图象，不能理解图象中的输入输出便无法保持转换的语义。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "三种表示间转换包含解释或生成函数图象，不能理解图象中的输入输出便无法保持转换的语义。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>REPRESENT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000018",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-MONO-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：辨认区间内任意两个输入与输出的严格大小关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "单调性比较任意两个允许输入的函数输出，不能辨认函数的输入输出就无法理解比较对象。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "单调性比较任意两个允许输入的函数输出，不能辨认函数的输入输出就无法理解比较对象。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>MONO",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000019",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-MONOPROOF-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：证明技能与概念识别具有不同评价任务。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：完成任取、作差、判号和结论的论证。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "证明必须以区间内任意两输入的大小蕴含输出大小为目标；不理解单调性定义就无法建立待证命题。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "证明必须以区间内任意两输入的大小蕴含输出大小为目标；不理解单调性定义就无法建立待证命题。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MONO>MONOPROOF",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000020",
    "sourceNodeId": "HS-ALG-INEQUALITY-001",
    "targetNodeId": "HS-FUNC-MONOPROOF-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C2:S2.1",
          "printedPage": 41,
          "pdfPage": 48,
          "evidenceStatus": "DIRECT",
          "summary": "不等式性质1–4；教材范围：仅基本性质，不扩展全部不等式专题。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：证明技能与概念识别具有不同评价任务。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：比较实数大小并正确使用不等式基本性质。Target核心能力：完成任取、作差、判号和结论的论证。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "作差后需依不等式性质判号，尤其负数乘除改变不等号；未掌握这些规则会使论证无效。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "作差后需依不等式性质判号，尤其负数乘除改变不等号；未掌握这些规则会使论证无效。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "INEQ>MONOPROOF",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000021",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-MONOINTERVAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 81,
          "pdfPage": 88,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：应用于读图与基本函数，不将不连通区间随意合并。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：在给定定义域中分别报告增减区间。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "求增减区间必须知道何谓该区间任意两点的增减关系，否则只能报告局部采样趋势。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "求增减区间必须知道何谓该区间任意两点的增减关系，否则只能报告局部采样趋势。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MONO>MONOINTERVAL",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000022",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-EXTREME-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：最大、最小合并；不混同局部极值。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：区别上界下界与实际可取得的最大最小值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "最大最小值是所有允许输入的输出中实际取得的界，不理解函数输出就不能辨认比较范围与对象。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "最大最小值是所有允许输入的输出中实际取得的界，不理解函数输出就不能辨认比较范围与对象。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>EXTREME",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000023",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-SYMMETRY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 83,
          "pdfPage": 90,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：仅函数自身对称性；不宣称覆盖全部反射变换。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：联系y轴、原点对称和函数值关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标是把图象的y轴或原点对称联系到函数值；不理解点与输入输出的对应便无法完成几何与代数联系。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标是把图象的y轴或原点对称联系到函数值；不理解点与输入输出的对应便无法完成几何与代数联系。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>SYMMETRY",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000024",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-LINEAR-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合63页函数要素；保持P1 ID。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：联系一次函数系数、直线图象与单调性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标含一次函数直线图象的解释，未掌握函数图象就无法说明系数与直线形状的关系。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标含一次函数直线图象的解释，未掌握函数图象就无法说明系数与直线形状的关系。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>LINEAR",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000025",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-LINEAR-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合63页函数要素；保持P1 ID。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：联系一次函数系数、直线图象与单调性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标明确包含系数与单调性关系，不能辨认增减含义便无法解释系数符号对应的变化。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标明确包含系数与单调性关系，不能辨认增减含义便无法解释系数符号对应的变化。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MONO>LINEAR",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000026",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-QUAD-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合50–51页根与图象，63页值域。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：用抛物线、顶点和定义域讨论基本性质。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标含抛物线及顶点的图象解释，不能解释函数图象的点就不能识别顶点对应的输入输出。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标含抛物线及顶点的图象解释，不能解释函数图象的点就不能识别顶点对应的输入输出。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>QUAD",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000027",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-RECIPROCAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 79,
          "pdfPage": 86,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：教材63页明确提出该函数，79页要求画图并证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：研究k/x的定义域、分支和区间单调性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标包含双曲线分支，缺少图象含义就不能解释两支对应的输入输出区域。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标包含双曲线分支，缺少图象含义就不能解释两支对应的输入输出区域。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>RECIPROCAL",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000028",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-RECIPROCAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 79,
          "pdfPage": 86,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：教材63页明确提出该函数，79页要求画图并证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：研究k/x的定义域、分支和区间单调性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "研究每个分支的区间单调性需要严格增减含义，否则会把跨零的两段误认为整体单调。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "研究每个分支的区间单调性需要严格增减含义，否则会把跨零的两段误认为整体单调。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MONO>RECIPROCAL",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000029",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-POWER-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.3",
          "printedPage": 89,
          "pdfPage": 96,
          "evidenceStatus": "DIRECT",
          "summary": "幂函数定义与研究范围；教材范围：仅教材明确的五种，不外推任意实指数。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：研究指数为1、2、3、1/2、-1的幂函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标明确研究五类幂函数图象，不能解释图象含义便无法比较这些曲线的输入输出特征。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标明确研究五类幂函数图象，不能解释图象含义便无法比较这些曲线的输入输出特征。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>POWER",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000030",
    "sourceNodeId": "HS-FUNC-VALUE-001",
    "targetNodeId": "HS-FUNC-PLOT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：函数值概念与计算合并。"
        },
        {
          "sourceRef": "PEP-A:B1:C3",
          "printedPage": 87,
          "pdfPage": 94,
          "evidenceStatus": "DIRECT",
          "summary": "信息技术应用：用计算机绘制函数图象；教材范围：保留离散点和断点；不能一律连续连线。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在定义域内代入并计算给定函数值。Target核心能力：选取输入、计算输出并在定义域内描点作图。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "描点必须计算所选输入对应的输出；不会求函数值就不能得到要描的点。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "描点必须计算所选输入对应的输出；不会求函数值就不能得到要描的点。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "VALUE>PLOT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000031",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-PLOT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3",
          "printedPage": 87,
          "pdfPage": 94,
          "evidenceStatus": "DIRECT",
          "summary": "信息技术应用：用计算机绘制函数图象；教材范围：保留离散点和断点；不能一律连续连线。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：选取输入、计算输出并在定义域内描点作图。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "作图必须保持点与函数对应、区分离散点和连续曲线，缺少图象含义会错误连接点。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "作图必须保持点与函数对应、区分离散点和连续曲线，缺少图象含义会错误连接点。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>PLOT",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000032",
    "sourceNodeId": "HS-FUNC-VALUE-001",
    "targetNodeId": "HS-FUNC-ZERO-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：函数值概念与计算合并。"
        },
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 142,
          "pdfPage": 149,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.1 函数的零点与方程的解；教材范围：三种表述合并；零点是数而不是点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在定义域内代入并计算给定函数值。Target核心能力：联系函数零点、方程实根和横轴交点横坐标。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "检验候选数是否为零点要判断该输入的函数值是否为0，不能求值便不能完成基本零点检验。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "检验候选数是否为零点要判断该输入的函数值是否为0，不能求值便不能完成基本零点检验。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "VALUE>ZERO",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000033",
    "sourceNodeId": "HS-FUNC-ZERO-001",
    "targetNodeId": "HS-FUNC-ZEROEXIST-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 142,
          "pdfPage": 149,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.1 函数的零点与方程的解；教材范围：三种表述合并；零点是数而不是点。"
        },
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 143,
          "pdfPage": 150,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.1 函数的零点与方程的解；教材范围：存在不等于唯一；不遗漏连续条件。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：联系函数零点、方程实根和横轴交点横坐标。Target核心能力：在连续且端点异号的条件下判断开区间内存在零点。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "存在定理保证区间中存在使函数值为0的数，不理解零点就不能解释定理结论。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "存在定理保证区间中存在使函数值为0的数，不理解零点就不能解释定理结论。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "ZERO>ZEROEXIST",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000034",
    "sourceNodeId": "HS-FUNC-ZEROEXIST-001",
    "targetNodeId": "HS-FUNC-BISECTION-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 143,
          "pdfPage": 150,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.1 函数的零点与方程的解；教材范围：存在不等于唯一；不遗漏连续条件。"
        },
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 145,
          "pdfPage": 152,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.2 用二分法求方程的近似解；教材范围：限满足连续与端点异号的可适用情形。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在连续且端点异号的条件下判断开区间内存在零点。Target核心能力：保持异号区间并按精确度终止二分。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "二分保留异号子区间依据连续与异号的存在保证，未掌握该条件会在不适用函数上错误宣称逼近零点。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "二分保留异号子区间依据连续与异号的存在保证，未掌握该条件会在不适用函数上错误宣称逼近零点。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "ZEROEXIST>BISECTION",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000035",
    "sourceNodeId": "HS-FUNC-ANALYTIC-001",
    "targetNodeId": "HS-FUNC-APPLY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：不同于给定解析式后的代入运算。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.4",
          "printedPage": 95,
          "pdfPage": 102,
          "evidenceStatus": "DIRECT",
          "summary": "例2及练习；教材范围：函数模型与简单应用合并，不建立纯标签节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用解析式及定义域表达对应关系。Target核心能力：明确变量与实际范围、建立基本模型并解释结果。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "本节点要求建立基本函数模型，不能用解析关系表达变量变化就不能完成模型构建。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "本节点要求建立基本函数模型，不能用解析关系表达变量变化就不能完成模型构建。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "ANALYTIC>APPLY",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000036",
    "sourceNodeId": "HS-FUNC-DOMAIN-001",
    "targetNodeId": "HS-FUNC-APPLY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：包含分母与根式条件的交集。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.4",
          "printedPage": 95,
          "pdfPage": 102,
          "evidenceStatus": "DIRECT",
          "summary": "例2及练习；教材范围：函数模型与简单应用合并，不建立纯标签节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：根据解析式限制和实际背景确定允许输入。Target核心能力：明确变量与实际范围、建立基本模型并解释结果。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "模型须限定实际允许输入并解释结果；不能确定实际定义域会给出超出情境的无效模型。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "模型须限定实际允许输入并解释结果；不能确定实际定义域会给出超出情境的无效模型。",
      "decision": "KEEP_STRONG",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "DOMAIN>APPLY",
    "stage": "strong"
  },
  {
    "id": "20000000-0000-4000-8000-000000000037",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-DOMAIN-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：包含分母与根式条件的交集。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：根据解析式限制和实际背景确定允许输入。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "定义域是函数允许输入集合；若没有函数输入含义则无法解释求得的限制条件。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "定义域是函数允许输入集合；若没有函数输入含义则无法解释求得的限制条件。",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-37",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "KEEP_STRONG",
          "confidence": "MEDIUM",
          "rationale": "定义域是函数允许输入集合；若没有函数输入含义则无法解释求得的限制条件。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "CONCEPT>DOMAIN",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000038",
    "sourceNodeId": "HS-FUNC-INTERVAL-001",
    "targetNodeId": "HS-FUNC-MONO-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 64,
          "pdfPage": 71,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：开闭端点与无穷端点统一在一个节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在区间、集合和数轴之间表达实数范围。Target核心能力：辨认区间内任意两个输入与输出的严格大小关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "单调性需知道比较范围，但可用集合条件或语言指定范围，完整区间与数轴转换技能并非必要。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "单调性需知道比较范围，但可用集合条件或语言指定范围，完整区间与数轴转换技能并非必要。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-38",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "DOWNGRADE_TO_WEAK",
          "confidence": "MEDIUM",
          "rationale": "单调性需知道比较范围，但可用集合条件或语言指定范围，完整区间与数轴转换技能并非必要。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "INTERVAL>MONO",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000039",
    "sourceNodeId": "HS-FUNC-DOMAIN-001",
    "targetNodeId": "HS-FUNC-PARITY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：包含分母与根式条件的交集。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 84,
          "pdfPage": 91,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：奇、偶为同一判定任务的分支，合并建模。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：根据解析式限制和实际背景确定允许输入。Target核心能力：检查定义域对称并判断奇函数与偶函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "奇偶性须先验证定义域对相反数封闭；不会确定允许输入可能漏掉定义域不对称。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "奇偶性须先验证定义域对相反数封闭；不会确定允许输入可能漏掉定义域不对称。",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-39",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "KEEP_STRONG",
          "confidence": "MEDIUM",
          "rationale": "奇偶性须先验证定义域对相反数封闭；不会确定允许输入可能漏掉定义域不对称。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "DOMAIN>PARITY",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000040",
    "sourceNodeId": "HS-FUNC-PARITY-001",
    "targetNodeId": "HS-FUNC-SYMMETRY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 84,
          "pdfPage": 91,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：奇、偶为同一判定任务的分支，合并建模。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 83,
          "pdfPage": 90,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：仅函数自身对称性；不宣称覆盖全部反射变换。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：检查定义域对称并判断奇函数与偶函数。Target核心能力：联系y轴、原点对称和函数值关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "目标要求联系图象对称与函数值关系；若不能判定奇偶关系便难以完成该对应解释。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "目标要求联系图象对称与函数值关系；若不能判定奇偶关系便难以完成该对应解释。",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-40",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "KEEP_STRONG",
          "confidence": "MEDIUM",
          "rationale": "目标要求联系图象对称与函数值关系；若不能判定奇偶关系便难以完成该对应解释。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "PARITY>SYMMETRY",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000041",
    "sourceNodeId": "HS-FUNC-EXTREME-001",
    "targetNodeId": "HS-FUNC-QUAD-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：最大、最小合并；不混同局部极值。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合50–51页根与图象，63页值域。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：区别上界下界与实际可取得的最大最小值。Target核心能力：用抛物线、顶点和定义域讨论基本性质。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "抛物线顶点可直接读出且能用配方定位，全域最值定义有帮助但不是识别顶点与形状的必要条件。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "抛物线顶点可直接读出且能用配方定位，全域最值定义有帮助但不是识别顶点与形状的必要条件。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-41",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "DOWNGRADE_TO_WEAK",
          "confidence": "MEDIUM",
          "rationale": "抛物线顶点可直接读出且能用配方定位，全域最值定义有帮助但不是识别顶点与形状的必要条件。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "EXTREME>QUAD",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000042",
    "sourceNodeId": "HS-FUNC-LINEAR-001",
    "targetNodeId": "HS-FUNC-APPLY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合63页函数要素；保持P1 ID。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.4",
          "printedPage": 95,
          "pdfPage": 102,
          "evidenceStatus": "DIRECT",
          "summary": "例2及练习；教材范围：函数模型与简单应用合并，不建立纯标签节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：联系一次函数系数、直线图象与单调性。Target核心能力：明确变量与实际范围、建立基本模型并解释结果。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "基本模型不全是一次函数；可用简单非线性模型完成通用建模任务，因此该特定函数不是统一必要前置。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "基本模型不全是一次函数；可用简单非线性模型完成通用建模任务，因此该特定函数不是统一必要前置。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-42",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "DOWNGRADE_TO_WEAK",
          "confidence": "MEDIUM",
          "rationale": "基本模型不全是一次函数；可用简单非线性模型完成通用建模任务，因此该特定函数不是统一必要前置。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "LINEAR>APPLY",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000043",
    "sourceNodeId": "HS-FUNC-QUAD-001",
    "targetNodeId": "HS-FUNC-APPLY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合50–51页根与图象，63页值域。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.4",
          "printedPage": 95,
          "pdfPage": 102,
          "evidenceStatus": "DIRECT",
          "summary": "例2及练习；教材范围：函数模型与简单应用合并，不建立纯标签节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用抛物线、顶点和定义域讨论基本性质。Target核心能力：明确变量与实际范围、建立基本模型并解释结果。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "用一次或分段规则也可完成简单建模，不掌握二次函数不阻碍所有目标核心能力。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "用一次或分段规则也可完成简单建模，不掌握二次函数不阻碍所有目标核心能力。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-43",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "DOWNGRADE_TO_WEAK",
          "confidence": "MEDIUM",
          "rationale": "用一次或分段规则也可完成简单建模，不掌握二次函数不阻碍所有目标核心能力。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "QUAD>APPLY",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000044",
    "sourceNodeId": "HS-FUNC-DOMAIN-001",
    "targetNodeId": "HS-FUNC-RECIPROCAL-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 65,
          "pdfPage": 72,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：包含分母与根式条件的交集。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 79,
          "pdfPage": 86,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：教材63页明确提出该函数，79页要求画图并证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：根据解析式限制和实际背景确定允许输入。Target核心能力：研究k/x的定义域、分支和区间单调性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "该函数仅需排除分母为0，未掌握通用求定义域流程仍可研究双曲线；通用方法有帮助。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "该函数仅需排除分母为0，未掌握通用求定义域流程仍可研究双曲线；通用方法有帮助。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-44",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "DOWNGRADE_TO_WEAK",
          "confidence": "MEDIUM",
          "rationale": "该函数仅需排除分母为0，未掌握通用求定义域流程仍可研究双曲线；通用方法有帮助。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "DOMAIN>RECIPROCAL",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000045",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-POWER-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.3",
          "printedPage": 89,
          "pdfPage": 96,
          "evidenceStatus": "DIRECT",
          "summary": "幂函数定义与研究范围；教材范围：仅教材明确的五种，不外推任意实指数。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：研究指数为1、2、3、1/2、-1的幂函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "冻结范围研究五类幂函数的性质包含增减比较，不能理解单调性无法解释该性质。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "冻结范围研究五类幂函数的性质包含增减比较，不能理解单调性无法解释该性质。",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-45",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "KEEP_STRONG",
          "confidence": "MEDIUM",
          "rationale": "冻结范围研究五类幂函数的性质包含增减比较，不能理解单调性无法解释该性质。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "MONO>POWER",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000046",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-ZERO-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C4:S4.5",
          "printedPage": 142,
          "pdfPage": 149,
          "evidenceStatus": "DIRECT",
          "summary": "4.5.1 函数的零点与方程的解；教材范围：三种表述合并；零点是数而不是点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：联系函数零点、方程实根和横轴交点横坐标。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "冻结目标要求同时联系零点与横轴交点横坐标，缺少函数图象含义就不能完成这一几何表述。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "冻结目标要求同时联系零点与横轴交点横坐标，缺少函数图象含义就不能完成这一几何表述。",
      "decision": "KEEP_STRONG",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-46",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "KEEP_STRONG",
          "confidence": "MEDIUM",
          "rationale": "冻结目标要求同时联系零点与横轴交点横坐标，缺少函数图象含义就不能完成这一几何表述。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "GRAPH>ZERO",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000047",
    "sourceNodeId": "MS-NUM-REAL-001",
    "targetNodeId": "MS-ALG-LINE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C2:S2.1",
          "printedPage": 38,
          "pdfPage": 45,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "实数大小关系；教材范围：高中页使用实数，不承担初中完整定义。"
        },
        {
          "sourceRef": "PEP-A:B1:C2:S2.1",
          "printedPage": 38,
          "pdfPage": 45,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "数轴与大小关系；教材范围：正文使用数轴；原点、方向、单位的完整定义需初中来源。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：有理数、无理数及实数大小的基础认识。Target核心能力：用数轴表示数与范围。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "有理数数轴可先建立，无需先掌握有理数与无理数的完整分类，完整实数节点不宜作为数轴门槛。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "有理数数轴可先建立，无需先掌握有理数与无理数的完整分类，完整实数节点不宜作为数轴门槛。",
      "decision": "REMOVE",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-47",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "REMOVE",
          "confidence": "MEDIUM",
          "rationale": "有理数数轴可先建立，无需先掌握有理数与无理数的完整分类，完整实数节点不宜作为数轴门槛。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "REAL>LINE",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000048",
    "sourceNodeId": "MS-NUM-REAL-001",
    "targetNodeId": "HS-SET-CONCEPT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C2:S2.1",
          "printedPage": 38,
          "pdfPage": 45,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "实数大小关系；教材范围：高中页使用实数，不承担初中完整定义。"
        },
        {
          "sourceRef": "PEP-A:B1:C1:S1.1",
          "printedPage": 2,
          "pdfPage": 9,
          "evidenceStatus": "DIRECT",
          "summary": "集合与元素；教材范围：支撑函数定义中的集合语言。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：有理数、无理数及实数大小的基础认识。Target核心能力：辨认集合、元素及确定性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "集合可以由非数对象构成，缺少实数知识不会阻碍集合与元素概念。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "集合可以由非数对象构成，缺少实数知识不会阻碍集合与元素概念。",
      "decision": "REMOVE",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-48",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "REMOVE",
          "confidence": "MEDIUM",
          "rationale": "集合可以由非数对象构成，缺少实数知识不会阻碍集合与元素概念。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "REAL>SET",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000049",
    "sourceNodeId": "MS-GEO-COORD-001",
    "targetNodeId": "HS-FUNC-MAPPING-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C1:S1.2",
          "printedPage": 9,
          "pdfPage": 16,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "习题1.2；教材范围：仅为坐标系使用证据，非完整初中定义。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：范围限数值对应，不扩展抽象映射理论。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：在平面中解释有序数对与点的位置。Target核心能力：解释两个数集间的输入输出对应及唯一性。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "集合之间的对应可由箭头或表格表达，平面坐标系不是数值对应的必要前置。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "集合之间的对应可由箭头或表格表达，平面坐标系不是数值对应的必要前置。",
      "decision": "REMOVE",
      "confidence": "MEDIUM",
      "aiReviews": [
        {
          "reviewId": "p2b-r1-49",
          "reviewerRunId": "root-p2b-first-review",
          "model": "gpt-6",
          "decision": "REMOVE",
          "confidence": "MEDIUM",
          "rationale": "集合之间的对应可由箭头或表格表达，平面坐标系不是数值对应的必要前置。",
          "reviewedAt": "2026-09-24T09:24:23.000Z"
        }
      ]
    },
    "firstReviewCode": "COORD>MAPPING",
    "stage": "medium"
  },
  {
    "id": "20000000-0000-4000-8000-000000000050",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-MONO-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：辨认区间内任意两个输入与输出的严格大小关系。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "图象支持观察增减，但任意两输入输出的不等关系可直接用代数判断；不掌握图象仍可理解定义。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "图象支持观察增减，但任意两输入输出的不等关系可直接用代数判断；不掌握图象仍可理解定义。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>MONO",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000051",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-PARITY-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 84,
          "pdfPage": 91,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：奇、偶为同一判定任务的分支，合并建模。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：检查定义域对称并判断奇函数与偶函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "图象对称帮助理解，奇偶性也可用定义域封闭与函数值等式判断，不依赖画图。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "图象对称帮助理解，奇偶性也可用定义域封闭与函数值等式判断，不依赖画图。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>PARITY",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000052",
    "sourceNodeId": "HS-FUNC-RANGE-001",
    "targetNodeId": "HS-FUNC-EXTREME-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：基本范围辨认，不包含所有求值域技巧。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：最大、最小合并；不混同局部极值。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认实际输出集合并区别于陪域。Target核心能力：区别上界下界与实际可取得的最大最小值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "值域有助于整体描述输出，但可直接以任意x的上界与等号取得判断最值，无需先掌握通用值域任务。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "值域有助于整体描述输出，但可直接以任意x的上界与等号取得判断最值，无需先掌握通用值域任务。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "RANGE>EXTREME",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000053",
    "sourceNodeId": "HS-FUNC-MONO-001",
    "targetNodeId": "HS-FUNC-EXTREME-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 77,
          "pdfPage": 84,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：增函数、减函数合并；不将有限取样当证明。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：最大、最小合并；不混同局部极值。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认区间内任意两个输入与输出的严格大小关系。Target核心能力：区别上界下界与实际可取得的最大最小值。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "单调性帮助寻找端点最值，但配方或直接不等式也能确定最值。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "单调性帮助寻找端点最值，但配方或直接不等式也能确定最值。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "MONO>EXTREME",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000054",
    "sourceNodeId": "HS-FUNC-LINEAR-001",
    "targetNodeId": "HS-FUNC-QUAD-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 78,
          "pdfPage": 85,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合63页函数要素；保持P1 ID。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 80,
          "pdfPage": 87,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.1 单调性与最大（小）值；教材范围：结合50–51页根与图象，63页值域。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：联系一次函数系数、直线图象与单调性。Target核心能力：用抛物线、顶点和定义域讨论基本性质。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "比较直线和抛物线有帮助，但二次函数可独立从表达式和图象研究。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "比较直线和抛物线有帮助，但二次函数可独立从表达式和图象研究。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "LINEAR>QUAD",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000055",
    "sourceNodeId": "HS-FUNC-PIECE-001",
    "targetNodeId": "HS-FUNC-APPLY-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 68,
          "pdfPage": 75,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：沿用P1 ID；保留边界归属检查。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.4",
          "printedPage": 95,
          "pdfPage": 102,
          "evidenceStatus": "DIRECT",
          "summary": "例2及练习；教材范围：函数模型与简单应用合并，不建立纯标签节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：根据输入选取分支再计算函数值。Target核心能力：明确变量与实际范围、建立基本模型并解释结果。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "分段求值有助于处理分段模型，但简单应用也可以是不分段模型。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "分段求值有助于处理分段模型，但简单应用也可以是不分段模型。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "PIECE>APPLY",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000056",
    "sourceNodeId": "HS-FUNC-PARITY-001",
    "targetNodeId": "HS-FUNC-POWER-001",
    "proposedDependencyType": "weak",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.2",
          "printedPage": 84,
          "pdfPage": 91,
          "evidenceStatus": "DIRECT",
          "summary": "3.2.2 奇偶性；教材范围：奇、偶为同一判定任务的分支，合并建模。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.3",
          "printedPage": 89,
          "pdfPage": 96,
          "evidenceStatus": "DIRECT",
          "summary": "幂函数定义与研究范围；教材范围：仅教材明确的五种，不外推任意实指数。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：检查定义域对称并判断奇函数与偶函数。Target核心能力：研究指数为1、2、3、1/2、-1的幂函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "奇偶性有助于整理五种幂函数的对称特点，目标研究可先从图象与增减入手。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "奇偶性有助于整理五种幂函数的对称特点，目标研究可先从图象与增减入手。",
      "decision": "DOWNGRADE_TO_WEAK",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "PARITY>POWER",
    "stage": "weak"
  },
  {
    "id": "20000000-0000-4000-8000-000000000057",
    "sourceNodeId": "HS-SET-CONCEPT-001",
    "targetNodeId": "HS-FUNC-CONCEPT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C1:S1.1",
          "printedPage": 2,
          "pdfPage": 9,
          "evidenceStatus": "DIRECT",
          "summary": "集合与元素；教材范围：支撑函数定义中的集合语言。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：辨认集合、元素及确定性。Target核心能力：用定义域和对应关系判断是否构成函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "通过集合→对应关系→函数概念已表达该集合语言前置，额外直接边是传递冗余。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "通过集合→对应关系→函数概念已表达该集合语言前置，额外直接边是传递冗余。",
      "decision": "REMOVE",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "SET>CONCEPT",
    "stage": "removed"
  },
  {
    "id": "20000000-0000-4000-8000-000000000058",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-IDENTITY-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 66,
          "pdfPage": 73,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：变量字母不同不导致函数不同。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：比较定义域与对应关系判定两个表达是否同一函数。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "通过函数概念与定义域的关系候选复核后再判定；同一函数判定所需的函数对应含义由定义域学习背景涵盖；不机械叠加。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "通过函数概念与定义域的关系候选复核后再判定；同一函数判定所需的函数对应含义由定义域学习背景涵盖；不机械叠加。",
      "decision": "REMOVE",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>IDENTITY",
    "stage": "removed"
  },
  {
    "id": "20000000-0000-4000-8000-000000000059",
    "sourceNodeId": "HS-FUNC-CONCEPT-001",
    "targetNodeId": "HS-FUNC-PLOT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 62,
          "pdfPage": 69,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.1 函数的概念；教材范围：自变量、因变量与函数记号作为内部概念，不拆微节点。"
        },
        {
          "sourceRef": "PEP-A:B1:C3",
          "printedPage": 87,
          "pdfPage": 94,
          "evidenceStatus": "DIRECT",
          "summary": "信息技术应用：用计算机绘制函数图象；教材范围：保留离散点和断点；不能一律连续连线。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：用定义域和对应关系判断是否构成函数。Target核心能力：选取输入、计算输出并在定义域内描点作图。",
      "definitionAmbiguous": false,
      "prerequisiteCounterfactual": "函数概念经函数图象和函数值已到达描点，额外边为传递冗余。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "函数概念经函数图象和函数值已到达描点，额外边为传递冗余。",
      "decision": "REMOVE",
      "confidence": "HIGH",
      "aiReviews": []
    },
    "firstReviewCode": "CONCEPT>PLOT",
    "stage": "removed"
  },
  {
    "id": "20000000-0000-4000-8000-000000000060",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-SHIFT-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C5:S5.6",
          "printedPage": 236,
          "pdfPage": 243,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "图象变换过程；教材范围：教材位置明确支持正弦图象水平平移；一般函数与竖直平移的完整范围待补证。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：根据点的坐标变化解释函数图象平移。",
      "definitionAmbiguous": true,
      "prerequisiteCounterfactual": "冻结平移节点覆盖一般函数，但直接教材仅定位正弦水平平移，目标能力范围未稳定，暂不将图象前置发布为Strong。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "冻结平移节点覆盖一般函数，但直接教材仅定位正弦水平平移，目标能力范围未稳定，暂不将图象前置发布为Strong。",
      "decision": "REVIEW_REQUIRED",
      "confidence": "LOW",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>SHIFT",
    "stage": "review"
  },
  {
    "id": "20000000-0000-4000-8000-000000000061",
    "sourceNodeId": "HS-FUNC-GRAPH-001",
    "targetNodeId": "HS-FUNC-SCALE-001",
    "proposedDependencyType": "strong",
    "firstAssessment": {
      "canonicalTextbookEvidence": [
        {
          "sourceRef": "PEP-A:B1:C3:S3.1",
          "printedPage": 67,
          "pdfPage": 74,
          "evidenceStatus": "DIRECT",
          "summary": "3.1.2 函数的表示法；教材范围：图象法合并到此节点，避免重复。"
        },
        {
          "sourceRef": "PEP-A:B1:C5:S5.6",
          "printedPage": 236,
          "pdfPage": 243,
          "evidenceStatus": "PARTIAL_CONTEXTUAL",
          "summary": "图象变换过程；教材范围：本页是正弦函数且A、ω为正；一般函数推广候选待论证。"
        }
      ],
      "canonicalEvidenceConflict": false,
      "mathematicalDefinition": "Source核心能力：解释图象上的点和函数的对应关系。Target核心能力：区分横坐标伸缩和纵坐标伸缩。",
      "definitionAmbiguous": true,
      "prerequisiteCounterfactual": "教材证据仅有正参数正弦伸缩；冻结节点的一般化范围未稳定，暂排入review queue。",
      "graphContext": "以冻结的36节点能力边界评估；直接前置仅保留不能由其他已掌握能力覆盖的目标能力，候选图随后单独执行传递冗余和入度校验。",
      "rationale": "教材证据仅有正参数正弦伸缩；冻结节点的一般化范围未稳定，暂排入review queue。",
      "decision": "REVIEW_REQUIRED",
      "confidence": "LOW",
      "aiReviews": []
    },
    "firstReviewCode": "GRAPH>SCALE",
    "stage": "review"
  }
];

