import type {Rating, ReviewStatus} from './index';

/** Authoring-only ontology contract. It cannot be mistaken for a publishable GraphSnapshot. */
export interface FunctionOntologyNode {
  id: string;
  canonicalName: string;
  achievementName: string;
  domain: 'functions';
  module: string;
  gradeTag: 'middle_school_review' | 'high_school_required_1';
  summary: string;
  importance: Rating;
  difficulty: Rating;
  aliases: readonly string[];
  englishName: string;
  pinyin: string;
  pinyinInitials: string;
  mathAliases: readonly string[];
  /** In Phase 2A this marks a candidate, not a confirmed graph gateway. */
  isKeyAchievement: boolean;
  keyAchievementStatus: 'CANDIDATE' | 'NOT_CANDIDATE';
  keyAchievementRationale: string | null;
  isPrerequisite: boolean;
  prerequisiteScope: string | null;
  textbookReferences: readonly {
    volume: 'B1';
    chapter: string;
    section: string | null;
    subsection: string;
    printedPage: number;
    pdfPage: number;
    sourceRef: string;
    evidenceStatus: 'DIRECT' | 'PARTIAL_CONTEXTUAL';
    scopeNote: string;
  }[];
  contentStatus: 'ONTOLOGY_ONLY';
  reviewStatus: ReviewStatus;
  scopeNote: string;
}

