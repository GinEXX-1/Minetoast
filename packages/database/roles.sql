-- Run once as a cluster administrator in a dedicated application database.
-- Roles have no login/password by default. Provision deployment credentials out of band.
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='migration_owner') THEN CREATE ROLE migration_owner NOLOGIN; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='learning_api') THEN CREATE ROLE learning_api NOLOGIN; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='content_admin') THEN CREATE ROLE content_admin NOLOGIN; END IF;
END $$;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE,CREATE ON SCHEMA public TO migration_owner;
-- Transfer only this project's explicit objects, never unrelated tables.
DO $$ DECLARE object_name text; BEGIN
 FOREACH object_name IN ARRAY ARRAY['users','sessions','assets','math_domains','math_modules','knowledge_nodes','knowledge_edges','graph_releases','graph_head','user_progress_state','user_unlocked_nodes','progress_commands','achievement_events','map_regions','map_landmarks','node_layouts','admin_audit_events','schema_migrations'] LOOP
  EXECUTE format('ALTER TABLE %I OWNER TO migration_owner', object_name);
 END LOOP;
END $$;
ALTER TYPE review_status OWNER TO migration_owner;
ALTER TYPE unlock_source OWNER TO migration_owner;
ALTER FUNCTION touch_updated_at() OWNER TO migration_owner;
ALTER FUNCTION deny_release_mutation() OWNER TO migration_owner;
GRANT USAGE ON SCHEMA public TO learning_api,content_admin;
GRANT SELECT ON graph_releases,graph_head,knowledge_nodes TO learning_api;
-- SELECT FOR SHARE requires UPDATE privilege on at least one column. Column grant
-- cannot move the head; singleton is constrained to true and is not the release ID.
GRANT UPDATE(singleton) ON graph_head TO learning_api;
GRANT SELECT ON users TO learning_api;
GRANT INSERT(id,username,password_hash) ON users TO learning_api;
GRANT UPDATE(last_login_at) ON users TO learning_api;
GRANT SELECT,INSERT,UPDATE ON sessions,user_progress_state,user_unlocked_nodes,progress_commands,achievement_events TO learning_api;
GRANT DELETE ON user_unlocked_nodes TO learning_api;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO content_admin;
GRANT INSERT,UPDATE ON knowledge_nodes,knowledge_edges,math_domains,math_modules,assets,map_regions,map_landmarks,node_layouts TO content_admin;
GRANT INSERT ON graph_releases,admin_audit_events TO content_admin;
GRANT UPDATE ON graph_head TO content_admin;
-- No runtime role has DDL, role changes, release mutation or audit deletion grants.
