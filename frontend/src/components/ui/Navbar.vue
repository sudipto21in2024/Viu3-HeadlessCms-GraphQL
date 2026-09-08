<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '../../composables/useTheme.js';
import { Search, Sun, Moon, Sparkles, Menu, X } from 'lucide-vue-next';
import BaseButton from './BaseButton.vue';

const emit = defineEmits(['open-search', 'open-booking']);
const { currentTheme, toggleTheme } = useTheme();
const route = useRoute();

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <header :class="['navbar-wrapper', { 'is-scrolled': isScrolled }]">
    <div class="page-container navbar-inner">
      <!-- Left: Mobile Menu Toggle & Main Nav -->
      <div class="nav-left">
        <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
          <Menu v-if="!mobileMenuOpen" :size="20" />
          <X v-else :size="20" />
        </button>

        <nav class="desktop-nav">
          <RouterLink to="/collections" class="nav-link" :class="{ 'is-active': route.path.startsWith('/collections') }">
            Collections
          </RouterLink>
          <RouterLink to="/artisans" class="nav-link" :class="{ 'is-active': route.path === '/artisans' }">
            Atelier & Lineage
          </RouterLink>
          <RouterLink to="/collections/automne-hiver-2026" class="nav-link">
            Lookbook
          </RouterLink>
        </nav>
      </div>

      <!-- Center: Brand Wordmark -->
      <div class="nav-brand">
        <RouterLink to="/" class="brand-link" @click="closeMobileMenu">
          <span class="brand-title">MAISON AURA</span>
          <span class="brand-sub">PARIS • HAUTE COUTURE</span>
        </RouterLink>
      </div>

      <!-- Right: Search, Theme Toggle & VIP Salon CTA -->
      <div class="nav-right">
        <button class="icon-btn" @click="$emit('open-search')" title="Search Lookbook & Collections" aria-label="Search">
          <Search :size="18" />
        </button>

        <button class="icon-btn" @click="toggleTheme" :title="currentTheme === 'theme-alabaster' ? 'Night Runway (Dark)' : 'Alabaster Light'" aria-label="Toggle Theme">
          <Moon v-if="currentTheme === 'theme-alabaster'" :size="18" />
          <Sun v-else :size="18" />
        </button>

        <BaseButton variant="outline" class="vip-btn" @click="$emit('open-booking')">
          <Sparkles :size="14" />
          <span>Private Salon</span>
        </BaseButton>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <transition name="drawer">
      <div v-if="mobileMenuOpen" class="mobile-drawer glass-panel">
        <nav class="mobile-nav-links">
          <RouterLink to="/" class="mobile-link" @click="closeMobileMenu">
            Editorial Flagship
          </RouterLink>
          <RouterLink to="/collections" class="mobile-link" @click="closeMobileMenu">
            Collections & Haute Horlogerie
          </RouterLink>
          <RouterLink to="/artisans" class="mobile-link" @click="closeMobileMenu">
            Master Artisans & Lineage
          </RouterLink>
          <RouterLink to="/collections/automne-hiver-2026" class="mobile-link" @click="closeMobileMenu">
            Digital Lookbook N°01
          </RouterLink>
          <div class="mobile-drawer-footer">
            <BaseButton variant="primary" style="width: 100%" @click="closeMobileMenu(); $emit('open-booking');">
              Book Private Salon Viewing
            </BaseButton>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all var(--transition-medium);
  padding: 1.25rem 0;
  background: transparent;
}

.navbar-wrapper.is-scrolled {
  padding: 0.85rem 0;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
}

.nav-right {
  justify-content: flex-end;
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 900px) {
  .desktop-nav {
    display: flex;
  }
  .mobile-toggle {
    display: none;
  }
}

.nav-link {
  font-size: 0.76rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  position: relative;
  padding: 0.25rem 0;
}

.nav-link:hover, .nav-link.is-active {
  color: var(--accent-gold);
}

.nav-link.is-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--accent-gold);
}

/* Brand Wordmark */
.nav-brand {
  text-align: center;
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: var(--text-primary);
  line-height: 1;
}

.brand-sub {
  font-size: 0.58rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-top: 0.25rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  color: var(--accent-gold);
  background: var(--accent-gold-light);
}

.mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  padding: 0.5rem;
}

.vip-btn {
  display: none;
}

@media (min-width: 680px) {
  .vip-btn {
    display: inline-flex;
    padding: 0.6rem 1.1rem;
    font-size: 0.72rem;
  }
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  padding: 2.5rem 2rem;
  border-bottom: 1px solid var(--border-medium);
  box-shadow: var(--shadow-lg);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-link {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.mobile-link:hover {
  color: var(--accent-gold);
}

.mobile-drawer-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

.drawer-enter-active, .drawer-leave-active {
  transition: all 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
