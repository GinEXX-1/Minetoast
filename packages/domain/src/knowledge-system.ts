import type {Rating,ReviewStatus} from './index';
import type {CanonicalTextbookEvidence} from './dependency-quality';

export type CurriculumVolume='B1'|'B2'|'X1'|'X2'|'X3';
export interface CurriculumSource {
 volume:CurriculumVolume;sourceRef:string;printedPage:number;pdfPage:number;
 evidence:CanonicalTextbookEvidence;scopeNote:string;
}
/** Authoring contract shared by independent high-school mathematics systems. */
export interface CurriculumConcept {
 id:string;canonicalName:string;achievementName:string;domainId:string;moduleId:string;
 summary:string;importance:Rating;difficulty:Rating;aliases:readonly string[];
 mathNotationAliases:readonly string[];sources:readonly CurriculumSource[];
 isKeyAchievement:boolean;keyAchievementRationale:string|null;reviewStatus:ReviewStatus;
}
export interface CurriculumSystem {
 id:string;nameZh:string;nameEn:string;description:string;
 modules:readonly {id:string;nameZh:string}[];
 concepts:readonly CurriculumConcept[];
}
