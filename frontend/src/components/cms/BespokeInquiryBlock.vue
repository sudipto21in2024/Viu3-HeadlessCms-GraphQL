<script setup>
import { computed } from 'vue';
import BaseButton from '../ui/BaseButton.vue';
import { Sparkles, Calendar } from 'lucide-vue-next';

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-booking']);

const config = computed(() => {
  try {
    return JSON.parse(props.block.config_json || '{}');
  } catch (err) {
    return {};
  }
});
</script>

<template>
  <section class="inquiry-block">
    <div class="inquiry-backdrop">
      <img :src="block.media_url" :alt="block.title" class="inquiry-image" />
      <div class="inquiry-scrim"></div>
    </div>

    <div class="page-container inquiry-content">
      <div class="inquiry-card glass-panel">
        <span class="eyebrow">
          <Sparkles :size="12" style="display: inline; margin-right: 4px;" />
          {{ block.subtitle }}
        </span>

        <h2 class="editorial-heading heading-xl inquiry-title">
          {{ block.title }}
        </h2>

        <p class="inquiry-lead">
          {{ block.body_content }}
        </p>

        <!-- Salons badges -->
        <div class="salons-list" v-if="config.salons && config.salons.length">
          <span v-for="salon in config.salons" :key="salon" class="salon-chip">
            {{ salon }}
          </span>
        </div>

        <div class="inquiry-actions">
          <BaseButton variant="gold" @click="$emit('open-booking')">
            <Calendar :size="16" />
            <span>Request Private Salon Appointment</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.inquiry-block {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 6rem 0;
  overflow: hidden;
}

.inquiry-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.inquiry-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inquiry-scrim {
  position: absolute;
  inset: 0;
  background: rgba(12, 12, 14, 0.75);
}

.inquiry-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.inquiry-card {
  max-width: 720px;
  padding: 3.5rem;
  text-align: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-gold);
  background: rgba(18, 18, 20, 0.85);
  box-shadow: var(--shadow-lg);
}

.inquiry-title {
  color: #FAF8F5;
  margin-bottom: 1.25rem;
}

.inquiry-lead {
  font-size: 1.05rem;
  color: rgba(250, 248, 245, 0.85);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-weight: 300;
}

.salons-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2.25rem;
}

.salon-chip {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-gold);
  background: rgba(197, 168, 128, 0.12);
  border: 1px solid var(--border-gold);
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-xs);
}

.inquiry-actions {
  display: flex;
  justify-content: center;
}
</style>
