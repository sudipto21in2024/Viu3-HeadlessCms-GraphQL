<script setup>
import { ref } from 'vue';
import { useMutation } from '../../composables/useGraphQL.js';
import { SUBSCRIBE_EDITORIAL } from '../../graphql/mutations.js';
import { ArrowRight, Check } from 'lucide-vue-next';

const email = ref('');
const subscribed = ref(false);
const { mutate, loading, error } = useMutation(SUBSCRIBE_EDITORIAL);

const handleSubscribe = async () => {
  if (!email.value || !email.value.includes('@')) return;
  try {
    await mutate({ email: email.value });
    subscribed.value = true;
    email.value = '';
  } catch (err) {
    // Handled in composable
  }
};
</script>

<template>
  <footer class="footer-wrapper">
    <div class="page-container footer-inner">
      <!-- Top Section: Brand Statement & Newsletter -->
      <div class="footer-top">
        <div class="footer-statement">
          <span class="eyebrow">THE MAISON PHILOSOPHY</span>
          <h2 class="editorial-heading heading-lg footer-quote">
            “Craft is the quiet conversation between time, patience, and the touch of human mastery.”
          </h2>
          <p class="footer-desc">
            Headless CMS Demonstration powered by Vue 3, GraphQL, and Node.js SQLite backend.
          </p>
        </div>

        <div class="footer-newsletter">
          <span class="eyebrow">GAZETTE ÉDITORIALE</span>
          <p class="newsletter-sub">
            Receive private seasonal previews, atelier monographs, and private salon invitations.
          </p>

          <form v-if="!subscribed" class="newsletter-form" @submit.prevent="handleSubscribe">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email address..."
              required
              class="newsletter-input"
            />
            <button type="submit" class="newsletter-submit" :disabled="loading" aria-label="Subscribe">
              <span v-if="loading" class="spinner"></span>
              <ArrowRight v-else :size="18" />
            </button>
          </form>

          <div v-else class="subscribe-success">
            <Check :size="16" class="check-icon" />
            <span>You are now inscribed into the Maison Aura Gazette.</span>
          </div>

          <span v-if="error" class="error-msg">{{ error }}</span>
        </div>
      </div>

      <!-- Middle: Salon Locations & Directory -->
      <div class="footer-grid">
        <div class="grid-col">
          <h4 class="col-title">PRIVATE SALONS</h4>
          <ul class="col-list">
            <li><strong>Paris:</strong> 14 Rue du Faubourg Saint-Honoré</li>
            <li><strong>Geneva:</strong> 8 Rue du Rhône, 1204 Genève</li>
            <li><strong>London:</strong> 22 New Bond Street, Mayfair</li>
            <li><strong>Tokyo:</strong> 5-7-22 Minami-Aoyama, Minato-ku</li>
            <li><strong>New York:</strong> 740 Madison Avenue, NY</li>
          </ul>
        </div>

        <div class="grid-col">
          <h4 class="col-title">COLLECTIONS</h4>
          <ul class="col-list">
            <li><RouterLink to="/collections/automne-hiver-2026">Automne-Hiver 2026</RouterLink></li>
            <li><RouterLink to="/collections/le-meridien-celeste">Haute Horlogerie Céleste</RouterLink></li>
            <li><RouterLink to="/collections/cuir-dombre-sculpture">Maroquinerie & Sculptures</RouterLink></li>
            <li><RouterLink to="/collections">All Seasonal Archives</RouterLink></li>
          </ul>
        </div>

        <div class="grid-col">
          <h4 class="col-title">ATELIER CRAFT</h4>
          <ul class="col-list">
            <li><RouterLink to="/artisans">Master Drapery Lineage</RouterLink></li>
            <li><RouterLink to="/artisans">Flying Tourbillon Movements</RouterLink></li>
            <li><RouterLink to="/artisans">Saddle-Stitch Leathercraft</RouterLink></li>
            <li><RouterLink to="/artisans">Materials & Provenance</RouterLink></li>
          </ul>
        </div>

        <div class="grid-col">
          <h4 class="col-title">HEADLESS ARCHITECTURE</h4>
          <ul class="col-list tech-specs">
            <li><strong>Frontend:</strong> Vue 3 + Composition API</li>
            <li><strong>API Engine:</strong> Apollo GraphQL Server</li>
            <li><strong>CMS Database:</strong> SQLite (WAL Mode)</li>
            <li><strong>Data Modeling:</strong> Dynamic Page Blocks</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar: Legal & Signature -->
      <div class="footer-bottom">
        <div class="brand-signature">
          <span class="font-serif">MAISON AURA</span>
          <span class="copy-text">© 2026 Maison Aura Haute Couture & Haute Horlogerie. All rights reserved.</span>
        </div>
        <div class="legal-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Craftsmanship</a>
          <a href="#governance">Provenance Disclosures</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  padding: 6rem 0 3rem;
  color: var(--text-primary);
  margin-top: 6rem;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--border-subtle);
}

@media (min-width: 992px) {
  .footer-top {
    grid-template-columns: 1.3fr 1fr;
    gap: 5rem;
  }
}

.footer-quote {
  font-size: clamp(1.4rem, 2vw, 1.85rem);
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.35;
}

.footer-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.newsletter-sub {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-medium);
  transition: border-color var(--transition-fast);
}

.newsletter-form:focus-within {
  border-color: var(--accent-gold);
}

.newsletter-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.85rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

.newsletter-input::placeholder {
  color: var(--text-muted);
}

.newsletter-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-gold);
  padding: 0.5rem;
  transition: transform var(--transition-fast);
}

.newsletter-submit:hover {
  transform: translateX(4px);
}

.subscribe-success {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--accent-gold);
  padding: 0.75rem 0;
}

.error-msg {
  display: block;
  font-size: 0.78rem;
  color: #D9534F;
  margin-top: 0.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2.5rem;
  padding: 4rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.col-title {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: 1.25rem;
}

.col-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.84rem;
  color: var(--text-secondary);
}

.col-list a {
  transition: color var(--transition-fast);
}

.col-list a:hover {
  color: var(--accent-gold);
}

.tech-specs strong {
  color: var(--text-primary);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2.5rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.brand-signature {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-signature span.font-serif {
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: var(--text-primary);
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-links a:hover {
  color: var(--accent-gold);
}
</style>
