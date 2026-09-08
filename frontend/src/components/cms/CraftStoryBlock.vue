<script setup>
import { computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

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
  <section class="craft-story section-spacing">
    <div class="page-container craft-grid">
      <!-- Left: Imagery & Pull Quote -->
      <div class="craft-media-col">
        <div class="media-frame">
          <img :src="block.media_url" :alt="config.artisanName || 'Artisan Mastery'" class="craft-image" />
          <div class="media-badge">
            <span class="badge-title">{{ config.artisanName }}</span>
            <span class="badge-role">{{ config.artisanRole }}</span>
          </div>
        </div>

        <div v-if="config.pullQuote" class="pull-quote-card glass-panel">
          <span class="quote-mark">“</span>
          <p class="quote-text">{{ config.pullQuote }}</p>
        </div>
      </div>

      <!-- Right: Narrative & Provenance Stats -->
      <div class="craft-narrative-col">
        <span class="eyebrow">{{ block.subtitle }}</span>
        <h2 class="editorial-heading heading-xl craft-title">
          {{ block.title }}
        </h2>

        <p class="craft-body">
          {{ block.body_content }}
        </p>

        <!-- Stats Matrix -->
        <div v-if="config.stats && config.stats.length" class="stats-matrix">
          <div v-for="(stat, idx) in config.stats" :key="idx" class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <div class="craft-cta-row">
          <RouterLink to="/artisans" class="inline-link">
            <span>Read the Master Artisans Monograph</span>
            <ArrowRight :size="16" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.craft-story {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.craft-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .craft-grid {
    grid-template-columns: 1.1fr 1fr;
    gap: 6rem;
  }
}

.craft-media-col {
  position: relative;
}

.media-frame {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.craft-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-badge {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(12px);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-xs);
  display: flex;
  flex-direction: column;
}

.badge-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: #FAF8F5;
}

.badge-role {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
}

.pull-quote-card {
  margin-top: 1.5rem;
  padding: 1.5rem 2rem;
  border-radius: var(--radius-xs);
  position: relative;
  border-left: 3px solid var(--accent-gold);
}

.quote-mark {
  font-family: var(--font-serif);
  font-size: 3rem;
  color: var(--accent-gold);
  line-height: 1;
  display: block;
  margin-bottom: -1rem;
}

.quote-text {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  line-height: 1.4;
  color: var(--text-primary);
}

.craft-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.craft-body {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.stats-matrix {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 500;
  color: var(--accent-gold);
  line-height: 1;
}

.stat-label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 0.4rem;
}

.inline-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.inline-link:hover {
  color: var(--accent-gold);
  transform: translateX(4px);
}
</style>
