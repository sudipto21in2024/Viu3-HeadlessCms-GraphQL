<script setup>
import { computed } from 'vue';
import { useQuery } from '../../composables/useGraphQL.js';
import { GET_LOOKBOOK_ITEMS } from '../../graphql/queries.js';
import LookCard from '../ui/LookCard.vue';
import BaseButton from '../ui/BaseButton.vue';
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

const { data, loading } = useQuery(GET_LOOKBOOK_ITEMS, {
  collectionSlug: config.value.collectionSlug || 'automne-hiver-2026',
  limit: config.value.limit || 4
});
</script>

<template>
  <section class="lookbook-block section-spacing">
    <div class="page-container">
      <!-- Section Header -->
      <div class="block-header">
        <div class="header-text">
          <span class="eyebrow">{{ block.subtitle }}</span>
          <h2 class="editorial-heading heading-xl">{{ block.title }}</h2>
          <p class="block-desc" v-if="block.body_content">{{ block.body_content }}</p>
        </div>

        <div class="header-action">
          <BaseButton variant="outline" :to="`/collections/${config.collectionSlug || 'automne-hiver-2026'}`">
            <span>View Full Collection Archive</span>
            <ArrowRight :size="14" />
          </BaseButton>
        </div>
      </div>

      <!-- Skeletons while loading -->
      <div v-if="loading" class="lookbook-grid-layout">
        <div v-for="n in 4" :key="n" class="skeleton-card">
          <div class="skeleton" style="aspect-ratio: 3/4; width: 100%;"></div>
          <div class="skeleton" style="height: 14px; width: 40%; margin-top: 1rem;"></div>
          <div class="skeleton" style="height: 22px; width: 80%; margin-top: 0.5rem;"></div>
        </div>
      </div>

      <!-- Looks Grid -->
      <div v-else class="lookbook-grid-layout">
        <LookCard
          v-for="(look, idx) in data?.lookbookItems"
          :key="look.id"
          :look="look"
          :class="{ 'featured-item': idx === 0 }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.block-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
}

@media (min-width: 768px) {
  .block-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.block-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 540px;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.lookbook-grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem 2rem;
}

@media (min-width: 640px) {
  .lookbook-grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lookbook-grid-layout {
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem 2rem;
  }
}

.skeleton-card {
  display: flex;
  flex-direction: column;
}
</style>
