<script setup>
import { ref, watch } from 'vue';
import { useQuery } from '../../composables/useGraphQL.js';
import { SEARCH_ALL } from '../../graphql/queries.js';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-vue-next';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const searchQuery = ref('');
const debouncedQuery = ref('');
let debounceTimer = null;

watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = newVal.trim();
  }, 250);
});

const { data, loading, refetch } = useQuery(SEARCH_ALL, { query: '' });

watch(debouncedQuery, (newTerm) => {
  refetch({ query: newTerm });
});

const selectTag = (tag) => {
  searchQuery.value = tag;
};

const handleClose = () => {
  searchQuery.value = '';
  debouncedQuery.value = '';
  emit('close');
};
</script>

<template>
  <transition name="drawer">
    <div v-if="show" class="search-overlay" @click.self="handleClose">
      <div class="search-drawer glass-panel">
        <div class="page-container search-container">
          <!-- Top Bar -->
          <div class="search-bar">
            <Search :size="24" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by material (e.g. Cashmere), movement (Tourbillon), look number or artisan..."
              class="search-input"
              autofocus
            />
            <button class="close-btn" @click="handleClose" aria-label="Close search">
              <X :size="24" />
            </button>
          </div>

          <!-- Quick Discovery Tags -->
          <div class="quick-tags">
            <span class="tags-label">EDITORIAL SUGGESTIONS:</span>
            <button class="tag-pill" @click="selectTag('Cachemire')">Cashmere Coat</button>
            <button class="tag-pill" @click="selectTag('Tourbillon')">Tourbillon Horlogerie</button>
            <button class="tag-pill" @click="selectTag('Saphir')">Ceylon Sapphire</button>
            <button class="tag-pill" @click="selectTag('Box-Calf')">Box-Calf Leather</button>
            <button class="tag-pill" @click="selectTag('Smoking')">Smoking Tuxedo</button>
          </div>

          <!-- Results Section -->
          <div class="search-results">
            <div v-if="loading" class="results-loading">
              <Sparkles :size="20" class="spinner-gold" />
              <span>Querying Headless CMS GraphQL...</span>
            </div>

            <div v-else-if="debouncedQuery && data?.searchAll?.length === 0" class="results-empty">
              <p class="empty-title">No pieces found matching “{{ debouncedQuery }}”</p>
              <p class="empty-sub">Explore our curated collections or consult our private salon concierge.</p>
            </div>

            <div v-else-if="data?.searchAll?.length > 0" class="results-grid">
              <RouterLink
                v-for="item in data.searchAll"
                :key="item.id"
                :to="`/look/${item.id}`"
                class="search-item-card"
                @click="handleClose"
              >
                <div class="item-thumb">
                  <img :src="item.image_url" :alt="item.title" />
                </div>
                <div class="item-details">
                  <span class="item-badge">{{ item.look_number }} • {{ item.category }}</span>
                  <h4 class="item-title">{{ item.title }}</h4>
                  <p class="item-desc">{{ item.description }}</p>
                  <div class="item-footer">
                    <span class="item-price">{{ item.price_display }}</span>
                    <span class="item-cta">
                      <span>Inspect Piece</span>
                      <ArrowUpRight :size="14" />
                    </span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 12, 14, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.search-drawer {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-gold);
  padding: 2.5rem 0 3.5rem;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1.5px solid var(--border-medium);
  padding-bottom: 1rem;
}

.search-icon {
  color: var(--accent-gold);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
  font-style: italic;
  font-size: 1.2rem;
}

.close-btn {
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.tags-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.tag-pill {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.tag-pill:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: var(--accent-gold-light);
}

.search-results {
  margin-top: 2.5rem;
}

.results-loading, .results-empty {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.spinner-gold {
  color: var(--accent-gold);
  animation: spin 2s linear infinite;
}

.empty-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: var(--text-primary);
}

.empty-sub {
  font-size: 0.85rem;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.search-item-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  transition: all var(--transition-medium);
}

.search-item-card:hover {
  border-color: var(--border-gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.item-thumb {
  width: 90px;
  height: 120px;
  flex-shrink: 0;
  border-radius: var(--radius-xs);
  overflow: hidden;
  background: var(--bg-tertiary);
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.item-badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-gold);
}

.item-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--text-primary);
  line-height: 1.25;
  margin: 0.25rem 0;
}

.item-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-subtle);
}

.item-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-gold);
}

.item-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.drawer-enter-active, .drawer-leave-active {
  transition: all 0.35s ease;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
