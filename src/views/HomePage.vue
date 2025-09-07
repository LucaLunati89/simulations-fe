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
              <li>1) Seleziona una la simulazione di un dipendente</li>
              <li>2) Aggiungi i costi dei dispositivi alla simulazione</li>
              <li>3) Visualizza immediatamente i costi totali integrati</li>
            </ul>
          </div>

          <div class="cta-section">
            <Button
              class="primary-btn"
              label="Prova Ora"
              @click="$router.push('/employee-simulations/')"
            />
          </div>
        </div>

        <!--         <div class="image-content">
          <div class="mockup-placeholder">
            <div class="mockup-icon">📊</div>
            <span>Simulazione Costi</span>
          </div>
        </div> -->
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "../components/atomic/Button.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    Button,
  },
});
</script>

<style scoped>
.hero-main {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.wrapper {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--gap);
  width: 100%;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.text-content {
  flex: 0 0 60%;
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

/* .steps-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2rem;
  width: 0.2rem;
  height: 0.2rem;
  background: var(--color-black);
  border-radius: 50%;
  transform: translateY(-50%);
} */

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

.image-content {
  flex: 0 0 35%;
  max-width: 35%;
  text-align: center;
}

.mockup-placeholder {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  padding: 3rem 2rem;
  box-shadow: var(--shadow-1);
  border: var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 300px;
  justify-content: center;
}

.mockup-icon {
  font-size: 4rem;
  color: var(--color-yellow-primary);
}

.mockup-placeholder span {
  font-size: 1.125rem;
  color: var(--color-grey-medium);
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }

  .text-content,
  .image-content {
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

  .mockup-placeholder {
    padding: 2rem 1rem;
    min-height: 200px;
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
}
</style>
