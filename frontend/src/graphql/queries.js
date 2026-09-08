export const GET_HOME_PAGE = `
  query GetHomePage {
    cmsPage(slug: "home") {
      id
      title
      slug
      meta_description
      blocks {
        id
        block_type
        sort_order
        title
        subtitle
        body_content
        media_url
        config_json
      }
    }
  }
`;

export const GET_COLLECTIONS = `
  query GetCollections($featuredOnly: Boolean) {
    collections(featuredOnly: $featuredOnly) {
      id
      title
      subtitle
      slug
      season
      year
      description
      hero_image
      theme_color
      is_featured
      published_at
    }
  }
`;

export const GET_COLLECTION_BY_SLUG = `
  query GetCollectionBySlug($slug: String!) {
    collectionBySlug(slug: $slug) {
      id
      title
      subtitle
      slug
      season
      year
      description
      hero_image
      theme_color
      is_featured
      published_at
      lookbook_items {
        id
        title
        look_number
        category
        description
        image_url
        secondary_image_url
        material
        origin
        price_display
        is_exclusive
        likes_count
        artisan {
          id
          name
          role
        }
      }
    }
  }
`;

export const GET_LOOKBOOK_ITEM = `
  query GetLookbookItem($id: ID!) {
    lookbookItem(id: $id) {
      id
      collection_id
      artisan_id
      title
      look_number
      category
      description
      image_url
      secondary_image_url
      material
      origin
      price_display
      is_exclusive
      likes_count
      hotspots {
        id
        x
        y
        title
        detail
      }
      collection {
        id
        title
        slug
        season
      }
      artisan {
        id
        name
        role
        studio_location
        portrait_image
        specialty
        quote
      }
    }
  }
`;

export const GET_LOOKBOOK_ITEMS = `
  query GetLookbookItems($collectionSlug: String, $category: String, $limit: Int) {
    lookbookItems(collectionSlug: $collectionSlug, category: $category, limit: $limit) {
      id
      title
      look_number
      category
      description
      image_url
      secondary_image_url
      material
      origin
      price_display
      is_exclusive
      likes_count
      collection {
        id
        title
        slug
      }
      artisan {
        id
        name
        role
      }
    }
  }
`;

export const GET_ARTISANS = `
  query GetArtisans {
    artisans {
      id
      name
      role
      studio_location
      biography
      portrait_image
      specialty
      quote
      years_of_mastery
      crafted_pieces {
        id
        title
        look_number
        image_url
        price_display
      }
    }
  }
`;

export const SEARCH_ALL = `
  query SearchAll($query: String!) {
    searchAll(query: $query) {
      id
      title
      look_number
      category
      description
      image_url
      price_display
      collection {
        title
        slug
      }
      artisan {
        name
      }
    }
  }
`;
