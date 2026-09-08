<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '../composables/useGraphQL.js';
import { GET_LOOKBOOK_ITEM } from '../graphql/queries.js';
import { useWishlist } from '../composables/useWishlist.js';
import HotspotViewer from '../components/ui/HotspotViewer.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { Heart, Sparkles, MapPin, Award, Calendar, ArrowLeft } from 'lucide-vue-next';

defineEmits(['open-booking']);

const route = useRoute();
const { isSaved, toggleWishlist, loading: wishlistLoading } = useWishlist();

const lookId = computed(() => route.params.id);
const activeImageIndex = ref(0);

const { data, loading, error, refetch } = useQuery(
  GET_LOOKBOOK_ITEM,
  { id: lookId.value }
);

watch(lookId, (newId) => {
  if (newId) {
    activeImageIndex.value = 0;
    refetch({ id: newId });
  }
});

const look = computed(() => data.value?.lookbookItem);

const currentImageUrl = computed(() => {
  if (!look.value) return '';
  if (activeImageIndex.value === 1 && look.value.secondary_image_url) {
    return look.value.secondary_image_url;
  }
  return look.value.image_url;
});

const handleToggleLike = async () => {
  if (!look.value) return;
  try {
    const res = await toggleWishlist(look.value.id, look.value.likes_count);
    look.value.likes_count = res.total_likes;
  } catch (err) {
    console.error('Wishlist toggle error:', err);
  }
};
</script>

