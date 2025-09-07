<template>
  <div class="card">
    <h2 class="card-title">{{ simulation.name || "—" }}</h2>
    <div class="card-body">
      <p>
        <span class="label">Stato:</span>
        {{ simulation.status }}
      </p>
      <p>
        <span class="label">Data creazione:</span>
        {{ new Date(simulation.created_at).toLocaleString() }}
      </p>
      <p>
        <span class="label">Costo base dipendente:</span>
        {{ formatCurrency(baseCost) }}
      </p>
      <p>
        <span class="label">Costo totale dispositivi:</span>
        {{ formatCurrency(totalDevicesCost) }}
      </p>
      <p class="total-cost">
        <span class="label">Costo totale simulazione:</span>
        <strong>{{ formatCurrency(totalSimulationCost) }}</strong>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";
import type { Simulation } from "../../api/types";

export default defineComponent({
  name: "SimulationCard",
  props: {
    simulation: {
      type: Object as PropType<Simulation>,
      required: true,
    },
    baseCost: {
      type: [String, Number],
      default: 0,
    },
    totalDevicesCost: {
      type: [String, Number],
      default: 0,
    },
  },
  setup(props) {
    // Formatta i valori monetari
    const formatCurrency = (value: string | number): string => {
      if (!value) return "0,00 €";

      // Converte in numero se è stringa
      const numValue =
        typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

      return numValue.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      });
    };

    // Calcola il costo totale della simulazione
    const totalSimulationCost = computed(() => {
      const base =
        typeof props.baseCost === "string"
          ? parseFloat(props.baseCost.replace(",", "."))
          : props.baseCost;

      const devices =
        typeof props.totalDevicesCost === "string"
          ? parseFloat(props.totalDevicesCost.replace(",", "."))
          : props.totalDevicesCost;

      return base + devices;
    });

    return {
      formatCurrency,
      totalSimulationCost,
    };
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #e6e9f0;
  border-radius: 10px;
  background: var(--color-white, #fff);
  padding: 20px;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.07);
  margin-top: 1.5rem;
}

.card-title {
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: 600;
  color: var(--text, #333);
}

.card-body p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--text, #444);
}

.label {
  font-weight: 600;
  margin-right: 6px;
  color: var(--color-grey-medium, #666);
}

.total-cost {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e6e9f0;
  font-size: 16px;
}
</style>
