Create database schema for Publisher Platform

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    app_store_url VARCHAR(500),
    google_play_url VARCHAR(500),
    online_book_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activation codes table
CREATE TABLE book_codes (
    id SERIAL PRIMARY KEY,

    book_id INTEGER NOT NULL 
        REFERENCES books(id) ON DELETE CASCADE,

    code VARCHAR(50) UNIQUE NOT NULL,

    allowed_role VARCHAR(20) 
        CHECK (allowed_role IN ('student','teacher')),

    validity_months INTEGER NOT NULL , 

    is_used BOOLEAN DEFAULT FALSE,

    used_by INTEGER 
        REFERENCES users(id) ON DELETE SET NULL,

    used_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-book relations (tracks activated books)
CREATE TABLE user_books (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,

    code_id INTEGER
        REFERENCES book_codes(id) ON DELETE SET NULL,

    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, book_id)
);
