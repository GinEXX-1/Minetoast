export type DetailConfidence='HIGH'|'MEDIUM'|'LOW';
export type DetailGateStatus='PASS'|'PASS_WITH_WARNING'|'REVIEW_REQUIRED';
export interface DetailFormula{id:string;latex:string;explanation:string;conditions:string;}
export interface DetailExample{problem:string;recognition:string;reasoning:string;calculation:string;answer:string;insight:string;}
export interface DetailTextbookReference{volume:string;chapter:string;section:string|null;subsection:string;printedPage:number|null;pdfPage:number|null;sourceRef:string;evidenceStatus:'DIRECT'|'PARTIAL_CONTEXTUAL'|'REVIEW_REQUIRED';scopeNote:string;}
export interface DetailRelationship{edgeId:string;nodeId:string;knowledgeName:string;direction:'PREREQUISITE'|'LEADS_TO';dependencyType:'strong'|'weak';rationale:string;qualityDecision:string;qualityConfidence:string;}
export interface KnowledgeNodeDetail{
 identity:{nodeId:string;knowledgeName:string;achievementName:string;englishName:string};
 overview:string;definition:string;coreConcepts:string[];formulas:DetailFormula[];properties:string[];intuition:string;derivation:string;skills:string[];examples:DetailExample[];gaokaoPatterns:string[];commonMistakes:{mistake:string;why:string;correction:string}[];relationships:{incoming:DetailRelationship[];outgoing:DetailRelationship[]};textbookReferences:DetailTextbookReference[];searchTerms:string[];
 metadata:{importance:1|2|3|4|5;difficulty:1|2|3|4|5;contentStatus:'CANDIDATE';evidenceStatus:'DIRECT'|'PARTIAL_CONTEXTUAL'|'MIXED'|'REVIEW_REQUIRED';gateStatus:DetailGateStatus;confidence:DetailConfidence;};
}
