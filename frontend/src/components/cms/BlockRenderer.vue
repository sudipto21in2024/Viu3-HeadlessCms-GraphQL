<script setup>
import { computed } from 'vue';
import HeroEditorialBlock from './HeroEditorialBlock.vue';
import CraftStoryBlock from './CraftStoryBlock.vue';
import LookbookGridBlock from './LookbookGridBlock.vue';
import CuratedReelBlock from './CuratedReelBlock.vue';
import BespokeInquiryBlock from './BespokeInquiryBlock.vue';

const props = defineProps({
  blocks: {
    type: Array,
    default: () => []
  }
});

defineEmits(['open-booking']);

// Dynamic component registry mapping CMS BlockType to Vue Component
const componentMap = {
  HeroEditorialBlock,
  CraftStoryBlock,
  LookbookGridBlock,
  CuratedReelBlock,
  BespokeInquiryBlock
};

const sortedBlocks = computed(() => {
  return [...props.blocks].sort((a, b) => a.sort_order - b.sort_order);
});
</script>

<template>
  <div class="cms-page-blocks">
    <template v-for="block in sortedBlocks" :key="block.id">
      <component
        :is="componentMap[block.block_type]"
        v-if="componentMap[block.block_type]"
        :block="block"
        @open-booking="$emit('open-booking')"
      />

      <!-- Fallback for unknown block types in CMS -->
      <div v-else class="cms-block-fallback page-container">
        <p class="fallback-note">
          <strong>[CMS Dynamic Block: {{ block.block_type }}]</strong>
          <span>{{ block.title }}</span>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cms-page-blocks {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.cms-block-fallback {
  padding: 2rem 0;
  text-align: center;
}

.fallback-note {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--bg-secondary);
  border: 1px dashed var(--border-medium);
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
