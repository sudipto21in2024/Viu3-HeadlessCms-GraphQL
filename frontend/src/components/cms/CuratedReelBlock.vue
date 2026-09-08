<script setup>
import { useQuery } from '../../composables/useGraphQL.js';
import { GET_ARTISANS } from '../../graphql/queries.js';
import { MapPin, Award, ArrowUpRight } from 'lucide-vue-next';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const { data, loading } = useQuery(GET_ARTISANS);
</script>

<template>
  <section class="reel-block section-spacing">
    <div class="page-container">
      <div class="reel-header">
        <span class="eyebrow">{{ block.subtitle }}</span>
        <h2 class="editorial-heading heading-xl">{{ block.title }}</h2>
        <p class="reel-desc" v-if="block.body_content">{{ block.body_content }}</p>
      </div>

      <!-- Skeletons -->
      <div v-if="loading" class="artisans-grid">
        <div v-for="n in 3" :key="n" class="skeleton" style="height: 460px;"></div>
      </div>

      <!-- Artisans Grid -->
      <div v-else class="artisans-grid">
        <div
          v-for="artisan in data?.artisans"
          :key="artisan.id"
          class="artisan-card card-luxury"
        >
          <div class="artisan-portrait-wrapper">
            <img :src="artisan.portrait_image" :alt="artisan.name" class="artisan-portrait" />
            <div class="mastery-pill">
              <Award :size="12" />
              <span>{{ artisan.years_of_mastery }} Years Mastery</span>
            </div>
          </div>

          <div class="artisan-content">
            <div class="artisan-location">
              <MapPin :size="13" class="gold-icon" />
              <span>{{ artisan.studio_location }}</span>
            </div>

            <h3 class="artisan-name">{{ artisan.name }}</h3>
            <span class="artisan-role">{{ artisan.role }}</span>

            <p class="artisan-bio">{{ artisan.biography }}</p>

            <blockquote v-if="artisan.quote" class="artisan-quote">
              “{{ artisan.quote }}”
            </blockquote>

            <div class="artisan-footer">
              <span class="specialty-tag">{{ artisan.specialty }}</span>
              <RouterLink to="/artisans" class="view-atelier-link">
                <span>Atelier Bio</span>
                <ArrowUpRight :size="14" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reel-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 4rem;
}

.reel-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.5;
}

.artisans-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .artisans-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.artisan-card {
  display: flex;
  flex-direction: column;
}

.artisan-portrait-wrapper {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.artisan-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.artisan-card:hover .artisan-portrait {
  transform: scale(1.04);
}

.mastery-pill {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(18, 18, 20, 0.8);
  backdrop-filter: blur(8px);
  color: var(--accent-gold);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-gold);
}

.artisan-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.artisan-location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.gold-icon {
  color: var(--accent-gold);
}

.artisan-name {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.artisan-role {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin: 0.25rem 0 1rem;
  display: block;
}

.artisan-bio {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.artisan-quote {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-primary);
  padding-left: 0.75rem;
  border-left: 2px solid var(--accent-gold);
  margin-bottom: 1.5rem;
  line-height: 1.45;
}

.artisan-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.specialty-tag {
  font-size: 0.68rem;
  color: var(--text-muted);
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-atelier-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.view-atelier-link:hover {
  color: var(--accent-gold);
}
</style>
