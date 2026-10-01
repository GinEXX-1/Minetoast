import {evaluateDependencyQuality} from '../../packages/domain/src/dependency-quality';
import type {KnowledgeEdge} from '../../packages/domain/src/index';
import type {Graph,GraphNode} from '../../packages/graph-core/src/index';
import {functionOntologySeed} from './function-ontology';
import {functionDependencyProposals} from './function-dependency-proposals';
import {dependencyDefinitions} from './function-dependency-definitions';
import {independentReviews,prerequisiteDecisions,rootDecisions,pendingScopeNodeIds} from './function-dependency-reviews';

const external=new Set<string>(prerequisiteDecisions.filter(n=>!n.visible).map(n=>n.nodeId));
const pending=new Set<string>(pendingScopeNodeIds);
const active=new Set(functionOntologySeed.nodes.filter(n=>!external.has(n.id)&&!pending.has(n.id)).map(n=>n.id));
export const functionDependencyAssessments=functionDependencyProposals.map(proposal=>{
 if(!dependencyDefinitions[proposal.sourceNodeId]||!dependencyDefinitions[proposal.targetNodeId])throw new Error('DEPENDENCY_DEFINITION_MISSING');
 const second=independentReviews.find(r=>r.code===proposal.firstReviewCode);
 const record={...proposal.firstAssessment,
  mathematicalDefinition:`Source定义：${dependencyDefinitions[proposal.sourceNodeId]} Target定义：${dependencyDefinitions[proposal.targetNodeId]}`,
  aiReviews:[...proposal.firstAssessment.aiReviews,...(second?[second.review]:[])]};
 const outcome=evaluateDependencyQuality(record);
 return {...proposal,record,outcome};
});

/** Candidate-only materialization; a passed REMOVE is still not an effective edge. */
export const functionEdgeSeed: readonly KnowledgeEdge[]=functionDependencyAssessments.map(a=>({
 id:a.id,sourceNodeId:a.sourceNodeId,targetNodeId:a.targetNodeId,
 dependencyType:a.outcome.decision==='DOWNGRADE_TO_WEAK'?'weak':'strong',
 rationale:a.record.rationale,
 enabled:a.outcome.publicationEligible&&['KEEP_STRONG','DOWNGRADE_TO_WEAK'].includes(a.outcome.decision)&&active.has(a.sourceNodeId)&&active.has(a.targetNodeId),
 reviewStatus:a.outcome.publicationEligible?'APPROVED':'REVIEW_REQUIRED',
 canonicalTextbookEvidence:a.record.canonicalTextbookEvidence,
 canonicalEvidenceConflict:a.record.canonicalEvidenceConflict,
 mathematicalDefinition:a.record.mathematicalDefinition,
 definitionAmbiguous:a.record.definitionAmbiguous,
 prerequisiteCounterfactual:a.record.prerequisiteCounterfactual,
 graphContext:a.record.graphContext,qualityRationale:a.record.rationale,
 qualityDecision:a.outcome.decision,qualityConfidence:a.outcome.confidence,qualityState:a.outcome.state,
 aiReviews:a.record.aiReviews,
}));

const rootIds=new Set<string>(rootDecisions.map(r=>r.nodeId));
// Structural adapter only: no fabricated full content and no database/API seed switch.
const graphNodes:GraphNode[]=functionOntologySeed.nodes.filter(n=>active.has(n.id)).map(n=>({
 id:n.id,nameZh:n.canonicalName,domainId:n.domain,retired:false,
 maxStrongPrerequisites:3,isRoot:rootIds.has(n.id),
}));
export const functionCandidateGraph:Graph={nodes:graphNodes,edges:functionEdgeSeed.filter(e=>e.enabled)};
export const functionDependencySeed={
 fixtureVersion:'phase2b-function-dependencies-v1',phase:'2B',publicationEligible:false,
 nodeRegistry:functionOntologySeed.nodes,externalNodeIds:[...external],pendingScopeNodeIds,
 graph:functionCandidateGraph,assessments:functionDependencyAssessments,
 defaultShowWeak:false,
} as const;
