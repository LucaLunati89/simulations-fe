<template>
  <div class="content">
    <Button class="btn" label="Torna alla lista" @click="$router.push('/')" />

    <!-- Employee -->
    <EmployeeCard v-if="employee" :employee="employee" />
    <div v-else class="loading">Caricamento dipendente...</div>

    <!-- Simulazione -->
    <div v-if="simulation">
      <SimulationCard :simulation="simulation" />

      <h3>Dispositivi aggiunti alla simulazione:</h3>
      <SimulationDevices
        :devices="simulationDevices"
        @removeDevice="handleDeviceRemoved"
      />

      <div class="devices-section">
        <h3>Dispositivi disponibili:</h3>
        <!-- ✅ CAMBIATO: usa @deviceAdded invece di :onDeviceAdded -->
        <DeviceTable
          :simulationId="simulation.id"
          @deviceAdded="handleDeviceAdded"
        />
      </div>
    </div>

    <!-- Creazione nuova simulazione -->
    <div v-else class="simulation-form">
      <h3>Crea nuova simulazione</h3>
      <input
        v-model="newSimulationName"
        type="text"
        placeholder="Nome simulazione"
      />
      <Button
        label="Crea simulazione"
        :disabled="isCreating"
        @click="createSimulation"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { EmployeeSimulation, Simulation } from "../api/types";
import type { SimulationDevice } from "../api/types";
import EmployeeCard from "../components/atomic/EmployeeCard.vue";
import SimulationCard from "../components/atomic/SimulationCard.vue";
import Button from "../components/atomic/Button.vue";
import DeviceTable from "../components/combined/DeviceTable.vue";
import SimulationDevices from "../components/combined/SimulationDevices.vue";
import { fetchEmployeeSimulationById } from "../api/employeeSimulation";
import { fetchEmployeeSimulations, createSimulation } from "../api/simulation";
import {
  fetchSimulationDevices,
  deleteSimulationDevice,
} from "../api/simulationDevice";

export default defineComponent({
  name: "EmployeeSimulationDetailPage",
  components: {
    EmployeeCard,
    SimulationCard,
    Button,
    DeviceTable,
    SimulationDevices,
  },
  setup() {
    const route = useRoute();
    const employee = ref<EmployeeSimulation | null>(null);
    const simulation = ref<Simulation | null>(null);
    const simulationsList = ref<Simulation[]>([]);
    const simulationDevices = ref<SimulationDevice[]>([]);
    const newSimulationName = ref("");
    const isCreating = ref(false);
    const id = ref<number>(+route.params.id);

    // Carica dati iniziali
    onMounted(async () => {
      try {
        const response = await fetchEmployeeSimulationById(id.value);
        employee.value = response;

        const simsResponse = await fetchEmployeeSimulations(id.value);
        simulationsList.value = simsResponse.results;

        if (simulationsList.value.length > 0) {
          simulation.value = simulationsList.value[0];
          simulationDevices.value = await fetchSimulationDevices(
            simulation.value.id
          );
        }
      } catch (error) {
        console.error("Errore nel fetch dei dettagli:", error);
      }
    });

    // Crea nuova simulazione
    const createSimulationHandler = async () => {
      if (isCreating.value) return;
      if (!newSimulationName.value) {
        alert("Inserisci un nome per la simulazione");
        return;
      }

      const exists = simulationsList.value.some(
        (sim) => sim.name === newSimulationName.value
      );
      if (exists) {
        alert("La simulazione esiste già");
        return;
      }

      isCreating.value = true;

      try {
        const newSim = await createSimulation(
          id.value,
          newSimulationName.value
        );
        simulation.value = newSim;
        simulationsList.value.push(newSim);
        newSimulationName.value = "";
        simulationDevices.value = [];
      } catch (err) {
        console.error("Errore nella creazione simulazione:", err);
      } finally {
        isCreating.value = false;
      }
    };
    // 🔍 Counter globale per tracciare gli handler
    let handleDeviceAddedCounter = 0;
    let handleDeviceRemovedCounter = 0;

    // Aggiungi device (ora riceve evento invece di callback)
    const handleDeviceAdded = async (device: SimulationDevice) => {
      handleDeviceAddedCounter++;
      console.log(
        `🟢 [${handleDeviceAddedCounter}] handleDeviceAdded chiamato`
      );
      console.log(`🟢 [${handleDeviceAddedCounter}] Device ricevuto:`, device);
      console.log(
        `🟢 [${handleDeviceAddedCounter}] simulationDevices prima:`,
        simulationDevices.value.length
      );
      console.trace(
        `🔍 Stack trace handleDeviceAdded #${handleDeviceAddedCounter}`
      );

      simulationDevices.value.push(device);
      console.log(
        `🟢 [${handleDeviceAddedCounter}] simulationDevices dopo:`,
        simulationDevices.value.length
      );
    };

    // rimuovi device
    const isDeletingDevice = ref(false);

    const handleDeviceRemoved = async (simulationDeviceId: number) => {
      if (isDeletingDevice.value) {
        console.log("🛑 Delete bloccata: operazione già in corso");
        return;
      }

      isDeletingDevice.value = true;

      try {
        await deleteSimulationDevice(simulationDeviceId);
        simulationDevices.value = simulationDevices.value.filter(
          (d) => d.id !== simulationDeviceId
        );
      } catch (err) {
        console.error("Errore nella rimozione:", err);
      } finally {
        setTimeout(() => {
          isDeletingDevice.value = false;
        }, 500);
      }
    };

    return {
      employee,
      simulation,
      simulationsList,
      simulationDevices,
      newSimulationName,
      isCreating,
      createSimulation: createSimulationHandler,
      handleDeviceAdded,
      handleDeviceRemoved,
    };
  },
});
</script>

<style scoped>
.content {
  padding-bottom: calc(var(--footer-height) + 20px);
  padding-top: calc(var(--header-height) + 20px);
  width: 90%;
  margin: 0 auto;
}

.loading {
  text-align: center;
  margin-top: 2rem;
  color: #555;
}

.simulation-form {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  background: #fff;
}

.simulation-form input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.devices-section {
  margin-top: 2rem;
}
</style>
