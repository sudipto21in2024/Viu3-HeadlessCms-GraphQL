<script setup>
import { computed } from 'vue';
import BaseButton from '../ui/BaseButton.vue';
import { ArrowDownRight, Sparkles } from 'lucide-vue-next';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const config = computed(() => {
  try {
    return JSON.parse(props.block.config_json || '{}');
  } catch (err) {
    return {};
  }
});
</script>

<template>
  <section class="hero-editorial">
    <div class="hero-backdrop">
      <img :src="block.media_url" :alt="block.title" class="hero-image" />
      <div class="hero-scrim"></div>
    </div>

    <div class="page-container hero-content">
      <div class="hero-meta">
        <span class="season-badge" v-if="config.seasonBadge">
          <Sparkles :size="12" />
          <span>{{ config.seasonBadge }}</span>
        </span>
        <span class="eyebrow hero-eyebrow">{{ block.subtitle }}</span>
      </div>

      <h1 class="hero-title editorial-heading heading-display">
        {{ block.title }}
      </h1>

      <p class="hero-lead">
        {{ block.body_content }}
      </p>

      <div class="hero-actions">
        <BaseButton
          variant="gold"
          :to="config.ctaLink || '/collections/automne-hiver-2026'"
        >
          <span>{{ config.ctaText || 'Explore Runway Collection' }}</span>
          <ArrowDownRight :size="16" />
        </BaseButton>

        <BaseButton
          variant="outline"
          to="/artisans"
          class="hero-secondary-btn"
        >
          Discover Haute Atelier
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-editorial {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: flex-end;
  padding-bottom: 5rem;
  padding-top: 8rem;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  transform: scale(1.02);
  transition: transform 1.2s ease-out;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(12, 12, 14, 0.92) 0%,
    rgba(12, 12, 14, 0.5) 45%,
    rgba(12, 12, 14, 0.2) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.season-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--accent-gold);
  color: #121214;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-xs);
  text-transform: uppercase;
}

.hero-eyebrow {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.8);
}

.hero-title {
  color: #FAF8F5;
  margin-bottom: 1.25rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.hero-lead {
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  color: rgba(250, 248, 245, 0.85);
  line-height: 1.6;
  max-width: 680px;
  margin-bottom: 2.25rem;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.hero-secondary-btn {
  color: #FAF8F5;
  border-color: rgba(255, 255, 255, 0.35);
}

.hero-secondary-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #FAF8F5;
  color: #FAF8F5;
}
</style>
