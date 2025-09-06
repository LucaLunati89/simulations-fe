<template>
  <div class="card">
    <h2>Total Simulation</h2>
    <p><strong>Base Cost:</strong> €{{ employeeSimulation.base_cost }}</p>
    <p><strong>Devices Cost:</strong> €{{ totalDevicesCost }}</p>
    <p
      class="total"
      style="color: var(--text); font-size: 18px; margin-top: 8px"
    >
      <strong>Total:</strong> €{{
        employeeSimulation.base_cost + totalDevicesCost
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { EmployeeSimulation, SimulationDevice } from "../../api/types";

const props = defineProps<{
  employeeSimulation: EmployeeSimulation;
  simulationDevices: SimulationDevice[];
}>();

const totalDevicesCost = computed(() =>
  props.simulationDevices.reduce((sum, d) => sum + d.total_cost, 0)
);
</script>
