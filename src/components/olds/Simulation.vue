<template>
  <div :class="styles.content">
    <!-- Search Simulation -->
    <div class="card" :class="styles.searchcard" v-if="!employeeSimulation">
      <h2>Carica simulazione di un dipendente:</h2>
      <p>
        Inserisci l'ID di una delle simulazioni che hai fatto per un tuo
        dipendente
      </p>
      <div class="row" style="margin-top: 12px">
        <input
          class="input"
          type="string"
          v-model.number="simulationId"
          placeholder="Enter simulation ID"
        />
        <Button
          label="Carica"
          variant="primary"
          size="large"
          @click="loadSimulation"
          >Load</Button
        >
      </div>
    </div>

    <!-- Employee info + devices -->
    <div v-else>
      <EmployeeCard :employeeSimulation="employeeSimulation" />
      <DeviceList
        :devices="devices"
        :selectedDevices="simulationDevices"
        @add-device="addDevice"
      />
      <SelectedDevices
        :simulationDevices="simulationDevices"
        @update-device="updateDevice"
        @remove-device="removeDevice"
      />
    </div>

    <!-- Totals sidebar -->
    <SimulationTotal
      v-if="employeeSimulation"
      :employeeSimulation="employeeSimulation"
      :simulationDevices="simulationDevices"
    />

    <!-- Popup errore -->
    <div v-if="showError" class="popup-backdrop">
      <div class="popup">
        <p>{{ errorTitle }}</p>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary" @click="showError = false">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "../css-modules/Simulation.module.css";
import { ref } from "vue";
import EmployeeCard from "./EmployeeCard.vue";
import DeviceList from "./DeviceList.vue";
import SelectedDevices from "./SelectedDevices.vue";
import SimulationTotal from "./SimulationTotal.vue";
import { getAllDevices } from "../../api/devices";
import { findEmployeeSimulationById } from "../../api/simulation";
import {
  getSimulationDevices,
  addSimulationDevice,
  updateSimulationDevice,
  deleteSimulationDevice,
} from "../../api/simulationDevice";
import type {
  EmployeeSimulation,
  Device,
  SimulationDevice,
} from "../../api/types";
import Button from "./Button.vue";

const simulationId = ref<number | null>(null);
const employeeSimulation = ref<EmployeeSimulation | null>(null);
const devices = ref<Device[]>([]);
const simulationDevices = ref<SimulationDevice[]>([]);
const showError = ref(false);
const errorMessage = ref("");
const errorTitle = ref("");

async function loadSimulation() {
  try {
    if (!simulationId.value) return;
    employeeSimulation.value = await findEmployeeSimulationById(
      simulationId.value
    );
    devices.value = await getAllDevices();
    simulationDevices.value = await getSimulationDevices(simulationId.value);
  } catch {
    errorTitle.value = "ATTENZIONE:";
    errorMessage.value = "Simulazione non trovata";
    showError.value = true;
  }
}

async function addDevice(deviceId: number) {
  if (!employeeSimulation.value) return;
  const exists = simulationDevices.value.find((d) => d.device.id === deviceId);
  if (exists) {
    errorTitle.value = "ATTENZIONE:";
    errorMessage.value = "Device già aggiunto";
    showError.value = true;
    return;
  }
  const added = await addSimulationDevice(
    employeeSimulation.value.simulation,
    deviceId
  );
  simulationDevices.value.push(added);
}

async function updateDevice(deviceId: number, months: number) {
  const simDevice = simulationDevices.value.find(
    (d) => d.device.id === deviceId
  );
  if (!simDevice) return;
  const updated = await updateSimulationDevice(simDevice.id, months);
  const idx = simulationDevices.value.findIndex((d) => d.id === updated.id);
  if (idx !== -1) simulationDevices.value[idx] = updated;
}

async function removeDevice(deviceId: number) {
  const simDevice = simulationDevices.value.find(
    (d) => d.device.id === deviceId
  );
  if (!simDevice) return;
  await deleteSimulationDevice(simDevice.id);
  simulationDevices.value = simulationDevices.value.filter(
    (d) => d.id !== simDevice.id
  );
}
</script>
