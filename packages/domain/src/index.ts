/** Phase 0 contracts. Pure data types; no UI, database driver or runtime validators. */
export * from './dependency-quality';
import type {DependencyAIReview,DependencyConfidence,DependencyQualityDecision,DependencyQualityState,CanonicalTextbookEvidence} from './dependency-quality';
export type NodeId = string; // API validates HS/MS ID pattern; identity never reused.
export type ISODateTime = string;
export type Rating = 1 | 2 | 3 | 4 | 5;
export type ReviewStatus = 'DRAFT' | 'REVIEW_REQUIRED' | 'APPROVED' | 'REJECTED';
export type Stage = 'middle_school' | 'high_school';
export type NodeType = 'normal' | 'core' | 'key_achievement';
export type NodeStatus = 'locked' | 'available' | 'unlocked';
export interface TextbookReference {
  publisher: string; series: string; edition: string; volume: string;
  chapter: string; section: string; page?: string; sourceUrl?: string;
  sourceRef?: string; printedPage?: number; pdfPage?: number;
  evidenceStatus?: CanonicalTextbookEvidence['evidenceStatus'];
}
export interface MathFormula { id: string; latex: string; explanation: string; conditions: string; }
export interface KnowledgeNode {
  id: NodeId; nameZh: string; achievementName: string; nameEn?: string;
  descriptionShort: string; contentDetailed: string; // sanitized Markdown, never executable MDX
  domainId: string; moduleId: string; stage: Stage; tags: readonly string[];
  nodeType: NodeType; difficulty: Rating; gaokaoImportance: Rating;
  textbookReferences: readonly TextbookReference[]; formulas: readonly MathFormula[];
  skillsRequired: readonly string[]; commonQuestionTypes: readonly string[];
  commonMistakes: readonly string[]; namePinyin: string; pinyinInitials: string;
  aliases: readonly string[]; studentAliases: readonly string[];
  mathNotationAliases: readonly string[]; iconAsset?: string; backgroundTheme?: string;
  worldLandmark: boolean; // projected from map_landmarks; no duplicated database boolean
  isRoot: boolean; rootRationale?: string;
  maxStrongPrerequisites: 3 | 5; prerequisiteExceptionRationale?: string;
  keyAchievementRationale?: string; reviewStatus: ReviewStatus; retired: boolean;
  createdAt: ISODateTime; updatedAt: ISODateTime;
}
export interface KnowledgeEdge {
  id: string; sourceNodeId: NodeId; targetNodeId: NodeId;
  dependencyType: 'strong' | 'weak'; rationale: string; enabled: boolean;
  reviewStatus: ReviewStatus; reviewedBy?: string; reviewedAt?: ISODateTime;
  canonicalTextbookEvidence: readonly CanonicalTextbookEvidence[];
  canonicalEvidenceConflict: boolean;
  mathematicalDefinition: string; prerequisiteCounterfactual: string; graphContext: string;
  definitionAmbiguous: boolean;
  qualityDecision: DependencyQualityDecision; qualityConfidence: DependencyConfidence;
  qualityState: DependencyQualityState; qualityRationale: string;
  aiReviews: readonly DependencyAIReview[];
  qualityOverrideBy?: string; qualityOverrideAt?: ISODateTime;
}
export interface MathDomain {
  id: string; nameZh: string; nameEn: string; achievementThemeName?: string;
  description: string; iconAsset?: string; backgroundAsset?: string;
  mapRegionId?: string; displayOrder: number;
}
export interface MathModule { id: string; domainId: string; nameZh: string; nameEn?: string; description: string; }
export type UnlockSource = 'manual' | 'initialization_target' | 'initialization_ancestor' | 'import';
export interface UnlockedRecord {
  userId: string; nodeId: NodeId; source: UnlockSource; unlockedAt: ISODateTime;
  updatedAt: ISODateTime; releaseId: string;
}
export interface UserProgress {
  userId: string; nodeId: NodeId; status: NodeStatus;
  manuallyUnlocked: boolean; initializationUnlocked: boolean;
  source?: UnlockSource; unlockedAt?: ISODateTime; updatedAt: ISODateTime;
  missingStrongPrerequisiteIds: readonly NodeId[];
  graphReleaseId: string; progressRevision: number;
}
export interface PublicUser { id: string; username: string; role: 'student' | 'admin'; }
export interface UserCredential extends PublicUser { passwordHash: string; } // server-only; NEVER API DTO
export type Principal = { kind: 'guest' } | { kind: 'account'; user: PublicUser };
export interface GraphSnapshot {
  schemaVersion: 1; releaseId: string; contentHash: string;
  nodes: readonly KnowledgeNode[]; edges: readonly KnowledgeEdge[];
  domains: readonly MathDomain[]; modules: readonly MathModule[];
  // Endpoint summary projection omits contentDetailed; server snapshot preserves full records.
}
export interface ProgressSnapshot {
  graphReleaseId: string; revision: number; updatedAt: ISODateTime;
  initializationCompletedAt?: ISODateTime; unlocked: readonly UnlockedRecord[];
}
export type ProgressCommand =
  | { kind: 'unlock'; nodeId: NodeId }
  | { kind: 'revoke'; nodeId: NodeId }
  | { kind: 'initialize'; targetNodeIds: readonly NodeId[] }
  | { kind: 'finish_initialization' }
  | { kind: 'import'; mode: 'merge'; backup: ProgressBackup };