<template>
  <div class="look-detail-view">
    <!-- Breadcrumb & Back -->
    <div class="page-container top-bar">
      <RouterLink to="/collections" class="back-link">
        <ArrowLeft :size="16" />
        <span>Return to Collections</span>
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="page-container loading-state">
      <div class="detail-grid">
        <div class="skeleton" style="aspect-ratio: 4/5; width: 100%;"></div>
        <div class="detail-info-col">
          <div class="skeleton" style="height: 16px; width: 30%;"></div>
          <div class="skeleton" style="height: 36px; width: 80%; margin-top: 1rem;"></div>
          <div class="skeleton" style="height: 24px; width: 40%; margin-top: 0.5rem;"></div>
          <div class="skeleton" style="height: 120px; width: 100%; margin-top: 2rem;"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !look" class="page-container error-state">
      <h2 class="editorial-heading heading-md">Lookbook Piece Not Found</h2>
      <RouterLink to="/collections" class="btn btn-outline" style="margin-top: 1rem;">
        Browse All Collections
      </RouterLink>
    </div>

    <!-- Look Detail Content -->
    <div v-else class="page-container detail-container">
      <div class="detail-grid">
        <!-- Left: Interactive Hotspot Viewer & Photo Switcher -->
        <div class="detail-media-col">
          <HotspotViewer
            :image-url="currentImageUrl"
            :alt="look.title"
            :hotspots="activeImageIndex === 0 ? look.hotspots : []"
          />

          <!-- Secondary Image Thumbnails -->
          <div v-if="look.secondary_image_url" class="thumbnail-row">
            <button
              class="thumb-btn"
              :class="{ 'is-active': activeImageIndex === 0 }"
              @click="activeImageIndex = 0"
            >
              <img :src="look.image_url" :alt="look.title" />
              <span class="thumb-label">Main Look (Hotspots)</span>
            </button>

            <button
              class="thumb-btn"
              :class="{ 'is-active': activeImageIndex === 1 }"
              @click="activeImageIndex = 1"
            >
              <img :src="look.secondary_image_url" :alt="`${look.title} detail`" />
              <span class="thumb-label">Atelier Detail View</span>
            </button>
          </div>
        </div>

        <!-- Right: Editorial Specs, Artisan Attribution & Actions -->
        <div class="detail-info-col">
          <div class="detail-header">
            <div class="header-badges">
              <span class="look-num-badge">{{ look.look_number }}</span>
              <span v-if="look.is_exclusive" class="exclusive-pill">
                <Sparkles :size="12" />
                <span>Atelier Exclusive</span>
              </span>
            </div>

            <span class="meta-label">{{ look.category }}</span>
            <h1 class="editorial-heading heading-xl piece-title">{{ look.title }}</h1>
            <span class="piece-price">{{ look.price_display }}</span>
          </div>

          <p class="piece-description">{{ look.description }}</p>

          <!-- Specifications Matrix -->
          <div class="specs-box card-luxury">
            <div class="spec-row">
              <span class="spec-label">Material & Weave</span>
              <span class="spec-value">{{ look.material }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Provenance</span>
              <span class="spec-value">
                <MapPin :size="13" class="gold-icon" style="display:inline; margin-right:4px;" />
                {{ look.origin }}
              </span>
            </div>
            <div class="spec-row" v-if="look.collection">
              <span class="spec-label">Collection</span>
              <RouterLink :to="`/collections/${look.collection.slug}`" class="spec-link">
                {{ look.collection.title }} ({{ look.collection.season }})
              </RouterLink>
            </div>
          </div>

          <!-- Artisan Master Card -->
          <div v-if="look.artisan" class="artisan-monograph-card glass-panel">
            <div class="monograph-avatar">
              <img :src="look.artisan.portrait_image" :alt="look.artisan.name" />
            </div>
            <div class="monograph-info">
              <span class="eyebrow monograph-eyebrow">CRAFTED UNDER DIRECTION OF</span>
              <h4 class="monograph-name">{{ look.artisan.name }}</h4>
              <span class="monograph-role">{{ look.artisan.role }}</span>
              <p v-if="look.artisan.quote" class="monograph-quote">
                “{{ look.artisan.quote }}”
              </p>
            </div>
          </div>

          <!-- Actions: Wishlist & Private Salon Fitting -->
          <div class="action-buttons">
            <BaseButton
              variant="primary"
              style="flex: 1"
              @click="$emit('open-booking')"
            >
              <Calendar :size="16" />
              <span>Reserve Private Salon Fitting</span>
            </BaseButton>

            <button
              class="wishlist-toggle-btn"
              :class="{ 'is-active': isSaved(look.id) }"
              @click="handleToggleLike"
              :disabled="wishlistLoading"
              aria-label="Save to Wishlist"
            >
              <Heart :size="18" :fill="isSaved(look.id) ? 'currentColor' : 'none'" />
              <span class="likes-count">{{ look.likes_count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.look-detail-view {
  min-height: 100vh;
  padding-top: 6rem;
  padding-bottom: 8rem;
}

.top-bar {
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--accent-gold);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
}

@media (min-width: 992px) {
  .detail-grid {
    grid-template-columns: 1.15fr 1fr;
    gap: 5rem;
    align-items: flex-start;
  }
}

.detail-media-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.thumbnail-row {
  display: flex;
  gap: 1rem;
}

.thumb-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.85rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.thumb-btn img {
  width: 38px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-xs);
}

.thumb-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.thumb-btn.is-active {
  border-color: var(--accent-gold);
  background: var(--accent-gold-light);
}

.thumb-btn.is-active .thumb-label {
  color: var(--accent-gold);
}

/* Detail Info Column */
.detail-info-col {
  display: flex;
  flex-direction: column;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.look-num-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.exclusive-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
  background: var(--accent-gold-light);
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-xs);
}

.piece-title {
  color: var(--text-primary);
  margin: 0.4rem 0 0.75rem;
  line-height: 1.15;
}

.piece-price {
  display: block;
  font-family: var(--font-sans);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: 1.5rem;
}

.piece-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.specs-box {
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spec-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.84rem;
}

@media (min-width: 600px) {
  .spec-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.spec-label {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.spec-value {
  color: var(--text-primary);
  font-weight: 500;
}

.spec-link {
  color: var(--accent-gold);
  text-decoration: underline;
}

.artisan-monograph-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-subtle);
  margin-bottom: 2.25rem;
}

.monograph-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.monograph-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.monograph-info {
  display: flex;
  flex-direction: column;
}

.monograph-eyebrow {
  margin-bottom: 0.25rem;
  font-size: 0.65rem;
}

.monograph-name {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.monograph-role {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.monograph-quote {
  font-family: var(--font-serif);
  font-size: 0.88rem;
  font-style: italic;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.wishlist-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  border-radius: var(--radius-xs);
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.wishlist-toggle-btn:hover {
  border-color: #E24A4A;
  color: #E24A4A;
}

.wishlist-toggle-btn.is-active {
  color: #E24A4A;
  border-color: #E24A4A;
  background: rgba(226, 74, 74, 0.08);
}

.likes-count {
  font-size: 0.82rem;
  font-weight: 600;
}
</style>
