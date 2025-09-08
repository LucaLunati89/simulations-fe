<template>
  <div v-if="!isLoading" class="content">
    <Button
      class="btn custom-btn"
      label="Torna alla lista"
      @click="$router.push('/employee-simulations')"
    />

    <!-- Employee -->
    <div>
      <EmployeeCard v-if="employee" :employee="employee" />
      <div v-else class="loading">Caricamento dipendente...</div>
    </div>

    <!-- Simulazione -->
    <div v-if="simulation">
      <SimulationCard
        class="simulation-card"
        :simulation="simulation"
        :baseCost="employee?.base_cost || 0"
        :totalDevicesCost="devicesTotalCost"
      />

      <h3>Dispositivi aggiunti alla simulazione:</h3>
      <SimulationDevices
        :devices="simulationDevices"
        @removeDevice="handleDeviceRemoved"
        @updateDeviceMonths="updateDeviceMonths"
      />

      <div class="devices-section">
        <h3>Dispositivi disponibili:</h3>
        <!-- ✅ CAMBIATO: usa @deviceAdded invece di :onDeviceAdded -->
        <DeviceTable
          :simulationId="simulation.id"
          :addedDeviceIds="simulationDevices.map((d) => d.device.id)"
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
  <div v-else class="loader-container">
    <div class="loader"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
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
  updateSimulationDevice,
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
    const isLoading = ref(false);

    // 🔧 helper per parsare stringhe numeriche
    const parseNumber = (value: string | number): number => {
      if (typeof value === "number") return value;
      if (!value) return 0;

      let s = value.trim();
      s = s
        .replace(/\u00A0/g, "")
        .replace(/\s+/g, "")
        .replace(/[€$£¥]/g, "");

      const lastDot = s.lastIndexOf(".");
      const lastComma = s.lastIndexOf(",");

      if (lastDot !== -1 && lastComma !== -1) {
        if (lastDot > lastComma) {
          s = s.replace(/,/g, "");
        } else {
          s = s.replace(/\./g, "").replace(/,/g, ".");
        }
      } else if (lastComma !== -1) {
        const decimals = s.length - lastComma - 1;
        if (decimals === 1 || decimals === 2) {
          s = s.replace(/,/g, ".");
        } else {
          s = s.replace(/,/g, "");
        }
      } else if (lastDot !== -1) {
        const decimals = s.length - lastDot - 1;
        if (!(decimals === 1 || decimals === 2)) {
          s = s.replace(/\./g, "");
        }
      }

      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };
    function parseAndFormat(value: string): string {
      // Rimuove la virgola usata come separatore delle migliaia
      const normalized = value.replace(/,/g, "");

      // Converte in numero
      const numberValue = parseFloat(normalized);

      if (isNaN(numberValue)) {
        throw new Error("Valore non valido");
      }

      // Restituisce il numero formattato in italiano
      return numberValue.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    // Carica dati iniziali
    onMounted(async () => {
      isLoading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 0.2));

        const response = await fetchEmployeeSimulationById(id.value);
        employee.value = response;
        response.gross_salary = parseAndFormat(response.gross_salary);
        response.base_cost = parseAndFormat(response.base_cost);

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
      } finally {
        isLoading.value = false;
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

    // Nel setup di EmployeeSimulationDetailPage
    const devicesTotalCost = computed(() => {
      return simulationDevices.value.reduce((acc, device) => {
        return acc + parseNumber(device.total_cost as any);
      }, 0);
    });

    const updateDeviceMonths = async (
      simDeviceId: number,
      newMonths: number
    ) => {
      console.log("🎯 updateDeviceMonths ricevuto nel padre:", {
        simDeviceId,
        newMonths,
      });

      if (!employee.value) return;

      // Limita il valore: minimo 1, massimo mesi contratto dipendente
      const months = Math.min(
        Math.max(newMonths, 1),
        employee.value.contract_months
      );

      console.log("🔄 Mesi dopo validazione:", months);

      try {
        console.log("🌐 Chiamando API updateSimulationDevice...");
        await updateSimulationDevice(simDeviceId, months);
        console.log("✅ API chiamata con successo");

        // Aggiorna localmente la lista dei dispositivi
        const device = simulationDevices.value.find(
          (d) => d.id === simDeviceId
        );
        if (device) {
          device.months = months;
          device.total_cost = device.device.monthly_cost * months;
          console.log("💾 Device aggiornato localmente:", device);
        }
      } catch (err) {
        console.error("❌ Errore nell'aggiornamento dei mesi:", err);
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
      isLoading,
      devicesTotalCost,
      updateDeviceMonths,
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

.custom-btn {
  margin-bottom: 20px;
}
/* AGGIUNTO: Container per centrare il loader */
.loader-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* AGGIUNTO: Stile del loader */
.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-black); /* Grigio più scuro per il base */
  border-top: 4px solid var(--color-yellow-primary); /* Nero per la parte che ruota */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
/* AGGIUNTO: Animazione di rotazione */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.simulation-card {
}
</style>
