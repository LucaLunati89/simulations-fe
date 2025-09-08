<template>
  <div class="simulation-devices card">
    <div v-if="devices.length > 0">
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Modello</th>
              <th>Marca</th>
              <th>Costo Mensile</th>
              <th>Mesi</th>
              <th>Costo Totale</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in mappedDevices" :key="device.id">
              <td>{{ device.modello }}</td>
              <td>{{ device.marca }}</td>
              <td>{{ formatCurrency(device.costo_mensile) }}</td>
              <td class="mesi-cell">
                <input
                  type="number"
                  :value="device.mesi"
                  @input="handleMonthsChange(device.id, $event)"
                  @blur="updateMonths(device.id)"
                  :min="1"
                  :max="maxMonths"
                  class="mesi-input"
                  :key="`input-${device.id}`"
                />
              </td>
              <td>{{ formatCurrency(device.costo_totale) }}</td>
              <td>
                <Button
                  label="Rimuovi"
                  @click.stop="$emit('removeDevice', device.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total">
        <strong>Costo totale: {{ formattedTotalCost }} €</strong>
      </div>
    </div>

    <div v-else class="empty">Nessun dispositivo aggiunto</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, type PropType } from "vue";
import Button from "../atomic/Button.vue";
import type { SimulationDevice } from "../../api/types";

export default defineComponent({
  name: "SimulationDevices",
  components: { Button },
  props: {
    devices: { type: Array as PropType<SimulationDevice[]>, required: true },
    maxMonths: { type: Number, required: false, default: 12 },
  },
  emits: ["removeDevice", "updateDeviceMonths"],
  setup(props, { emit }) {
    // Stato temporaneo per gli input
    const tempMonths = ref<Record<number, number>>({});

    // Funzione robusta per parsare numeri formattati
    const parseFormattedNumber = (
      value: string | number | null | undefined
    ): number => {
      if (value === null || value === undefined) return 0;
      if (typeof value === "number") return isFinite(value) ? value : 0;

      let s = String(value).trim();

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
        if (decimals === 2 || decimals === 1) {
          s = s.replace(/,/g, ".");
        } else {
          s = s.replace(/,/g, "");
        }
      } else if (lastDot !== -1) {
        const decimals = s.length - lastDot - 1;
        if (decimals === 2 || decimals === 1) {
          // lascia così
        } else {
          s = s.replace(/\./g, "");
        }
      }

      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };

    // Formatta valuta
    const formatCurrency = (value: string | number): string => {
      const numValue = parseFormattedNumber(value);
      return (
        numValue.toLocaleString("it-IT", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " €"
      );
    };

    // Mappa i dati per la visualizzazione
    const mappedDevices = computed(() =>
      props.devices.map((device) => ({
        id: device.id,
        modello: device.device.model,
        marca: device.device.brand,
        costo_mensile: device.device.monthly_cost,
        mesi:
          tempMonths.value[device.id] !== undefined
            ? tempMonths.value[device.id]
            : device.months,
        costo_totale: device.total_cost,
      }))
    );

    // Gestisce il cambio di valore nell'input
    const handleMonthsChange = (deviceId: number, event: Event) => {
      const target = event.target as HTMLInputElement;
      let value = parseInt(target.value) || 1;

      // Applica i limiti
      value = Math.max(1, Math.min(value, props.maxMonths));

      tempMonths.value[deviceId] = value;

      // Aggiorna il valore dell'input se è stato corretto
      if (target.value !== value.toString()) {
        target.value = value.toString();
      }
    };

    // Emette l'evento di aggiornamento quando l'input perde il focus
    const updateMonths = (deviceId: number) => {
      const newMonths = tempMonths.value[deviceId];
      if (newMonths !== undefined) {
        emit("updateDeviceMonths", deviceId, newMonths);
        // NON cancellare tempMonths qui - sarà fatto dal watcher
      }
    };

    // Watcher che pulisce tempMonths quando i props si aggiornano
    watch(
      () => props.devices,
      (newDevices) => {
        // Pulisce tempMonths solo quando il valore nei props corrisponde
        Object.keys(tempMonths.value).forEach((deviceIdStr) => {
          const deviceId = parseInt(deviceIdStr);
          const device = newDevices.find((d) => d.id === deviceId);
          const tempValue = tempMonths.value[deviceId];

          if (device && device.months === tempValue) {
            // Il props è aggiornato, possiamo rimuovere dal temp state
            delete tempMonths.value[deviceId];
          }
        });
      },
      { deep: true }
    );

    // Calcola costo totale
    const totalCost = computed(() =>
      props.devices.reduce(
        (acc, d) => acc + parseFormattedNumber(d.total_cost as any),
        0
      )
    );

    // Formatta il costo totale
    const formattedTotalCost = computed(() =>
      totalCost.value.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    return {
      mappedDevices,
      totalCost,
      formattedTotalCost,
      formatCurrency,
      handleMonthsChange,
      updateMonths,
    };
  },
});
</script>

<style scoped>
.simulation-devices {
  margin-top: 1rem;
}

.table-container {
  overflow-x: auto;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e6e9f0;
  margin-bottom: 1rem;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: var(--text);
  table-layout: fixed;
}

.custom-table th,
.custom-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e6e9f0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.custom-table th {
  background: #f5f6fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.custom-table tr:hover {
  background-color: rgba(37, 99, 235, 0.07);
}

.custom-table td {
  background: #fff;
}

.mesi-cell {
  white-space: normal !important;
  padding: 8px 12px;
}

.mesi-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  background: #fff;
  transition: all 0.2s ease;
}

.mesi-input:focus {
  outline: none;
  border-color: var(--color-grey-medium);
  box-shadow: 0 0 0 2px var(--shadow-1);
}

.mesi-input::-webkit-outer-spin-button,
.mesi-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.mesi-input[type="number"] {
  -moz-appearance: textfield;
}

.total {
  margin-top: 1rem;
  font-size: 16px;
  text-align: right;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.empty {
  margin-top: 1rem;
  text-align: center;
  color: #888;
  padding: 2rem;
}
</style>
