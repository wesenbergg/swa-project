-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    fixed_location VARCHAR(255),
    fixed_event_type VARCHAR(255),
    category VARCHAR(255),
    organizer VARCHAR(255),
    organizer_url TEXT,
    responsible VARCHAR(255),
    show_responsible BOOLEAN DEFAULT false,
    paid BOOLEAN DEFAULT false,
    price VARCHAR(50),
    map TEXT,
    alcohol_meter INTEGER DEFAULT 0,
    can_participate BOOLEAN DEFAULT true,
    membership_required BOOLEAN DEFAULT false,
    avec BOOLEAN DEFAULT false,
    max_participants INTEGER,
    registration_starts TIMESTAMP,
    registration_ends TIMESTAMP,
    cancellation_starts TIMESTAMP,
    cancellation_ends TIMESTAMP,
    template BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX idx_events_date ON events(date);
