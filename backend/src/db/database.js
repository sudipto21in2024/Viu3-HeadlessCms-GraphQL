import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'maison_aura.db');
export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance & reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      slug TEXT UNIQUE NOT NULL,
      season TEXT NOT NULL,
      year INTEGER NOT NULL,
      description TEXT,
      hero_image TEXT NOT NULL,
      theme_color TEXT DEFAULT '#C5A880',
      is_featured INTEGER DEFAULT 0,
      published_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artisans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      studio_location TEXT NOT NULL,
      biography TEXT NOT NULL,
      portrait_image TEXT NOT NULL,
      specialty TEXT NOT NULL,
      quote TEXT,
      years_of_mastery INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lookbook_items (
      id TEXT PRIMARY KEY,
      collection_id TEXT NOT NULL,
      artisan_id TEXT,
      title TEXT NOT NULL,
      look_number TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      secondary_image_url TEXT,
      material TEXT NOT NULL,
      origin TEXT NOT NULL,
      price_display TEXT NOT NULL,
      hotspots_json TEXT DEFAULT '[]',
      is_exclusive INTEGER DEFAULT 0,
      likes_count INTEGER DEFAULT 0,
      FOREIGN KEY(collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY(artisan_id) REFERENCES artisans(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS cms_pages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      meta_description TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_blocks (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      block_type TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      title TEXT,
      subtitle TEXT,
      body_content TEXT,
      media_url TEXT,
      config_json TEXT DEFAULT '{}',
      FOREIGN KEY(page_id) REFERENCES cms_pages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vip_bookings (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT,
      preferred_salon TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      interest_category TEXT NOT NULL,
      special_requests TEXT,
      status TEXT DEFAULT 'CONFIRMED',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      look_id TEXT NOT NULL,
      client_session_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(look_id, client_session_id),
      FOREIGN KEY(look_id) REFERENCES lookbook_items(id) ON DELETE CASCADE
    );
  `);
}

export default db;
