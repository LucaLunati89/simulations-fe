<template>
  <div class="card">
    <h2>Available Devices</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Monthly Cost</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in devices" :key="device.id">
          <td>{{ device.model }}</td>
          <td>€{{ device.monthly_cost }}</td>
          <td>
            <button
              class="btn btn-primary"
              :disabled="selectedDevices.some((d) => d.device.id === device.id)"
              @click="$emit('add-device', device.id)"
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Device, SimulationDevice } from "../../api/types";
defineProps<{
  devices: Device[];
  selectedDevices: SimulationDevice[];
}>();
defineEmits(["add-device"]);
</script>
