import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export default sql;

export async function initDB() {
  await sql`CREATE TABLE IF NOT EXISTS devotions (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, scripture VARCHAR(500),
    content TEXT NOT NULL, author VARCHAR(255) DEFAULT 'Heaven''s Hospitality Ministries',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS sermons (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, speaker VARCHAR(255) NOT NULL,
    description TEXT, content TEXT, video_url VARCHAR(500), audio_url VARCHAR(500),
    thumbnail_url VARCHAR(500), series VARCHAR(255), scripture VARCHAR(500), duration VARCHAR(50),
    is_published BOOLEAN DEFAULT true, published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), is_active BOOLEAN DEFAULT true
  )`;
  await sql`CREATE TABLE IF NOT EXISTS prayer_requests (
    id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255),
    request TEXT NOT NULL, is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL, end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(500), is_online BOOLEAN DEFAULT false, meeting_link VARCHAR(500),
    image_url VARCHAR(500), is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS trainings (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT,
    trainer VARCHAR(255) DEFAULT 'Evangelist Bob Pepple',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    zoom_link VARCHAR(500), zoom_password VARCHAR(100),
    is_published BOOLEAN DEFAULT true, max_attendees INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS training_registrations (
    id SERIAL PRIMARY KEY, training_id INT REFERENCES trainings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, email VARCHAR(255), phone VARCHAR(50),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL,
    country VARCHAR(100), description TEXT, image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active', started_at DATE,
    sort_order INT DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS accomplishments (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT,
    stat_number VARCHAR(100), stat_label VARCHAR(100),
    icon VARCHAR(10) DEFAULT '✅', image_url VARCHAR(500),
    sort_order INT DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS miracles (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, story TEXT NOT NULL,
    person_name VARCHAR(255), location VARCHAR(255), image_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT false, is_featured BOOLEAN DEFAULT false,
    submitted_by_visitor BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS offerings (
    id SERIAL PRIMARY KEY, donor_name VARCHAR(255), donor_email VARCHAR(255),
    amount NUMERIC(12,2) NOT NULL, currency VARCHAR(10) DEFAULT 'NGN',
    reference VARCHAR(255) UNIQUE NOT NULL, paystack_ref VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', channel VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY, token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL, expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`;
}
