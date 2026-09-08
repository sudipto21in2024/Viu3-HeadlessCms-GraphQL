<script setup>
import { ref } from 'vue';
import { Sparkles, X } from 'lucide-vue-next';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Lookbook garment detail'
  },
  hotspots: {
    type: Array,
    default: () => []
  }
});

const activeHotspot = ref(null);

const selectHotspot = (hp) => {
  activeHotspot.value = activeHotspot.value?.id === hp.id ? null : hp;
};

const closeHotspot = () => {
  activeHotspot.value = null;
};
</script>

<template>
  <div class="hotspot-viewer">
    <div class="image-stage">
      <img :src="imageUrl" :alt="alt" class="base-image" />

      <!-- Interactive Pins -->
      <div
        v-for="hp in hotspots"
        :key="hp.id"
        class="hotspot-pin"
        :style="{ left: `${hp.x}%`, top: `${hp.y}%` }"
        @click.stop="selectHotspot(hp)"
        :title="hp.title"
      >
        <span class="hotspot-ring"></span>
        <span class="hotspot-dot"></span>
      </div>

      <!-- Popover Detail Drawer -->
      <transition name="popover">
        <div
          v-if="activeHotspot"
          class="hotspot-popover glass-panel"
          :style="{
            left: `${Math.min(Math.max(activeHotspot.x, 20), 80)}%`,
            top: `${activeHotspot.y > 60 ? activeHotspot.y - 20 : activeHotspot.y + 15}%`
          }"
        >
          <div class="popover-header">
            <div class="popover-badge">
              <Sparkles :size="12" />
              <span>ATELIER CRAFT DETAIL</span>
            </div>
            <button class="popover-close" @click.stop="closeHotspot" aria-label="Close detail">
              <X :size="14" />
            </button>
          </div>

          <h4 class="popover-title">{{ activeHotspot.title }}</h4>
          <p class="popover-desc">{{ activeHotspot.detail }}</p>
        </div>
      </transition>
    </div>

    <div class="hotspot-instructions" v-if="hotspots && hotspots.length">
      <Sparkles :size="14" class="hint-icon" />
      <span>Click on golden radiant pins to inspect master tailoring & craftsmanship</span>
    </div>
  </div>
</template>

<style scoped>
.hotspot-viewer {
  position: relative;
  display: flex;
  flex-direction: column;
}

.image-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-md);
}

.base-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Popover card */
.hotspot-popover {
  position: absolute;
  transform: translate(-50%, 0);
  width: min(320px, 90vw);
  padding: 1.25rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-gold);
  z-index: 30;
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.popover-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.popover-close {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.popover-close:hover {
  color: var(--text-primary);
}

.popover-title {
  font-size: 1.15rem;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 0.45rem;
  line-height: 1.2;
}

.popover-desc {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.hotspot-instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 0;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.hint-icon {
  color: var(--accent-gold);
}

.popover-enter-active, .popover-leave-active {
  transition: all 0.25s ease-out;
}
.popover-enter-from, .popover-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
