<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '../composables/useGraphQL.js';
import { GET_COLLECTIONS, GET_LOOKBOOK_ITEMS } from '../graphql/queries.js';
import LookCard from '../components/ui/LookCard.vue';
import { Sparkles, SlidersHorizontal, ArrowDown } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const selectedCollectionSlug = ref(route.params.slug || '');
const selectedCategory = ref('ALL');

watch(() => route.params.slug, (newSlug) => {
  selectedCollectionSlug.value = newSlug || '';
});

const { data: collectionsData, loading: collectionsLoading } = useQuery(GET_COLLECTIONS);

const { data: lookbookData, loading: lookbookLoading, refetch: refetchLooks } = useQuery(
  GET_LOOKBOOK_ITEMS,
  {
    collectionSlug: selectedCollectionSlug.value || null,
    category: selectedCategory.value === 'ALL' ? null : selectedCategory.value
  }
);

const activeCollection = computed(() => {
  if (!selectedCollectionSlug.value || !collectionsData.value?.collections) return null;
  return collectionsData.value.collections.find(c => c.slug === selectedCollectionSlug.value);
});

const categories = [
  'ALL',
  'Haute Couture Outerwear',
  'Evening Haute Couture',
  'Haute Horlogerie',
  'High Jewellery',
  'Leathercraft & Objects',
  'Tailoring & Suiting'
];

const setCollection = (slug) => {
  selectedCollectionSlug.value = slug;
  if (slug) {
    router.push(`/collections/${slug}`);
  } else {
    router.push('/collections');
  }
  refetchLooks({
    collectionSlug: slug || null,
    category: selectedCategory.value === 'ALL' ? null : selectedCategory.value
  });
};

const setCategory = (cat) => {
  selectedCategory.value = cat;
  refetchLooks({
    collectionSlug: selectedCollectionSlug.value || null,
    category: cat === 'ALL' ? null : cat
  });
};
</script>

<template>
  <div class="collections-view">
    <!-- Hero Header -->
    <section class="collections-hero">
      <div class="page-container hero-inner">
        <span class="eyebrow">EDITORIAL DIRECTORY</span>
        <h1 class="editorial-heading heading-display hero-title">
          {{ activeCollection ? activeCollection.title : 'Collections & Haute Horlogerie' }}
        </h1>
        <p class="hero-description">
          {{ activeCollection ? activeCollection.description : 'Explore our complete seasonal archives, grand complications, and numbered handcrafted masterpieces.' }}
        </p>
      </div>
    </section>

    <!-- Filters & Taxonomy Bar -->
    <div class="filters-bar-wrapper glass-panel">
      <div class="page-container filters-bar">
        <!-- Collection Pills -->
        <div class="collection-pills">
          <button
            class="pill-btn"
            :class="{ 'is-active': !selectedCollectionSlug }"
            @click="setCollection('')"
          >
            All Archives
          </button>
          <button
            v-for="col in collectionsData?.collections"
            :key="col.id"
            class="pill-btn"
            :class="{ 'is-active': selectedCollectionSlug === col.slug }"
            @click="setCollection(col.slug)"
          >
            {{ col.season }} • {{ col.title }}
          </button>
        </div>

        <!-- Category Dropdown / Horizontal Scroll -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            class="tab-btn"
            :class="{ 'is-active': selectedCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lookbook Grid -->
    <main class="page-container gallery-container">
      <div class="gallery-meta">
        <span class="meta-label">
          SHOWING {{ lookbookData?.lookbookItems?.length || 0 }} NUMBERED CREATIONS
        </span>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="lookbookLoading" class="gallery-grid">
        <div v-for="n in 6" :key="n" class="skeleton-item">
          <div class="skeleton" style="aspect-ratio: 3/4; width: 100%;"></div>
          <div class="skeleton" style="height: 14px; width: 40%; margin-top: 1rem;"></div>
          <div class="skeleton" style="height: 22px; width: 85%; margin-top: 0.5rem;"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="lookbookData?.lookbookItems?.length === 0" class="empty-gallery">
        <Sparkles :size="24" class="gold-icon" />
        <h3 class="font-serif empty-title">No pieces found in this category</h3>
        <p class="empty-desc">Please adjust your collection or category filters.</p>
        <button class="btn btn-outline" @click="setCategory('ALL')">
          Reset Category Filters
        </button>
      </div>

      <!-- Grid Results -->
      <div v-else class="gallery-grid">
        <LookCard
          v-for="look in lookbookData?.lookbookItems"
          :key="look.id"
          :look="look"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.collections-view {
  min-height: 100vh;
  padding-top: 5rem;
}

.collections-hero {
  padding: 5rem 0 3.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.hero-inner {
  max-width: 840px;
}

.hero-title {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 300;
}

/* Sticky Filter Bar */
.filters-bar-wrapper {
  position: sticky;
  top: 70px;
  z-index: 40;
  border-bottom: 1px solid var(--border-subtle);
  padding: 1rem 0;
}

.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.collection-pills, .category-tabs {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.collection-pills::-webkit-scrollbar,
.category-tabs::-webkit-scrollbar {
  display: none;
}

.pill-btn {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-xs);
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.pill-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.pill-btn.is-active {
  background: var(--text-primary);
  color: var(--text-inverse);
  border-color: var(--text-primary);
}

.category-tabs {
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.75rem;
}

.tab-btn {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.tab-btn:hover, .tab-btn.is-active {
  color: var(--accent-gold);
}

.tab-btn.is-active {
  font-weight: 700;
}

/* Gallery */
.gallery-container {
  padding-top: 3rem;
  padding-bottom: 6rem;
}

.gallery-meta {
  margin-bottom: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem 2rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skeleton-item {
  display: flex;
  flex-direction: column;
}

.empty-gallery {
  text-align: center;
  padding: 6rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.gold-icon {
  color: var(--accent-gold);
}
</style>
