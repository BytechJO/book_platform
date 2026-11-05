BEGIN;

CREATE TABLE IF NOT EXISTS class_resources (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL
        CHECK (resource_type IN ('file', 'worksheet', 'video', 'link')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_url VARCHAR(1000) NOT NULL,
    file_public_id VARCHAR(255),
    original_file_name VARCHAR(500),
    mime_type VARCHAR(150),
    file_size BIGINT CHECK (file_size IS NULL OR file_size >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS class_resources_class_id_idx ON class_resources(class_id);
CREATE INDEX IF NOT EXISTS class_resources_teacher_id_idx ON class_resources(teacher_id);
CREATE INDEX IF NOT EXISTS class_resources_type_idx ON class_resources(resource_type);
CREATE INDEX IF NOT EXISTS class_resources_created_at_idx
    ON class_resources(created_at DESC);

DROP TRIGGER IF EXISTS class_resources_set_updated_at ON class_resources;
CREATE TRIGGER class_resources_set_updated_at
BEFORE UPDATE ON class_resources
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
