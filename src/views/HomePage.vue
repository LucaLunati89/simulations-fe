<template>
  <main class="hero-main">
    <div class="wrapper">
      <div class="hero-content">
        <div class="text-content">
          <h1 class="hero-title">
            Calcolo integrato dei costi dipendenti e device
          </h1>

          <div class="hero-description">
            <p>
              Questo tool consente di stimare rapidamente il costo totale di un
              dipendente, combinando la simulazione del suo costo aziendale con
              l'eventuale utilizzo di dispositivi e strumenti necessari:
            </p>

            <ul class="steps-list">
              <li>1) Seleziona una simulazione di un dipendente</li>
              <li>2) Aggiungi i costi dei dispositivi alla simulazione</li>
              <li>3) Visualizza immediatamente i costi totali integrati</li>
            </ul>
          </div>

          <div class="cta-section">
            <Button
              class="primary-btn"
              label="Prova Ora"
              @click="showWarningBanner = true"
            />
          </div>
        </div>
        <div class="hero-image">
          <img src="../assets/mock.png" alt="Illustrazione Hero" />
        </div>
      </div>
    </div>

    <!-- Warning Banner Modal -->
    <div
      v-if="showWarningBanner"
      class="modal-overlay"
      @click="handleOverlayClick"
    >
      <div class="warning-banner" @click.stop>
        <div class="banner-header">
          <div class="warning-icon">⚠️</div>
          <h3>Nota importante</h3>
          <button
            class="close-btn"
            @click="showWarningBanner = false"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div class="banner-content">
          <p>
            Il server è ospitato su un piano gratuito di Render: se non viene
            utilizzato per circa 15 minuti, viene messo in pausa
            automaticamente.
          </p>
          <p>
            Al successivo accesso può essere necessario attendere
            <strong>1–2 minuti</strong> per il riavvio dei servizi BE.
          </p>
        </div>

        <div class="banner-actions">
          <button class="secondary-btn" @click="showWarningBanner = false">
            Annulla
          </button>
          <button class="primary-btn" @click="proceedToSimulations">
            Ho capito, procedi
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "../components/atomic/Button.vue";
import { getAllDevices } from "../api/devices";
export default defineComponent({
  name: "HomePage",
  components: {
    Button,
  },
  data() {
    return {
      showWarningBanner: false,
    };
  },
  async mounted() {
    // Wake-up call per il server Render
    getAllDevices().catch(() => {
      // Ignora errori, serve solo per riattivare il server
    });
  },
  methods: {
    proceedToSimulations() {
      this.showWarningBanner = false;
      this.$router.push("/employee-simulations/");
    },
    handleOverlayClick() {
      this.showWarningBanner = false;
    },
  },
});
</script>

<style scoped>
.hero-main {
  min-height: 80vh;
  display: flex;
  align-items: center;
  margin: 0 auto;
}

.wrapper {
  max-width: var(--container-max);
  margin: 0 2rem;
  /*padding: 0 2rem;*/
  width: 100%;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.text-content {
  flex: 0 0 50%;
  max-width: 60%;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  margin-bottom: 2rem;
}

.hero-description p {
  font-size: 1.125rem;
  color: var(--color-grey-medium);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: var(--color-grey-dark);
  line-height: 1.5;
}

.steps-list li:last-child {
  margin-bottom: 0;
}

.cta-section {
  margin-top: 2.5rem;
}

.primary-btn {
  background: var(--color-black);
  color: var(--color-white);
  border: none;
  padding: 16px 32px;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition), transform 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.primary-btn:hover {
  transform: translateY(-2px);
  background-color: var(--color-yellow-primary);
  color: var(--color-black);
  box-shadow: var(--shadow-1);
}

.primary-btn:active {
  transform: translateY(0);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.warning-banner {
  background: white;
  border-radius: var(--card-radius, 12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.banner-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  gap: 0.75rem;
  position: relative;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.banner-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-black, #000);
  margin: 0;
  flex-grow: 1;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-grey-medium, #666);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.banner-content {
  padding: 1rem 1.5rem;
}

.banner-content p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--color-grey-dark, #333);
}

.banner-content p:last-child {
  margin-bottom: 0;
}

.banner-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.secondary-btn {
  background: transparent;
  color: var(--color-grey-dark, #333);
  border: 1px solid var(--color-grey-light, #ddd);
  padding: 12px 24px;
  border-radius: var(--border-radius, 8px);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition, all 0.2s ease);
}

.secondary-btn:hover {
  background: var(--color-grey-light, #f5f5f5);
}

.banner-actions .primary-btn {
  margin: 0;
  padding: 12px 24px;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }

  .text-content {
    flex: none;
    max-width: 100%;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description p {
    font-size: 1rem;
  }

  .steps-list {
    text-align: left;
    display: inline-block;
  }

  .banner-actions {
    flex-direction: column-reverse;
  }

  .banner-actions .primary-btn,
  .banner-actions .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .primary-btn {
    padding: 14px 24px;
    font-size: 0.95rem;
    width: 100%;
  }

  .hero-content {
    gap: 1.5rem;
  }

  .modal-overlay {
    padding: 1rem 0.5rem;
  }

  .banner-header,
  .banner-content,
  .banner-actions {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.hero-image {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}
</style>
