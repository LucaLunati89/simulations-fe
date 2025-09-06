<!-- <template>
  <div class="simulation-devices card">
    <Table :data="devices">
      <template #actions="{ row }">
        <Button label="Rimuovi" @click.stop="$emit('removeDevice', row.id)" />
      </template>

      <template #default="{ row, columns }">
        <td>{{ row.device.model }}</td>
        <td>{{ row.device.brand }}</td>
        <td>{{ row.months }}</td>
        <td>{{ row.device.monthly_cost }} €</td>
        <td>{{ row.total_cost }} €</td>
      </template>
    </Table>

    <div v-if="devices.length > 0" class="total">
      <strong>Costo totale: {{ totalCost }} €</strong>
    </div>
    <div v-else class="empty">Nessun dispositivo aggiunto</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import Table from "../atomic/Table.vue";
import Button from "../atomic/Button.vue";
import type { SimulationDevice } from "../../api/types";

export default defineComponent({
  name: "SimulationDevices",
  components: { Table, Button },
  props: {
    devices: { type: Array as PropType<SimulationDevice[]>, required: true },
  },
  emits: ["removeDevice"],
  setup(props) {
    // Calcola costo totale
    const totalCost = computed(() =>
      props.devices.reduce((acc, d) => {
        const clean = String(d.total_cost).replace(",", ".");
        return acc + parseFloat(clean);
      }, 0)
    );

    return { totalCost };
  },
});
</script>

<style scoped>
.simulation-devices {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

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
</style> -->

<template>
  <div class="simulation-devices card">
    <h2>Dispositivi aggiunti alla simulazione</h2>

    <Table :data="devices">
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
import { defineComponent, computed, PropType } from "vue";
import Table from "../atomic/Table.vue";
import Button from "../atomic/Button.vue";
import type { SimulationDevice } from "../../api/types";

export default defineComponent({
  name: "SimulationDevices",
  components: { Table, Button },
  props: {
    devices: { type: Array as PropType<SimulationDevice[]>, required: true },
  },
  emits: ["removeDevice"],
  setup(props) {
    // Calcola costo totale
    const totalCost = computed(() =>
      props.devices.reduce((acc, d) => {
        const clean = String(d.total_cost).replace(",", "."); // fix eventuale formato
        return acc + parseFloat(clean);
      }, 0)
    );

    return { totalCost };
  },
});
</script>

<style scoped>
.simulation-devices {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

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
