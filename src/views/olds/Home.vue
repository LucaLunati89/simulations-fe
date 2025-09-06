<template>
  <div :class="styles.content">
    <div :class="styles.searchcard" class="card">
      <h2>Carica simulazione di un dipendente:</h2>
      <p>
        Inserisci l'ID di una delle simulazioni che hai fatto per un tuo
        dipendente
      </p>
      <div class="row" style="margin-top: 12px">
        <input
          class="input"
          type="number"
          v-model.number="simulationId"
          placeholder="Enter simulation ID"
        />
        <button class="btn btn-primary" @click="loadSimulation">Load</button>
      </div>

      <!-- Popup errore -->
      <div v-if="showError" class="popup-backdrop">
        <div class="popup">
          <p>{{ errorTitle }}</p>
          <p>{{ errorMessage }}</p>
          <button class="btn btn-primary" @click="showError = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { findEmployeeSimulationById } from "../api/simulation";
import styles from "../css-modules/Simulation.module.css";

const simulationId = ref<number | null>(null);
const showError = ref(false);
const errorMessage = ref("");
const errorTitle = ref("");
const router = useRouter();

async function loadSimulation() {
  try {
    if (!simulationId.value) return;
    await findEmployeeSimulationById(simulationId.value); // controllo che esista
    router.push(`/simulation/${simulationId.value}`); // vai alla pagina Simulation
  } catch {
    errorTitle.value = "ATTENZIONE:";
    errorMessage.value = "Simulazione non trovata";
    showError.value = true;
  }
}
</script>
