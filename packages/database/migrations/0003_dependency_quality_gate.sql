BEGIN;

-- These text fields intentionally avoid a database enum migration so the policy
-- remains forward-compatible while application schemas enforce the vocabulary.
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS canonical_textbook_evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(canonical_textbook_evidence)='array');
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS canonical_evidence_conflict boolean NOT NULL DEFAULT false;
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS mathematical_definition text NOT NULL DEFAULT '';
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS definition_ambiguous boolean NOT NULL DEFAULT false;
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS prerequisite_counterfactual text NOT NULL DEFAULT '';
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS graph_context text NOT NULL DEFAULT '';
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_rationale text NOT NULL DEFAULT '';
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_decision text NOT NULL DEFAULT 'REVIEW_REQUIRED' CHECK(quality_decision IN ('KEEP_STRONG','DOWNGRADE_TO_WEAK','REMOVE','REVIEW_REQUIRED'));
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_confidence text NOT NULL DEFAULT 'LOW' CHECK(quality_confidence IN ('HIGH','MEDIUM','LOW'));
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_state text NOT NULL DEFAULT 'REVIEW_REQUIRED' CHECK(quality_state IN ('AUTO_PASSED','PENDING_SECOND_AI_REVIEW','AI_REVIEW_2_PASSED','HUMAN_OVERRIDE','REVIEW_REQUIRED'));
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS ai_reviews jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(ai_reviews)='array');
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_override_by uuid REFERENCES users(id);
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_override_at timestamptz;
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS quality_updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS knowledge_edges_quality_state ON knowledge_edges(quality_state,quality_decision) WHERE enabled;
INSERT INTO schema_migrations(version) VALUES(3) ON CONFLICT DO NOTHING;

COMMIT;
