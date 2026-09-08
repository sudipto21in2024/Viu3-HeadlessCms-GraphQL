import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CollectionsView from '../views/CollectionsView.vue';
import LookDetailView from '../views/LookDetailView.vue';
import ArtisansView from '../views/ArtisansView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'MAISON AURA — Flagship Editorial' }
  },
  {
    path: '/collections',
    name: 'collections',
    component: CollectionsView,
    meta: { title: 'Collections & Haute Horlogerie — MAISON AURA' }
  },
  {
    path: '/collections/:slug',
    name: 'collection-detail',
    component: CollectionsView,
    meta: { title: 'Seasonal Collection — MAISON AURA' }
  },
  {
    path: '/look/:id',
    name: 'look-detail',
    component: LookDetailView,
    meta: { title: 'Lookbook Archive — MAISON AURA' }
  },
  {
    path: '/artisans',
    name: 'artisans',
    component: ArtisansView,
    meta: { title: 'Master Artisans & Lineage — MAISON AURA' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page Not Found — MAISON AURA' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title;
  }
});

export default router;
