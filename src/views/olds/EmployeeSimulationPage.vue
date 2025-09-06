<template>
  <div :class="styles.content" v-if="employeeSimulation">
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
    <SimulationTotal
      :employeeSimulation="employeeSimulation"
      :simulationDevices="simulationDevices"
    />
  </div>
</template>

<script setup lang="ts">
import styles from "../css-modules/Simulation.module.css";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import EmployeeCard from "../components/EmployeeCard.vue";
import DeviceList from "../components/DeviceList.vue";
import SelectedDevices from "../components/SelectedDevices.vue";
import SimulationTotal from "../components/SimulationTotal.vue";
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

const route = useRoute();
const employeeSimulation = ref<EmployeeSimulation | null>(null);
const devices = ref<Device[]>([]);
const simulationDevices = ref<SimulationDevice[]>([]);

onMounted(async () => {
  const simId = Number(route.params.id);
  employeeSimulation.value = await findEmployeeSimulationById(simId);
  devices.value = await getAllDevices();
  simulationDevices.value = await getSimulationDevices(simId);
});

async function addDevice(deviceId: number) {
  if (!employeeSimulation.value) return;
  const exists = simulationDevices.value.find((d) => d.device.id === deviceId);
  if (exists) return;
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
