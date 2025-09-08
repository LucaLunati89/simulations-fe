<template>
  <div class="simulation-devices card">
    <Table :data="mappedDevices">
      <!-- Slot actions per il bottone Rimuovi -->
      <template #actions="{ row }">
        <Button label="Rimuovi" @click.stop="$emit('removeDevice', row.id)" />
      </template>
    </Table>

    <div v-if="devices.length > 0" class="total">
      <strong>Costo totale: {{ totalCost }} €</strong>
    </div>
    <div v-else class="empty">Nessun dispositivo aggiunto</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";
import Table from "../atomic/Table.vue";
import Button from "../atomic/Button.vue";
import type { SimulationDevice } from "../../api/types";

// Interfaccia per i dati mappati in italiano
interface SimulationDeviceIT {
  id: number;
  modello: string;
  marca: string;
  costo_mensile: string;
  mesi: number;
  costo_totale: string;
}

export default defineComponent({
  name: "SimulationDevices",
  components: { Table, Button },
  props: {
    devices: { type: Array as PropType<SimulationDevice[]>, required: true },
  },
  emits: ["removeDevice"],
  setup(props) {
    // Mappa i dati in italiano
    const mappedDevices = computed((): SimulationDeviceIT[] => {
      return props.devices.map((device) => ({
        id: device.id,
        modello: device.device.model,
        marca: device.device.brand,
        costo_mensile: String(device.device.monthly_cost),
        mesi: device.months,
        costo_totale: String(device.total_cost),
      }));
    });

    // Calcola costo totale
    const totalCost = computed(() =>
      props.devices.reduce((acc, d) => {
        const clean = String(d.total_cost).replace(",", "."); // fix eventuale formato
        return acc + parseFloat(clean);
      }, 0)
    );

    return { mappedDevices, totalCost };
  },
});
</script>

<style scoped>
.total {
  margin-top: 1rem;
  font-size: 16px;
  text-align: right;
}

.empty {
  margin-top: 1rem;
  text-align: center;
  color: #888;
}
</style>
