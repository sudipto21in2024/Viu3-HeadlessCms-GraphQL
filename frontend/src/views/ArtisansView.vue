<script setup>
import { useQuery } from '../composables/useGraphQL.js';
import { GET_ARTISANS } from '../graphql/queries.js';
import { MapPin, Award, ArrowRight } from 'lucide-vue-next';

const { data, loading } = useQuery(GET_ARTISANS);
</script>

<template>
  <div class="artisans-view">
    <!-- Hero -->
    <section class="artisans-hero">
      <div class="page-container hero-inner">
        <span class="eyebrow">HAUTE MAÎTRISE & LINEAGE</span>
        <h1 class="editorial-heading heading-display hero-title">The Master Artisans</h1>
        <p class="hero-desc">
          Behind every numbered silhouette and tourbillon cage are decades of quiet human patience. 
          Discover our Paris, Geneva, and Kyoto ateliers.
        </p>
      </div>
    </section>

    <!-- Master Artisans List -->
    <main class="page-container monograph-container">
      <div v-if="loading" class="monograph-list">
        <div v-for="n in 3" :key="n" class="skeleton" style="height: 480px; width: 100%; margin-bottom: 4rem;"></div>
      </div>

      <div v-else class="monograph-list">
        <article
          v-for="(artisan, idx) in data?.artisans"
          :key="artisan.id"
          class="artisan-monograph-section"
          :class="{ 'is-reversed': idx % 2 === 1 }"
        >
          <!-- Portrait & Studio -->
          <div class="monograph-media">
            <div class="portrait-box">
              <img :src="artisan.portrait_image" :alt="artisan.name" class="portrait-img" />
              <div class="mastery-tag">
                <Award :size="14" />
                <span>{{ artisan.years_of_mastery }} Years of Master Lineage</span>
              </div>
            </div>
          </div>

          <!-- Narrative Content -->
          <div class="monograph-content">
            <div class="studio-geo">
              <MapPin :size="14" class="gold-icon" />
              <span>{{ artisan.studio_location }}</span>
            </div>

            <h2 class="editorial-heading heading-xl artisan-name">{{ artisan.name }}</h2>
            <span class="artisan-title">{{ artisan.role }}</span>

            <blockquote class="monograph-pullquote" v-if="artisan.quote">
              “{{ artisan.quote }}”
            </blockquote>

            <p class="artisan-bio-text">{{ artisan.biography }}</p>

            <div class="specialty-block">
              <span class="meta-label">PRIMARY DISCIPLINE</span>
              <span class="specialty-val">{{ artisan.specialty }}</span>
            </div>

            <!-- Crafted Pieces Thumbnails -->
            <div v-if="artisan.crafted_pieces && artisan.crafted_pieces.length" class="crafted-gallery">
              <span class="meta-label">SIGNATURE MASTERPIECES</span>
              <div class="crafted-thumbs">
                <RouterLink
                  v-for="piece in artisan.crafted_pieces"
                  :key="piece.id"
                  :to="`/look/${piece.id}`"
                  class="piece-thumb-link"
                >
                  <img :src="piece.image_url" :alt="piece.title" />
                  <span class="piece-num">{{ piece.look_number }}</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.artisans-view {
  min-height: 100vh;
  padding-top: 5rem;
}

.artisans-hero {
  padding: 5rem 0 4rem;
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

.hero-desc {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 300;
}

.monograph-container {
  padding: 6rem 0;
}

.monograph-list {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.artisan-monograph-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
}

@media (min-width: 992px) {
  .artisan-monograph-section {
    grid-template-columns: 1fr 1.2fr;
    gap: 6rem;
  }
  .artisan-monograph-section.is-reversed {
    grid-template-columns: 1.2fr 1fr;
  }
  .artisan-monograph-section.is-reversed .monograph-media {
    order: 2;
  }
  .artisan-monograph-section.is-reversed .monograph-content {
    order: 1;
  }
}

.monograph-media {
  position: relative;
}

.portrait-box {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: var(--bg-tertiary);
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mastery-tag {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(10px);
  color: var(--accent-gold);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-gold);
}

.monograph-content {
  display: flex;
  flex-direction: column;
}

.studio-geo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.gold-icon {
  color: var(--accent-gold);
}

.artisan-name {
  color: var(--text-primary);
  line-height: 1.15;
}

.artisan-title {
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin: 0.35rem 0 1.5rem;
}

.monograph-pullquote {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.45;
  padding-left: 1.25rem;
  border-left: 2.5px solid var(--accent-gold);
  margin-bottom: 1.75rem;
}

.artisan-bio-text {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.specialty-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 2rem;
}

.specialty-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.crafted-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.crafted-thumbs {
  display: flex;
  gap: 1rem;
}

.piece-thumb-link {
  position: relative;
  width: 70px;
  height: 90px;
  border-radius: var(--radius-xs);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  transition: transform var(--transition-fast);
}

.piece-thumb-link:hover {
  transform: scale(1.08);
  border-color: var(--accent-gold);
}

.piece-thumb-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.piece-num {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(18, 18, 20, 0.75);
  font-size: 0.55rem;
  color: #FAF8F5;
  text-align: center;
  padding: 2px 0;
}
</style>
