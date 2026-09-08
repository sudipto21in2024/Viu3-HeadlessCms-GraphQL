<script setup>
import { useQuery } from '../composables/useGraphQL.js';
import { GET_HOME_PAGE } from '../graphql/queries.js';
import BlockRenderer from '../components/cms/BlockRenderer.vue';
import { Sparkles } from 'lucide-vue-next';

defineEmits(['open-booking']);

const { data, loading, error, refetch } = useQuery(GET_HOME_PAGE);
</script>

<template>
  <div class="home-view">
    <!-- Loading State -->
    <div v-if="loading" class="home-loading">
      <div class="loading-container">
        <Sparkles :size="28" class="loading-sparkle" />
        <span class="loading-text font-serif">MAISON AURA</span>
        <span class="loading-sub">Connecting to Headless CMS via GraphQL...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="page-container error-state">
      <div class="error-box glass-panel">
        <h2 class="editorial-heading heading-md">Atelier Connection Error</h2>
        <p>{{ error }}</p>
        <button class="btn btn-outline" @click="() => refetch()">
          Retry Connection
        </button>
      </div>
    </div>

    <!-- Dynamic CMS Blocks Content -->
    <div v-else-if="data?.cmsPage">
      <BlockRenderer
        :blocks="data.cmsPage.blocks"
        @open-booking="$emit('open-booking')"
      />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
}

.home-loading {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loading-sparkle {
  color: var(--accent-gold);
  animation: pulse 1.8s infinite ease-in-out;
}

.loading-text {
  font-size: 1.6rem;
  letter-spacing: 0.2em;
  color: var(--text-primary);
}

.loading-sub {
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.error-state {
  padding: 10rem 0 6rem;
  display: flex;
  justify-content: center;
}

.error-box {
  max-width: 500px;
  padding: 3rem;
  text-align: center;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}
</style>
