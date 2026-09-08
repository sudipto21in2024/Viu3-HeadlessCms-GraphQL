<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'gold', 'outline', 'ghost'].includes(v)
  },
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="['btn', `btn-${variant}`, { 'is-loading': loading }]"
  >
    <slot />
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="['btn', `btn-${variant}`, { 'is-loading': loading }]"
  >
    <slot />
  </a>

  <button
    v-else
    :class="['btn', `btn-${variant}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<style scoped>
.is-loading {
  opacity: 0.7;
  cursor: wait;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
