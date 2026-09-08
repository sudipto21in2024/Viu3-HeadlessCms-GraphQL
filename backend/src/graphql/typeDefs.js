export const typeDefs = `#graphql
  type Collection {
    id: ID!
    title: String!
    subtitle: String
    slug: String!
    season: String!
    year: Int!
    description: String
    hero_image: String!
    theme_color: String
    is_featured: Boolean!
    published_at: String!
    lookbook_items: [LookbookItem!]!
  }

  type Artisan {
    id: ID!
    name: String!
    role: String!
    studio_location: String!
    biography: String!
    portrait_image: String!
    specialty: String!
    quote: String
    years_of_mastery: Int!
    crafted_pieces: [LookbookItem!]!
  }

  type Hotspot {
    id: String!
    x: Float!
    y: Float!
    title: String!
    detail: String!
  }

  type LookbookItem {
    id: ID!
    collection_id: ID!
    artisan_id: ID
    title: String!
    look_number: String!
    category: String!
    description: String!
    image_url: String!
    secondary_image_url: String
    material: String!
    origin: String!
    price_display: String!
    hotspots: [Hotspot!]!
    is_exclusive: Boolean!
    likes_count: Int!
    collection: Collection
    artisan: Artisan
  }

  type CMSBlock {
    id: ID!
    block_type: String!
    sort_order: Int!
    title: String
    subtitle: String
    body_content: String
    media_url: String
    config_json: String
  }

  type CMSPage {
    id: ID!
    title: String!
    slug: String!
    meta_description: String
    updated_at: String!
    blocks: [CMSBlock!]!
  }

  type VIPBookingResult {
    id: ID!
    status: String!
    message: String!
    client_name: String!
    preferred_salon: String!
    preferred_date: String!
  }

  type ToggleWishlistResult {
    look_id: ID!
    is_saved: Boolean!
    total_likes: Int!
  }

  input VIPViewingInput {
    client_name: String!
    client_email: String!
    client_phone: String
    preferred_salon: String!
    preferred_date: String!
    interest_category: String!
    special_requests: String
  }

  type Query {
    # CMS Pages & Dynamic Content
    cmsPage(slug: String!): CMSPage

    # Collections
    collections(featuredOnly: Boolean): [Collection!]!
    collectionBySlug(slug: String!): Collection

    # Lookbook
    lookbookItems(collectionSlug: String, category: String, limit: Int): [LookbookItem!]!
    lookbookItem(id: ID!): LookbookItem

    # Artisans
    artisans: [Artisan!]!
    artisan(id: ID!): Artisan

    # Search & Discovery
    searchAll(query: String!): [LookbookItem!]!
  }

  type Mutation {
    # VIP Booking / Consultation RSVP
    requestPrivateViewing(input: VIPViewingInput!): VIPBookingResult!

    # Client Wishlist & Liking
    toggleLookWishlist(lookId: ID!, sessionId: String!): ToggleWishlistResult!

    # Editorial Newsletter Subscription
    subscribeEditorial(email: String!): Boolean!
  }
`;
