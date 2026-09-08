<script setup>
import { Heart, Sparkles } from 'lucide-vue-next';
import { useWishlist } from '../../composables/useWishlist.js';

const props = defineProps({
  look: {
    type: Object,
    required: true
  }
});

const { isSaved, toggleWishlist, loading } = useWishlist();

const handleToggleLike = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  try {
    await toggleWishlist(props.look.id, props.look.likes_count);
  } catch (err) {
    console.error('Wishlist error:', err);
  }
};
</script>

<template>
  <div class="look-card group">
    <RouterLink :to="`/look/${look.id}`" class="look-image-wrapper">
      <img
        :src="look.image_url"
        :alt="look.title"
        class="look-image"
        loading="lazy"
      />
      <div class="look-overlay"></div>

      <!-- Badges -->
      <div class="card-badges">
        <span class="look-badge">{{ look.look_number }}</span>
        <span v-if="look.is_exclusive" class="exclusive-badge">
          <Sparkles :size="10" />
          <span>Atelier Exclusive</span>
        </span>
      </div>

      <!-- Wishlist Action -->
      <button
        class="wishlist-btn"
        :class="{ 'is-active': isSaved(look.id) }"
        @click="handleToggleLike"
        :disabled="loading"
        title="Save to Salon Wishlist"
        aria-label="Save to Wishlist"
      >
        <Heart :size="16" :fill="isSaved(look.id) ? 'currentColor' : 'none'" />
      </button>
    </RouterLink>

    <!-- Look Info -->
    <div class="look-info">
      <div class="look-meta">
        <span class="meta-label">{{ look.category }}</span>
        <span class="look-price">{{ look.price_display }}</span>
      </div>

      <h3 class="look-title">
        <RouterLink :to="`/look/${look.id}`">
          {{ look.title }}
        </RouterLink>
      </h3>

      <p class="look-material">{{ look.material }}</p>

      <div class="look-origin" v-if="look.origin">
        <span class="origin-dot"></span>
        <span>{{ look.origin }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.look-card {
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-medium);
}

.look-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-xs);
}

.look-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.look-card:hover .look-image {
  transform: scale(1.05);
}

.look-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
  opacity: 0.6;
  transition: opacity var(--transition-medium);
}

.look-card:hover .look-overlay {
  opacity: 0.8;
}

.card-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  z-index: 2;
}

.look-badge {
  background: rgba(18, 18, 20, 0.75);
  backdrop-filter: blur(8px);
  color: #FAF8F5;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-xs);
  text-transform: uppercase;
}

.exclusive-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--accent-gold);
  color: #121214;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-xs);
  text-transform: uppercase;
}

.wishlist-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  color: #121214;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all var(--transition-fast);
}

.wishlist-btn:hover {
  transform: scale(1.1);
  background: #FFFFFF;
  color: #E24A4A;
}

.wishlist-btn.is-active {
  color: #E24A4A;
  background: #FFFFFF;
}

.look-info {
  padding: 1.25rem 0 0.5rem;
}

.look-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.look-price {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent-gold);
}

.look-title {
  font-size: 1.25rem;
  line-height: 1.25;
  margin-bottom: 0.45rem;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.look-title a:hover {
  color: var(--accent-gold);
}

.look-material {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.look-origin {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}

.origin-dot {
  width: 5px;
  height: 5px;
  background: var(--accent-gold);
  border-radius: 50%;
}
</style>
