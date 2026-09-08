<script setup>
import { ref } from 'vue';
import Navbar from './components/ui/Navbar.vue';
import Footer from './components/ui/Footer.vue';
import SearchDrawer from './components/ui/SearchDrawer.vue';
import VIPBookingModal from './components/ui/VIPBookingModal.vue';

const isSearchOpen = ref(false);
const isBookingOpen = ref(false);

const openSearch = () => {
  isSearchOpen.value = true;
};

const closeSearch = () => {
  isSearchOpen.value = false;
};

const openBooking = () => {
  isBookingOpen.value = true;
};

const closeBooking = () => {
  isBookingOpen.value = false;
};
</script>

<template>
  <div class="app-layout">
    <Navbar
      @open-search="openSearch"
      @open-booking="openBooking"
    />

    <main class="main-content">
      <router-view
        v-slot="{ Component }"
        @open-booking="openBooking"
      >
        <transition name="page-fade" mode="out-in">
          <component :is="Component" @open-booking="openBooking" />
        </transition>
      </router-view>
    </main>

    <Footer />

    <!-- Modals & Drawers -->
    <SearchDrawer
      :show="isSearchOpen"
      @close="closeSearch"
    />

    <VIPBookingModal
      :show="isBookingOpen"
      @close="closeBooking"
    />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
