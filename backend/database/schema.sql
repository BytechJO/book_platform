-- Book Platform database schema
-- PostgreSQL
--
-- This file is the canonical schema for creating a new, empty database.
-- It is not a migration for an existing production database.

BEGIN;

-- =========================================================
-- Users
-- =========================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('student', 'teacher', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    avatar_url VARCHAR(500),
    avatar_public_id VARCHAR(255),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- Categories
-- =========================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX categories_name_unique_ci
    ON categories (LOWER(name));

-- =========================================================
-- Books
-- =========================================================

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    app_store_url VARCHAR(500),
    google_play_url VARCHAR(500),
    online_book_url VARCHAR(500),
    youtube_url VARCHAR(500),
    cover_image_url_short VARCHAR(500),
    cover_image_url_long VARCHAR(500),
    cover_image_short_public_id VARCHAR(255),
    cover_image_long_public_id VARCHAR(255),
    isbn VARCHAR(50) UNIQUE,
    language VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'Draft'
        CHECK (status IN ('Draft', 'Published')),
    views INTEGER NOT NULL DEFAULT 0
        CHECK (views >= 0),
    category_id INTEGER
        REFERENCES categories(id) ON DELETE SET NULL,
    created_by INTEGER
        REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX books_title_unique_ci
    ON books (LOWER(title));

CREATE INDEX books_category_id_idx ON books(category_id);
CREATE INDEX books_created_by_idx ON books(created_by);
CREATE INDEX books_status_created_at_idx ON books(status, created_at DESC);
CREATE INDEX books_views_idx ON books(views DESC);

-- =========================================================
-- Book activation codes
-- =========================================================

CREATE TABLE book_codes (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    allowed_role VARCHAR(20)
        CHECK (allowed_role IN ('student', 'teacher')),
    validity_months INTEGER NOT NULL DEFAULT 12
        CHECK (validity_months > 0),
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_by INTEGER
        REFERENCES users(id) ON DELETE SET NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX book_codes_book_id_idx ON book_codes(book_id);
CREATE INDEX book_codes_used_by_idx ON book_codes(used_by);
CREATE INDEX book_codes_created_at_idx ON book_codes(created_at DESC);

-- =========================================================
-- Classes
-- Each class belongs to one teacher and one book.
-- =========================================================

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (book_id, class_name)
);

CREATE INDEX classes_teacher_id_idx ON classes(teacher_id);
CREATE INDEX classes_book_id_idx ON classes(book_id);
CREATE INDEX classes_teacher_book_idx ON classes(teacher_id, book_id);

-- =========================================================
-- User books
-- Tracks activation, expiry, last opening, and the student's class.
-- =========================================================

CREATE TABLE user_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    code_id INTEGER
        REFERENCES book_codes(id) ON DELETE SET NULL,
    class_id INTEGER
        REFERENCES classes(id) ON DELETE SET NULL,
    activated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_opened_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, book_id),
    CHECK (expires_at > activated_at)
);

CREATE INDEX user_books_user_id_idx ON user_books(user_id);
CREATE INDEX user_books_book_id_idx ON user_books(book_id);
CREATE INDEX user_books_code_id_idx ON user_books(code_id);
CREATE INDEX user_books_class_id_idx ON user_books(class_id);
CREATE INDEX user_books_expires_at_idx ON user_books(expires_at);

-- =========================================================
-- Class students
-- =========================================================

CREATE TABLE class_students (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL
        REFERENCES classes(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id, student_id)
);

CREATE INDEX class_students_student_id_idx ON class_students(student_id);
CREATE INDEX class_students_joined_at_idx ON class_students(joined_at);

-- =========================================================
-- Additional learning resources shared with a class
-- =========================================================

CREATE TABLE class_resources (
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

CREATE INDEX class_resources_class_id_idx ON class_resources(class_id);
CREATE INDEX class_resources_teacher_id_idx ON class_resources(teacher_id);
CREATE INDEX class_resources_type_idx ON class_resources(resource_type);
CREATE INDEX class_resources_created_at_idx ON class_resources(created_at DESC);

-- =========================================================
-- Class events
-- =========================================================

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL DEFAULT 'event'
        CHECK (type IN ('event', 'note')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    title VARCHAR(255) NOT NULL,
    subject TEXT,
    date DATE,
    time TIME,
    teacher_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL
        REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (type = 'event' AND date IS NOT NULL AND time IS NOT NULL)
        OR (type = 'note' AND date IS NULL AND time IS NULL)
    )
);

CREATE INDEX events_teacher_id_idx ON events(teacher_id);
CREATE INDEX events_class_id_idx ON events(class_id);
CREATE INDEX events_book_id_idx ON events(book_id);
CREATE INDEX events_date_time_idx ON events(date, time);
CREATE INDEX events_type_class_idx ON events(type, class_id);
CREATE INDEX events_class_pinned_idx ON events(class_id, is_pinned DESC);

-- =========================================================
-- Activities and notifications
-- Target IDs intentionally do not use foreign keys so audit history can
-- remain available after the related user, book, class, or event is removed.
-- =========================================================

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    actor_id INTEGER,
    actor_role VARCHAR(20)
        CHECK (actor_role IN ('student', 'teacher', 'admin')),
    receiver_id INTEGER,
    book_id INTEGER,
    class_id INTEGER,
    event_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX activities_actor_idx ON activities(actor_id, actor_role);
CREATE INDEX activities_receiver_id_idx ON activities(receiver_id);
CREATE INDEX activities_book_id_idx ON activities(book_id);
CREATE INDEX activities_class_id_idx ON activities(class_id);
CREATE INDEX activities_event_id_idx ON activities(event_id);

CREATE TABLE activity_reads (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (activity_id, user_id)
);

CREATE INDEX activity_reads_user_id_idx ON activity_reads(user_id);

-- =========================================================
-- Automatically maintain updated_at columns.
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER books_set_updated_at
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER classes_set_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER user_books_set_updated_at
BEFORE UPDATE ON user_books
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER events_set_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER class_resources_set_updated_at
BEFORE UPDATE ON class_resources
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
