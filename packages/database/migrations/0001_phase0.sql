-- PostgreSQL 18 baseline. Execute on a fresh database with ON_ERROR_STOP.
-- Phase 0 structure only; API authorization and graph publication gates are specified in docs.
BEGIN;
CREATE TYPE review_status AS ENUM ('DRAFT','REVIEW_REQUIRED','APPROVED','REJECTED');
CREATE TYPE unlock_source AS ENUM ('manual','initialization_target','initialization_ancestor','import');
CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 username text NOT NULL CHECK (username ~ '^[A-Za-z0-9_]{3,32}$'),
 password_hash text NOT NULL CHECK (length(password_hash)>20),
 role text NOT NULL DEFAULT 'student' CHECK(role IN ('student','admin')),
 created_at timestamptz NOT NULL DEFAULT now(), last_login_at timestamptz,
 disabled_at timestamptz
);
CREATE UNIQUE INDEX users_username_ci ON users(lower(username));
CREATE TABLE sessions (
 token_hash text PRIMARY KEY CHECK(token_hash ~ '^[a-f0-9]{64}$'),
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 csrf_token_hash text NOT NULL CHECK(csrf_token_hash ~ '^[a-f0-9]{64}$'),
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL,
 revoked_at timestamptz, CHECK(expires_at>created_at)
);
CREATE INDEX sessions_user ON sessions(user_id);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE assets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind text NOT NULL CHECK(kind IN ('icon','sprite_sheet','background','map','sound','font')),
 object_key text NOT NULL UNIQUE, sha256 text NOT NULL CHECK(sha256 ~ '^[a-f0-9]{64}$'),
 mime_type text NOT NULL, byte_size bigint NOT NULL CHECK(byte_size>=0),
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 width integer CHECK(width>0), height integer CHECK(height>0),
 parent_asset_id uuid REFERENCES assets(id), crop jsonb,
 provenance jsonb NOT NULL CHECK(jsonb_typeof(provenance)='object'),
 license text NOT NULL CHECK(length(trim(license))>0),
 review_status review_status NOT NULL DEFAULT 'DRAFT', alt_text text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(parent_asset_id IS DISTINCT FROM id),
 CHECK(crop IS NULL OR (parent_asset_id IS NOT NULL AND jsonb_typeof(crop)='object'))
);
CREATE TABLE math_domains (
 id text PRIMARY KEY, name_zh text NOT NULL, name_en text NOT NULL,
 achievement_theme_name text, description text NOT NULL DEFAULT '',
 icon_asset_id uuid REFERENCES assets(id), background_asset_id uuid REFERENCES assets(id),
 display_order integer NOT NULL DEFAULT 0
);
CREATE TABLE math_modules (
 id text PRIMARY KEY, domain_id text NOT NULL REFERENCES math_domains(id),
 name_zh text NOT NULL, name_en text, description text NOT NULL DEFAULT '',
 UNIQUE(id,domain_id)
);
CREATE TABLE knowledge_nodes (
 id text PRIMARY KEY CHECK(id ~ '^(HS|MS)-[A-Z0-9]+-[A-Z0-9]+-[0-9]{3}$'),
 name_zh text NOT NULL CHECK(length(trim(name_zh))>0), achievement_name text NOT NULL,
 name_en text, description_short text NOT NULL DEFAULT '', content_detailed text NOT NULL DEFAULT '',
 domain_id text NOT NULL REFERENCES math_domains(id), module_id text NOT NULL,
 stage text NOT NULL CHECK(stage IN ('middle_school','high_school')),
 tags text[] NOT NULL DEFAULT '{}',
 node_type text NOT NULL DEFAULT 'normal' CHECK(node_type IN ('normal','core','key_achievement')),
 difficulty smallint NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
 gaokao_importance smallint NOT NULL CHECK(gaokao_importance BETWEEN 1 AND 5),
 textbook_references jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(textbook_references)='array'),
 formulas jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(formulas)='array'),
 skills_required text[] NOT NULL DEFAULT '{}', common_question_types text[] NOT NULL DEFAULT '{}',
 common_mistakes text[] NOT NULL DEFAULT '{}', name_pinyin text NOT NULL DEFAULT '',
 pinyin_initials text NOT NULL DEFAULT '', aliases text[] NOT NULL DEFAULT '{}',
 student_aliases text[] NOT NULL DEFAULT '{}', math_notation_aliases text[] NOT NULL DEFAULT '{}',
 icon_asset_id uuid REFERENCES assets(id), background_theme text,
 is_root boolean NOT NULL DEFAULT false, root_rationale text,
 max_strong_prerequisites smallint NOT NULL DEFAULT 3 CHECK(max_strong_prerequisites IN (3,5)),
 prerequisite_exception_rationale text, key_achievement_rationale text,
 review_status review_status NOT NULL DEFAULT 'DRAFT', reviewed_by uuid REFERENCES users(id),
 reviewed_at timestamptz, retired boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(module_id,domain_id) REFERENCES math_modules(id,domain_id),
 CHECK((stage='high_school' AND left(id,3)='HS-') OR (stage='middle_school' AND left(id,3)='MS-')),
 CHECK(stage<>'middle_school' OR tags @> ARRAY['初中']::text[]),
 CHECK(NOT is_root OR length(trim(coalesce(root_rationale,'')))>0),
 CHECK(max_strong_prerequisites=3 OR length(trim(coalesce(prerequisite_exception_rationale,'')))>0),
 CHECK(node_type<>'key_achievement' OR length(trim(coalesce(key_achievement_rationale,'')))>0),
 CHECK(review_status<>'APPROVED' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX knowledge_nodes_domain ON knowledge_nodes(domain_id,module_id);
CREATE INDEX knowledge_nodes_name ON knowledge_nodes(name_zh);
CREATE TABLE knowledge_edges (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 source_node_id text NOT NULL REFERENCES knowledge_nodes(id),
 target_node_id text NOT NULL REFERENCES knowledge_nodes(id),
 dependency_type text NOT NULL CHECK(dependency_type IN ('strong','weak')),
 rationale text NOT NULL CHECK(length(trim(rationale))>0), enabled boolean NOT NULL DEFAULT true,
 review_status review_status NOT NULL DEFAULT 'REVIEW_REQUIRED',
 reviewed_by uuid REFERENCES users(id), reviewed_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(source_node_id<>target_node_id), UNIQUE(source_node_id,target_node_id),
 CHECK(review_status<>'APPROVED' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX knowledge_edges_incoming ON knowledge_edges(target_node_id,dependency_type) WHERE enabled;
-- unique(source,target) already provides outgoing traversal index.
CREATE TABLE graph_releases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), schema_version integer NOT NULL DEFAULT 1 CHECK(schema_version=1),
 content_hash text NOT NULL CHECK(content_hash ~ '^[a-f0-9]{64}$'),
 snapshot jsonb NOT NULL CHECK(jsonb_typeof(snapshot)='object'),
 validation_report jsonb NOT NULL CHECK(jsonb_typeof(validation_report)='object'),
 published_by uuid NOT NULL REFERENCES users(id), published_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE graph_head (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 release_id uuid NOT NULL REFERENCES graph_releases(id)
);
CREATE TABLE user_progress_state (
 user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 revision bigint NOT NULL DEFAULT 0 CHECK(revision>=0),
 initialization_completed_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE user_unlocked_nodes (
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 node_id text NOT NULL REFERENCES knowledge_nodes(id),
 source unlock_source NOT NULL,
 unlocked_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 release_id uuid NOT NULL REFERENCES graph_releases(id),
 PRIMARY KEY(user_id,node_id)
);
CREATE INDEX user_unlocked_nodes_node ON user_unlocked_nodes(node_id);
CREATE TABLE progress_commands (
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 idempotency_key uuid NOT NULL, request_hash text NOT NULL CHECK(request_hash ~ '^[a-f0-9]{64}$'),
 release_id uuid NOT NULL REFERENCES graph_releases(id),
 result jsonb NOT NULL CHECK(jsonb_typeof(result)='object'),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,idempotency_key)
);
CREATE TABLE achievement_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 node_id text REFERENCES knowledge_nodes(id), idempotency_key uuid NOT NULL,
 event_type text NOT NULL CHECK(event_type IN ('unlock','revoke','initialization_target','initialization_ancestor','import','initialization_complete')),
 release_id uuid NOT NULL REFERENCES graph_releases(id),
 occurred_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(user_id,idempotency_key) REFERENCES progress_commands(user_id,idempotency_key) DEFERRABLE INITIALLY DEFERRED,
 CHECK((event_type='initialization_complete' AND node_id IS NULL) OR (event_type<>'initialization_complete' AND node_id IS NOT NULL))
);
CREATE INDEX achievement_events_user_time ON achievement_events(user_id,occurred_at DESC);
CREATE TABLE map_regions (
 id text PRIMARY KEY, domain_id text NOT NULL REFERENCES math_domains(id),
 module_id text, parent_region_id text REFERENCES map_regions(id),
 name_zh text NOT NULL, description text NOT NULL DEFAULT '',
 level smallint NOT NULL CHECK(level IN (1,2)),
 background_asset_id uuid REFERENCES assets(id),
 geometry jsonb NOT NULL CHECK(jsonb_typeof(geometry)='object'),
 FOREIGN KEY(module_id,domain_id) REFERENCES math_modules(id,domain_id),
 CHECK(parent_region_id IS DISTINCT FROM id),
 CHECK((level=1 AND parent_region_id IS NULL AND module_id IS NULL) OR (level=2 AND parent_region_id IS NOT NULL AND module_id IS NOT NULL)),
 UNIQUE(id,domain_id)
);
CREATE UNIQUE INDEX one_domain_region ON map_regions(domain_id) WHERE level=1;
CREATE TABLE map_landmarks (
 id text PRIMARY KEY, region_id text NOT NULL REFERENCES map_regions(id),
 node_id text NOT NULL UNIQUE REFERENCES knowledge_nodes(id),
 x double precision NOT NULL CHECK(x BETWEEN 0 AND 1),
 y double precision NOT NULL CHECK(y BETWEEN 0 AND 1), icon_asset_id uuid REFERENCES assets(id)
);
CREATE TABLE node_layouts (
 node_id text NOT NULL REFERENCES knowledge_nodes(id), domain_id text NOT NULL REFERENCES math_domains(id),
 layout_version text NOT NULL, x double precision NOT NULL, y double precision NOT NULL,
 source text NOT NULL CHECK(source IN ('auto','manual')),
 updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(node_id,domain_id,layout_version),
 CHECK(x>'-Infinity'::float8 AND x<'Infinity'::float8), CHECK(y>'-Infinity'::float8 AND y<'Infinity'::float8)
);
CREATE TABLE admin_audit_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid NOT NULL REFERENCES users(id),
 action text NOT NULL, entity_type text NOT NULL, entity_id text NOT NULL,
 before_value jsonb, after_value jsonb, occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER nodes_updated BEFORE UPDATE ON knowledge_nodes FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER edges_updated BEFORE UPDATE ON knowledge_edges FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER progress_updated BEFORE UPDATE ON user_progress_state FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER unlocked_updated BEFORE UPDATE ON user_unlocked_nodes FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER layouts_updated BEFORE UPDATE ON node_layouts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE FUNCTION deny_release_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Published graph releases are immutable'; END $$;
CREATE TRIGGER releases_immutable BEFORE UPDATE OR DELETE ON graph_releases FOR EACH ROW EXECUTE FUNCTION deny_release_mutation();
COMMENT ON TABLE knowledge_nodes IS 'Authoring rows and stable identities. Public reads MUST use graph_head release snapshot.';
COMMENT ON TABLE user_unlocked_nodes IS 'Row exists iff self-reported mastered. Revoke deletes only this row; successors retained.';
COMMENT ON TABLE graph_releases IS 'Validated immutable snapshot of nodes, edges, domain/module, layout, maps and asset references.';
COMMIT;
