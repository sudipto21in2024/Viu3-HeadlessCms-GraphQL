import db from '../db/database.js';
import crypto from 'node:crypto';

// Format lookbook item with parsed JSON hotspots
function formatLook(row) {
  if (!row) return null;
  let hotspots = [];
  try {
    hotspots = row.hotspots_json ? JSON.parse(row.hotspots_json) : [];
  } catch (err) {
    hotspots = [];
  }
  return {
    ...row,
    is_exclusive: Boolean(row.is_exclusive),
    hotspots
  };
}

export const resolvers = {
  Query: {
    cmsPage: (_, { slug }) => {
      const page = db.prepare('SELECT * FROM cms_pages WHERE slug = ?').get(slug);
      if (!page) return null;
      return page;
    },

    collections: (_, { featuredOnly }) => {
      let query = 'SELECT * FROM collections';
      if (featuredOnly) {
        query += ' WHERE is_featured = 1';
      }
      query += ' ORDER BY published_at DESC';
      const rows = db.prepare(query).all();
      return rows.map(r => ({
        ...r,
        is_featured: Boolean(r.is_featured)
      }));
    },

    collectionBySlug: (_, { slug }) => {
      const row = db.prepare('SELECT * FROM collections WHERE slug = ?').get(slug);
      if (!row) return null;
      return {
        ...row,
        is_featured: Boolean(row.is_featured)
      };
    },

    lookbookItems: (_, { collectionSlug, category, limit }) => {
      let query = 'SELECT l.* FROM lookbook_items l';
      const params = [];

      if (collectionSlug) {
        query += ' JOIN collections c ON l.collection_id = c.id WHERE c.slug = ?';
        params.push(collectionSlug);
      }

      if (category) {
        query += params.length ? ' AND l.category = ?' : ' WHERE l.category = ?';
        params.push(category);
      }

      query += ' ORDER BY l.id ASC';

      if (limit && Number.isInteger(limit)) {
        query += ' LIMIT ?';
        params.push(limit);
      }

      const rows = db.prepare(query).all(...params);
      return rows.map(formatLook);
    },

    lookbookItem: (_, { id }) => {
      const row = db.prepare('SELECT * FROM lookbook_items WHERE id = ?').get(id);
      return formatLook(row);
    },

    artisans: () => {
      return db.prepare('SELECT * FROM artisans ORDER BY years_of_mastery DESC').all();
    },

    artisan: (_, { id }) => {
      return db.prepare('SELECT * FROM artisans WHERE id = ?').get(id);
    },

    searchAll: (_, { query }) => {
      if (!query || query.trim().length === 0) return [];
      const term = `%${query.trim()}%`;
      const rows = db.prepare(`
        SELECT DISTINCT l.* FROM lookbook_items l
        LEFT JOIN collections c ON l.collection_id = c.id
        LEFT JOIN artisans a ON l.artisan_id = a.id
        WHERE l.title LIKE ? OR l.description LIKE ? OR l.material LIKE ? OR l.category LIKE ? OR a.name LIKE ? OR c.title LIKE ?
        ORDER BY l.likes_count DESC
        LIMIT 10
      `).all(term, term, term, term, term, term);
      return rows.map(formatLook);
    }
  },

  CMSPage: {
    blocks: (parent) => {
      return db.prepare('SELECT * FROM cms_blocks WHERE page_id = ? ORDER BY sort_order ASC').all(parent.id);
    }
  },

  Collection: {
    lookbook_items: (parent) => {
      const rows = db.prepare('SELECT * FROM lookbook_items WHERE collection_id = ? ORDER BY id ASC').all(parent.id);
      return rows.map(formatLook);
    }
  },

  Artisan: {
    crafted_pieces: (parent) => {
      const rows = db.prepare('SELECT * FROM lookbook_items WHERE artisan_id = ? ORDER BY id ASC').all(parent.id);
      return rows.map(formatLook);
    }
  },

  LookbookItem: {
    collection: (parent) => {
      return db.prepare('SELECT * FROM collections WHERE id = ?').get(parent.collection_id);
    },
    artisan: (parent) => {
      if (!parent.artisan_id) return null;
      return db.prepare('SELECT * FROM artisans WHERE id = ?').get(parent.artisan_id);
    }
  },

  Mutation: {
    requestPrivateViewing: (_, { input }) => {
      const { client_name, client_email, client_phone, preferred_salon, preferred_date, interest_category, special_requests } = input;

      // Input validation
      if (!client_name || !client_email || !preferred_salon || !preferred_date) {
        throw new Error('Please fill in all mandatory booking fields.');
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(client_email)) {
        throw new Error('Please enter a valid email address.');
      }

      const id = `vip-${crypto.randomUUID().slice(0, 8)}`;
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO vip_bookings (id, client_name, client_email, client_phone, preferred_salon, preferred_date, interest_category, special_requests, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
      `).run(id, client_name, client_email, client_phone || '', preferred_salon, preferred_date, interest_category, special_requests || '', createdAt);

      return {
        id,
        status: 'CONFIRMED',
        message: `Your private appointment at ${preferred_salon} has been registered. Our salon concierge will reach out to you shortly.`,
        client_name,
        preferred_salon,
        preferred_date
      };
    },

    toggleLookWishlist: (_, { lookId, sessionId }) => {
      if (!lookId || !sessionId) {
        throw new Error('Missing lookId or sessionId');
      }

      const existing = db.prepare('SELECT id FROM wishlists WHERE look_id = ? AND client_session_id = ?').get(lookId, sessionId);

      let isSaved = false;
      if (existing) {
        // Remove from wishlist
        db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
        db.prepare('UPDATE lookbook_items SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(lookId);
        isSaved = false;
      } else {
        // Add to wishlist
        const id = `wish-${crypto.randomUUID().slice(0, 8)}`;
        db.prepare('INSERT INTO wishlists (id, look_id, client_session_id, created_at) VALUES (?, ?, ?, ?)').run(id, lookId, sessionId, new Date().toISOString());
        db.prepare('UPDATE lookbook_items SET likes_count = likes_count + 1 WHERE id = ?').run(lookId);
        isSaved = true;
      }

      const updated = db.prepare('SELECT likes_count FROM lookbook_items WHERE id = ?').get(lookId);

      return {
        look_id: lookId,
        is_saved: isSaved,
        total_likes: updated ? updated.likes_count : 0
      };
    },

    subscribeEditorial: (_, { email }) => {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address');
      }
      return true;
    }
  }
};
