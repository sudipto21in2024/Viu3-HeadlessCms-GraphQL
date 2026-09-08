<script setup>
import BaseButton from '../components/ui/BaseButton.vue';
import { Sparkles, ArrowLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="not-found-view">
    <div class="page-container not-found-content">
      <Sparkles :size="32" class="gold-icon" />
      <span class="eyebrow">404 • ARCHIVE NOT FOUND</span>
      <h1 class="editorial-heading heading-display">The requested silhouette does not exist in the atelier</h1>
      <p class="not-found-sub">
        The archive piece you are searching for may have been retired to our private heritage salon or relocated.
      </p>

      <BaseButton variant="gold" to="/">
        <ArrowLeft :size="16" />
        <span>Return to Flagship Editorial</span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 0;
}

.not-found-content {
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.not-found-sub {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.gold-icon {
  color: var(--accent-gold);
}
</style>
