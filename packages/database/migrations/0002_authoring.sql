BEGIN;
CREATE TABLE IF NOT EXISTS schema_migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE knowledge_nodes ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE knowledge_edges ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
INSERT INTO schema_migrations(version) VALUES(2) ON CONFLICT DO NOTHING;
COMMIT;