export interface CommandEnvelope {
  idempotencyKey: string; graphReleaseId: string; expectedRevision: number;
  command: ProgressCommand; // userId obtained exclusively from server session
}
export interface ProgressResult {
  revision: number; graphReleaseId: string;
  addedNodeIds: readonly NodeId[]; removedNodeIds: readonly NodeId[];
  initializationCompletedAt?: ISODateTime;
}
export interface ProgressBackup {
  schemaVersion: 1; graphReleaseId: string; exportedAt: ISODateTime;
  unlockedNodeIds: readonly NodeId[]; // no passwords, session or authorization fields
}
export type PathQuery =
  | { mode: 'to'; nodeId: NodeId }
  | { mode: 'from'; nodeId: NodeId }
  | { mode: 'between'; source: NodeId; target: NodeId };
export interface PathResult { nodeIds: readonly NodeId[]; edgeIds: readonly string[]; reachable: boolean; }
export interface GraphIssue {
  code: 'CYCLE' | 'DUPLICATE' | 'TRANSITIVE_REDUNDANCY' | 'ORPHAN' | 'OVERCONNECTED' | 'REVIEW_REQUIRED' | 'CONTENT_INVALID';
  severity: 'error' | 'warning'; nodeIds: readonly NodeId[]; edgeIds: readonly string[]; message: string;
}
export interface GraphEngine {
  project(snapshot: GraphSnapshot, progress: ProgressSnapshot | null): ReadonlyMap<NodeId, NodeStatus>;
  strongAncestors(snapshot: GraphSnapshot, target: NodeId): ReadonlySet<NodeId>;
  path(snapshot: GraphSnapshot, query: PathQuery): PathResult;
  validate(snapshot: GraphSnapshot): readonly GraphIssue[];
}
export interface LayoutRequest {
  requestId: string; graphReleaseId: string; domainId: string; layoutVersion: string;
  nodes: readonly { id: NodeId; width: number; height: number }[];
  edges: readonly { source: NodeId; target: NodeId }[];
  overrides: readonly { nodeId: NodeId; x: number; y: number }[];
}
export interface LayoutResult {
  requestId: string; graphReleaseId: string;
  positions: readonly { nodeId: NodeId; x: number; y: number }[];
}
export type NavigationCommand = { kind: 'locate'; nodeId: NodeId } | { kind: 'fit_path'; path: PathResult };
export interface AssetManifest {
  id: string; kind: 'icon' | 'sprite_sheet' | 'background' | 'map' | 'sound' | 'font';
  objectKey: string; sha256: string; mimeType: string; version: number;
  width?: number; height?: number; byteSize: number;
  parentAssetId?: string; crop?: { x: number; y: number; width: number; height: number };
  provenance: { origin: 'aigc' | 'licensed' | 'original' | 'placeholder'; provider?: string; model?: string; promptVersion?: string; prompt?: string; seed?: string; license: string; source?: string; };
  reviewStatus: ReviewStatus; altText: string;
}
