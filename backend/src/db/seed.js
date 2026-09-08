import { db, initDatabase } from './database.js';

export function seedData() {
  console.log('Seeding Maison Aura database...');
  initDatabase();

  // Clear existing records to ensure fresh state
  db.exec(`
    DELETE FROM wishlists;
    DELETE FROM vip_bookings;
    DELETE FROM cms_blocks;
    DELETE FROM cms_pages;
    DELETE FROM lookbook_items;
    DELETE FROM artisans;
    DELETE FROM collections;
  `);

  const insertCollection = db.prepare(`
    INSERT INTO collections (id, title, subtitle, slug, season, year, description, hero_image, theme_color, is_featured, published_at)
    VALUES (@id, @title, @subtitle, @slug, @season, @year, @description, @hero_image, @theme_color, @is_featured, @published_at)
  `);

  const insertArtisan = db.prepare(`
    INSERT INTO artisans (id, name, role, studio_location, biography, portrait_image, specialty, quote, years_of_mastery)
    VALUES (@id, @name, @role, @studio_location, @biography, @portrait_image, @specialty, @quote, @years_of_mastery)
  `);

  const insertLook = db.prepare(`
    INSERT INTO lookbook_items (id, collection_id, artisan_id, title, look_number, category, description, image_url, secondary_image_url, material, origin, price_display, hotspots_json, is_exclusive, likes_count)
    VALUES (@id, @collection_id, @artisan_id, @title, @look_number, @category, @description, @image_url, @secondary_image_url, @material, @origin, @price_display, @hotspots_json, @is_exclusive, @likes_count)
  `);

  const insertPage = db.prepare(`
    INSERT INTO cms_pages (id, title, slug, meta_description, updated_at)
    VALUES (@id, @title, @slug, @meta_description, @updated_at)
  `);

  const insertBlock = db.prepare(`
    INSERT INTO cms_blocks (id, page_id, block_type, sort_order, title, subtitle, body_content, media_url, config_json)
    VALUES (@id, @page_id, @block_type, @sort_order, @title, @subtitle, @body_content, @media_url, @config_json)
  `);

  // 1. Seed Artisans
  const artisans = [
    {
      id: 'artisan-1',
      name: 'Hélène de Courcelles',
      role: 'Directrice de Haute Couture & Drapeuse',
      studio_location: '14 Rue du Faubourg Saint-Honoré, Paris',
      biography: 'Trained under legendary Parisian couturiers, Madame de Courcelles sculpts silhouettes directly onto the dressmaker mannequin, blending Japanese unspun raw silks with double-faced French cashmere.',
      portrait_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      specialty: 'Flou Draping & Architectural Tailoring',
      quote: 'Fabric has memory. Our role is not to impose a shape, but to awaken the sculpture dormant within the weave.',
      years_of_mastery: 26
    },
    {
      id: 'artisan-2',
      name: 'Marcello Vianelli',
      role: 'Maître Horloger & Finisseur',
      studio_location: 'Vallée de Joux & Geneva Atelier',
      biography: 'A third-generation master watchmaker specializing in ultra-thin flying tourbillons and hand-bevelled anglage. Every bridge and pinion is mirror-polished by hand with gentian wood paste.',
      portrait_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      specialty: 'Flying Tourbillon & Côtes de Genève Guilloché',
      quote: 'True luxury ticks in silence. When human hands spend forty hours on a single millimeter of gold, time itself bows.',
      years_of_mastery: 32
    },
    {
      id: 'artisan-3',
      name: 'Kenzo Takahashi',
      role: 'Maître Maroquinier & Tannage Végétal',
      studio_location: 'Higashiyama, Kyoto & Florence Studio',
      biography: 'Bridging ancient Japanese Urushi lacquer techniques with classical Florentine saddle-stitching, Kenzo crafts heirloom leather pieces that mature in patina over decades.',
      portrait_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      specialty: 'Saddle-Stitch Maroquinerie & Urushi Lacquer Patina',
      quote: 'Every fold is a permanent dialogue between organic skin, botanical tannin, and patience.',
      years_of_mastery: 21
    }
  ];

  for (const a of artisans) {
    insertArtisan.run(a);
  }

  // 2. Seed Collections
  const collections = [
    {
      id: 'col-1',
      title: 'L’Éveil Minéral',
      subtitle: 'Automne-Hiver 2026 Haute Couture',
      slug: 'automne-hiver-2026',
      season: 'Automne-Hiver',
      year: 2026,
      description: 'An architectural dialogue between raw geological textures, fluid double-faced cashmere, and moonlit obsidian tones. Crafted in our Parisian salons.',
      hero_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
      theme_color: '#C5A880',
      is_featured: 1,
      published_at: '2026-09-01T00:00:00Z'
    },
    {
      id: 'col-2',
      title: 'Le Méridien Céleste',
      subtitle: 'Haute Horlogerie & Joaillerie',
      slug: 'le-meridien-celeste',
      season: 'Permanent Salon',
      year: 2026,
      description: 'Astronomic complications, flying tourbillons, and rare certified unheated Ceylon sapphires set in ethically mined 18-karat sand gold.',
      hero_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=85',
      theme_color: '#9E855A',
      is_featured: 1,
      published_at: '2026-08-15T00:00:00Z'
    },
    {
      id: 'col-3',
      title: 'Cuir d’Ombre & Sculpture',
      subtitle: 'Heritage Leather & Object d’Art',
      slug: 'cuir-dombre-sculpture',
      season: 'Printemps-Été',
      year: 2026,
      description: 'Hand-burnished vegetable-tanned French calfskin with sculptural brass hardware, forged in limited numbered editions.',
      hero_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=85',
      theme_color: '#B29772',
      is_featured: 0,
      published_at: '2026-07-20T00:00:00Z'
    }
  ];

  for (const c of collections) {
    insertCollection.run(c);
  }

  // 3. Seed Lookbook Items
  const looks = [
    {
      id: 'look-01',
      collection_id: 'col-1',
      artisan_id: 'artisan-1',
      title: 'Manteau Sculptural en Cachemire Double-Face',
      look_number: 'LOOK N°01',
      category: 'Haute Couture Outerwear',
      description: 'Hand-sewn cocoon overcoat tailored from pure Mongolian double-faced cashmere with seamless invisible perimeter stitching and horn button fastenings.',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85',
      material: '100% Mongolian Grade-A Double-Faced Cashmere (680g/m²)',
      origin: 'Atelier de Paris, France',
      price_display: '€ 6,400',
      is_exclusive: 1,
      likes_count: 142,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-1',
          x: 48,
          y: 28,
          title: 'Hand-Rolled Lapel',
          detail: 'Constructed without interfacings for soft, gravity-defying drape over the collarbone.'
        },
        {
          id: 'hp-2',
          x: 52,
          y: 64,
          title: 'Split-Seam Blind Stitching',
          detail: 'Over 34 hours of hand-guided stitchwork joining two layers into a single self-finished edge.'
        }
      ])
    },
    {
      id: 'look-02',
      collection_id: 'col-1',
      artisan_id: 'artisan-1',
      title: 'Robe Colonne en Soie Lavée & Fil d’Or',
      look_number: 'LOOK N°02',
      category: 'Evening Haute Couture',
      description: 'Floor-length bias-cut column dress in heavy washed silk crepe, highlighted by subtle hand-embroidered metallic thread along the spine.',
      image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
      material: '100% Habotai Heavy Silk Crepe & 24K Gold Wire Filaments',
      origin: 'Atelier de Lyon & Paris',
      price_display: '€ 9,800',
      is_exclusive: 1,
      likes_count: 98,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-3',
          x: 50,
          y: 36,
          title: 'Asymmetric Pleated Bodice',
          detail: 'Hand-draped directly on the live muse to maximize fluid movement under low salon illumination.'
        }
      ])
    },
    {
      id: 'look-03',
      collection_id: 'col-2',
      artisan_id: 'artisan-2',
      title: 'Chronographe Tourbillon Squelette Céleste',
      look_number: 'HORLOGERIE N°07',
      category: 'Haute Horlogerie',
      description: 'Single-axis flying tourbillon beating at 3Hz, housed inside an ultra-slim 39mm satin-brushed 18k sand gold case with meteorite dial accents.',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
      material: '18K Sand Gold, Gibeon Meteorite Slice, Sapphire Crystal Glareproofed',
      origin: 'Le Brassus Atelier, Switzerland',
      price_display: '€ 88,000',
      is_exclusive: 1,
      likes_count: 264,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-4',
          x: 49,
          y: 48,
          title: 'Titanium Flying Tourbillon Cage',
          detail: 'Weighing only 0.28 grams, rotating once every 60 seconds to counteract gravitational variance.'
        },
        {
          id: 'hp-5',
          x: 32,
          y: 52,
          title: 'Hand-Polished Anglage',
          detail: 'Forty interior angles mirror-bevelled with diamond paste under 10x magnification.'
        }
      ])
    },
    {
      id: 'look-04',
      collection_id: 'col-3',
      artisan_id: 'artisan-3',
      title: 'Sac Cabas Sculptural « L’Atelier » en Box-Calf',
      look_number: 'MAROQUINERIE N°04',
      category: 'Leathercraft & Objects',
      description: 'Structured architectural tote handcrafted with traditional two-needle saddle stitch and hand-painted wax burnished edges.',
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
      material: 'French Full-Grain Box-Calf & Solid Brushed Brass Clasp',
      origin: 'Florence & Kyoto Workshop',
      price_display: '€ 4,200',
      is_exclusive: 0,
      likes_count: 187,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-6',
          x: 52,
          y: 45,
          title: 'Hand-Beeswax Saddle Stitch',
          detail: 'Linen thread dipped in raw beeswax, tensioned by hand for indestructible structural integrity.'
        }
      ])
    },
    {
      id: 'look-05',
      collection_id: 'col-1',
      artisan_id: 'artisan-1',
      title: 'Tailleur Smoking Déstructuré en Crêpe de Laine',
      look_number: 'LOOK N°05',
      category: 'Tailoring & Suiting',
      description: 'A contemporary reinterpretation of the classic black-tie tuxedo with shawl lapels, concealed silk satin placket, and relaxed high-rise pleated trousers.',
      image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85',
      material: 'Super 160s Tropical Virgin Wool & Mulberry Silk Grosgrain',
      origin: 'Atelier de Paris, France',
      price_display: '€ 5,100',
      is_exclusive: 0,
      likes_count: 115,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-7',
          x: 50,
          y: 42,
          title: 'Hand-Padded Canvas Chest Piece',
          detail: 'Natural horsehair floating canvas adapts to body heat for a customized personal contour.'
        }
      ])
    },
    {
      id: 'look-06',
      collection_id: 'col-2',
      artisan_id: 'artisan-2',
      title: 'Bague Haute Joaillerie « Nébuleuse » Saphir Ceylan',
      look_number: 'JOAILLERIE N°02',
      category: 'High Jewellery',
      description: 'A monumental 8.42-carat untreated royal blue Ceylon sapphire cradled by baguette-cut diamonds set in platinum.',
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      secondary_image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      material: '8.42ct Natural Unheated Ceylon Sapphire, Platinum 950, F/VVS Diamonds',
      origin: 'Place Vendôme Salon, Paris',
      price_display: 'Price Upon Private Request',
      is_exclusive: 1,
      likes_count: 310,
      hotspots_json: JSON.stringify([
        {
          id: 'hp-8',
          x: 50,
          y: 50,
          title: 'Micro-Pave Claws',
          detail: 'Custom sculpted talon prongs allowing maximum omnidirectional light penetration into the gem pavilion.'
        }
      ])
    }
  ];

  for (const l of looks) {
    insertLook.run(l);
  }

  // 4. Seed Dynamic CMS Pages & Blocks
  insertPage.run({
    id: 'page-home',
    title: 'Maison Aura — Flagship Editorial',
    slug: 'home',
    meta_description: 'An immersive digital atelier showcasing seasonal haute couture, master craftsmanship, and interactive lookbooks.',
    updated_at: '2026-09-08T00:00:00Z'
  });

  const homeBlocks = [
    {
      id: 'block-1',
      page_id: 'page-home',
      block_type: 'HeroEditorialBlock',
      sort_order: 1,
      title: 'L’Éveil Minéral',
      subtitle: 'AUTOMNE-HIVER 2026 COLLECTION',
      body_content: 'An architectural dialogue between raw geological textures, fluid double-faced cashmere, and moonlit obsidian tones.',
      media_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=90',
      config_json: JSON.stringify({
        ctaText: 'Explore Runway Lookbook',
        ctaLink: '/collections/automne-hiver-2026',
        seasonBadge: 'COLLECTION HAUTE COUTURE 2026',
        videoBackground: false
      })
    },
    {
      id: 'block-2',
      page_id: 'page-home',
      block_type: 'CraftStoryBlock',
      sort_order: 2,
      title: 'The Art of Uncompromising Restraint',
      subtitle: 'ATELIER PHILOSOPHY',
      body_content: 'At Maison Aura, luxury is not volume; it is the deliberate patience of human hands. We reject the cadence of mass production, crafting each numbered silhouette in our historic salons in Paris, Geneva, and Kyoto.',
      media_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      config_json: JSON.stringify({
        artisanName: 'Hélène de Courcelles',
        artisanRole: 'Head of Haute Couture Drapery',
        pullQuote: 'Fabric has memory. We do not force shape; we awaken the sculpture within the grain.',
        stats: [
          { label: 'Hours per Gown', value: '180+' },
          { label: 'Handcrafted Pieces', value: '100%' },
          { label: 'Generations of Lineage', value: '3' }
        ]
      })
    },
    {
      id: 'block-3',
      page_id: 'page-home',
      block_type: 'LookbookGridBlock',
      sort_order: 3,
      title: 'Curated Editorial Looks',
      subtitle: 'SEASONAL ARCHETYPE',
      body_content: 'Interactive pieces featuring full-grain box calf, double-faced cashmere, and astronomical tourbillon movements.',
      media_url: null,
      config_json: JSON.stringify({
        layout: 'asymmetric-staggered',
        collectionSlug: 'automne-hiver-2026',
        limit: 4
      })
    },
    {
      id: 'block-4',
      page_id: 'page-home',
      block_type: 'CuratedReelBlock',
      sort_order: 4,
      title: 'Master Artisans & Lineage',
      subtitle: 'THE HANDS BEHIND THE SILHOUETTE',
      body_content: 'Meet the master draper, horologist, and tanner who breathe life into every numbered creation.',
      media_url: null,
      config_json: JSON.stringify({
        reelType: 'artisans'
      })
    },
    {
      id: 'block-5',
      page_id: 'page-home',
      block_type: 'BespokeInquiryBlock',
      sort_order: 5,
      title: 'Reserve Your Private Salon Viewing',
      subtitle: 'VIP CONCIERGE EXPERIENCE',
      body_content: 'Experience our private salons in Paris Place Vendôme, London Mayfair, or Tokyo Ginza with a dedicated styling director.',
      media_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      config_json: JSON.stringify({
        salons: ['Paris Vendôme', 'London Mayfair', 'Tokyo Ginza', 'New York Madison Ave'],
        categories: ['Haute Couture', 'Haute Horlogerie', 'Fine Leathercraft', 'Private Bespoke']
      })
    }
  ];

  for (const b of homeBlocks) {
    insertBlock.run(b);
  }

  console.log('Database seeded successfully with Maison Aura luxury content!');
}

// If run directly via `node src/db/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData();
  process.exit(0);
}
