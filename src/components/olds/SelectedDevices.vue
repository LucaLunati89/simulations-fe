<template>
  <div class="card">
    <h2>Selected Devices</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Monthly Cost</th>
          <th>Months</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in simulationDevices" :key="d.id">
          <td>{{ d.device.model }}</td>
          <td>€{{ d.device.monthly_cost }}</td>
          <td>
            <input
              type="number"
              class="input"
              :value="d.months"
              min="1"
              @change="
                $emit('update-device', d.device.id, +$event.target.value)
              "
            />
          </td>
          <td>€{{ d.total_cost }}</td>
          <td>
            <button
              class="btn btn-ghost"
              @click="$emit('remove-device', d.device.id)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="simulationDevices.length">
        <tr>
          <td colspan="3"><strong>Devices Total</strong></td>
          <td colspan="2">€{{ totalDevicesCost }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SimulationDevice } from "../../api/types";

const props = defineProps<{ simulationDevices: SimulationDevice[] }>();
defineEmits(["update-device", "remove-device"]);

const totalDevicesCost = computed(() =>
  props.simulationDevices.reduce((sum, d) => sum + d.total_cost, 0)
);
</script>
