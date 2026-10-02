BEGIN;
-- Curriculum IDs also exist outside the legacy database snapshot. They are validated
-- against the selected curriculum at publication, without changing knowledge_nodes.
CREATE TABLE IF NOT EXISTS ponder_demos (
 id text PRIMARY KEY, node_id text NOT NULL, type text NOT NULL CHECK(type IN ('PRINCIPLE','DERIVATION','INTERACTIVE_EXPERIMENT','APPLICATION')),
 title text NOT NULL, status text NOT NULL DEFAULT 'CANDIDATE' CHECK(status IN ('CANDIDATE','PASS','REVIEW_REQUIRED','FAIL')),
 is_primary boolean NOT NULL DEFAULT true, suitability text NOT NULL CHECK(suitability IN ('HIGH','MEDIUM','LOW','NONE')),
 pedagogy_pattern text NOT NULL, renderer_type text NOT NULL CHECK(renderer_type IN ('coordinate','geometry','solid')),
 version integer NOT NULL CHECK(version>0), dsl_version integer NOT NULL CHECK(dsl_version>0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ponder_primary_per_node ON ponder_demos(node_id) WHERE is_primary AND status='PASS';
CREATE TABLE IF NOT EXISTS ponder_scenes (
 id text PRIMARY KEY, demo_id text NOT NULL REFERENCES ponder_demos(id), definition_json jsonb NOT NULL CHECK(jsonb_typeof(definition_json)='object'),
 duration_estimate numeric NOT NULL CHECK(duration_estimate BETWEEN 30 AND 180), supports_scrub boolean NOT NULL DEFAULT false,
 supports_interaction boolean NOT NULL DEFAULT false, supports_3d boolean NOT NULL DEFAULT false, scene_digest text NOT NULL CHECK(length(scene_digest)=64)
);
CREATE TABLE IF NOT EXISTS ponder_reviews (
 id uuid PRIMARY KEY, demo_id text NOT NULL REFERENCES ponder_demos(id), scene_digest text NOT NULL CHECK(length(scene_digest)=64),
 review_type text NOT NULL CHECK(review_type IN ('MATHEMATICAL_CORRECTNESS','PEDAGOGICAL_VALUE','REPRESENTATION_ACCURACY','DSL_VALIDITY','RENDER_VALIDITY','INTERACTION_VALIDITY','PERFORMANCE','ACCESSIBILITY','TEXTBOOK_ALIGNMENT','INDEPENDENT_AI')),
 decision text NOT NULL CHECK(decision IN ('PASS','REVIEW_REQUIRED','FAIL')), confidence text NOT NULL CHECK(confidence IN ('HIGH','MEDIUM','LOW')),
 issues jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(issues)='array'), reviewer text NOT NULL, evidence text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_ponder_progress (
 user_id uuid NOT NULL REFERENCES users(id), node_id text NOT NULL, demo_id text NOT NULL REFERENCES ponder_demos(id), demo_version integer NOT NULL CHECK(demo_version>0),
 started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, last_step integer NOT NULL DEFAULT 0 CHECK(last_step>=0),
 principle_viewed boolean NOT NULL DEFAULT false, interaction_used boolean NOT NULL DEFAULT false, replay_count integer NOT NULL DEFAULT 0 CHECK(replay_count>=0),
 PRIMARY KEY(user_id,demo_id,demo_version), CHECK((completed_at IS NOT NULL)=principle_viewed)
);
-- Intentionally no triggers, writes or references to knowledge unlock/mastery state.
INSERT INTO schema_migrations(version) VALUES(4) ON CONFLICT DO NOTHING;
COMMIT;
