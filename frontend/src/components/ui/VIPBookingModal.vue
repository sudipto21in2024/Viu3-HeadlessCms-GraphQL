<script setup>
import { reactive, ref } from 'vue';
import { useMutation } from '../../composables/useGraphQL.js';
import { REQUEST_PRIVATE_VIEWING } from '../../graphql/mutations.js';
import { X, Check, Sparkles, Calendar, MapPin, ShieldCheck } from 'lucide-vue-next';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialSalon: {
    type: String,
    default: 'Paris Vendôme'
  }
});

const emit = defineEmits(['close']);

const form = reactive({
  client_name: '',
  client_email: '',
  client_phone: '',
  preferred_salon: props.initialSalon,
  preferred_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  interest_category: 'Haute Couture Outerwear',
  special_requests: ''
});

const bookingSuccess = ref(null);
const { mutate, loading, error } = useMutation(REQUEST_PRIVATE_VIEWING);

const handleSubmit = async () => {
  try {
    const res = await mutate({
      input: {
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        preferred_salon: form.preferred_salon,
        preferred_date: form.preferred_date,
        interest_category: form.interest_category,
        special_requests: form.special_requests
      }
    });
    bookingSuccess.value = res.requestPrivateViewing;
  } catch (err) {
    // Handled in composable
  }
};

const handleClose = () => {
  bookingSuccess.value = null;
  emit('close');
};
</script>

<template>
  <transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="handleClose">
      <div class="modal-dialog glass-panel">
        <!-- Close Button -->
        <button class="modal-close-btn" @click="handleClose" aria-label="Close modal">
          <X :size="20" />
        </button>

        <!-- Form State -->
        <div v-if="!bookingSuccess" class="modal-content">
          <div class="modal-header">
            <span class="eyebrow">
              <Sparkles :size="12" style="display:inline; margin-right:4px;" />
              VIP SALON CONCIERGE
            </span>
            <h2 class="editorial-heading heading-lg">Reserve Private Salon Viewing</h2>
            <p class="modal-subtitle">
              Experience an intimate fitting and bespoke presentation in our private architectural salons.
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="booking-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input
                  v-model="form.client_name"
                  type="text"
                  required
                  placeholder="e.g. Lady Vivienne Westwood"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input
                  v-model="form.client_email"
                  type="email"
                  required
                  placeholder="e.g. client@domain.com"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Preferred Salon *</label>
                <select v-model="form.preferred_salon" class="form-select" required>
                  <option value="Paris Vendôme">Paris — 14 Rue du Faubourg Saint-Honoré</option>
                  <option value="Geneva Rhône">Geneva — 8 Rue du Rhône</option>
                  <option value="London Mayfair">London — 22 New Bond Street</option>
                  <option value="Tokyo Ginza">Tokyo — 5-7-22 Minami-Aoyama</option>
                  <option value="New York Madison">New York — 740 Madison Avenue</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Preferred Date *</label>
                <input
                  v-model="form.preferred_date"
                  type="date"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Telephone / WhatsApp</label>
                <input
                  v-model="form.client_phone"
                  type="tel"
                  placeholder="+33 1 42 68 00 00"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Department of Interest</label>
                <select v-model="form.interest_category" class="form-select">
                  <option value="Haute Couture Outerwear">Haute Couture & Tailoring</option>
                  <option value="Haute Horlogerie">Haute Horlogerie & Grand Complications</option>
                  <option value="High Jewellery">High Jewellery & Rare Gemstones</option>
                  <option value="Leathercraft & Sculptures">Bespoke Maroquinerie</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Special Requests / Sizing & Muse Notes</label>
              <textarea
                v-model="form.special_requests"
                rows="2"
                placeholder="Mention specific lookbook numbers or champagne preferences..."
                class="form-textarea"
              ></textarea>
            </div>

            <div v-if="error" class="form-error">
              {{ error }}
            </div>

            <div class="form-footer">
              <div class="security-note">
                <ShieldCheck :size="14" class="gold-icon" />
                <span>Encrypted transmission to Headless CMS GraphQL backend</span>
              </div>
              <BaseButton variant="primary" :loading="loading" type="submit">
                Confirm Private Viewing
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Success Confirmation State -->
        <div v-else class="booking-success-card">
          <div class="success-icon-badge">
            <Check :size="28" />
          </div>
          <span class="eyebrow">APPOINTMENT CONFIRMED</span>
          <h2 class="editorial-heading heading-lg">Merci, {{ bookingSuccess.client_name }}</h2>
          <p class="success-text">
            {{ bookingSuccess.message }}
          </p>

          <div class="appointment-summary">
            <div class="summary-item">
              <MapPin :size="16" class="gold-icon" />
              <span><strong>Salon:</strong> {{ bookingSuccess.preferred_salon }}</span>
            </div>
            <div class="summary-item">
              <Calendar :size="16" class="gold-icon" />
              <span><strong>Date:</strong> {{ bookingSuccess.preferred_date }}</span>
            </div>
            <div class="summary-item">
              <Sparkles :size="16" class="gold-icon" />
              <span><strong>Reference:</strong> #{{ bookingSuccess.id }}</span>
            </div>
          </div>

          <BaseButton variant="gold" @click="handleClose" style="width: 100%">
            Return to Editorial
          </BaseButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(12, 12, 14, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1000;
}

.modal-dialog {
  position: relative;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  border: 1px solid var(--border-gold);
  box-shadow: var(--shadow-lg);
}

.modal-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.modal-close-btn:hover {
  color: var(--text-primary);
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-subtitle {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.5;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 600px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.form-input, .form-select, .form-textarea {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  color: var(--text-primary);
  transition: border-color var(--transition-fast);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-subtle);
}

@media (min-width: 600px) {
  .form-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.security-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.gold-icon {
  color: var(--accent-gold);
}

.form-error {
  font-size: 0.82rem;
  color: #D9534F;
  padding: 0.5rem 0.75rem;
  background: rgba(217, 83, 79, 0.1);
  border-radius: var(--radius-xs);
}

/* Success Card */
.booking-success-card {
  text-align: center;
  padding: 1.5rem 0;
}

.success-icon-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: var(--accent-gold-light);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-gold);
}

.success-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 480px;
  margin: 0.75rem auto 2rem;
}

.appointment-summary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
  font-size: 0.86rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
