<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">
          {{ simulation.name || "—" }}
          <span class="card-title-span">{{ formattedCreatedAt }}</span>
        </h2>
      </div>
      <span class="label status">{{ simulation.status }}</span>
    </div>
    <div class="card-body">
      <div class="card-cost">
        <p class="card card-p">
          <p class="label">Costo base dipendente:</p>
          {{ formattedBaseCost }}
        </p>
        <p class="card card-p">
          <p class="label">Costo totale dispositivi:</p>
          {{ formattedTotalDevicesCost }}
        </p>
      </div>

      <p class="total">
        <strong class="total-in"
          >Costo totale simulazione: {{ formattedTotalSimulationCost }}</strong
        >
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
      type: [String, Number] as PropType<string | number>,
      default: 0,
    },
    totalDevicesCost: {
      type: [String, Number] as PropType<string | number>,
      default: 0,
    },
  },
  setup(props) {
    // Funzione robusta per parsare numeri formattati ("1.234,56", "1,234.56", "€ 1.234")
    const parseFormattedNumber = (
      value: string | number | null | undefined
    ): number => {
      if (value === null || value === undefined) return 0;
      if (typeof value === "number") return isFinite(value) ? value : 0;

      let s = String(value).trim();

      // rimuovi NBSP, spazi e simboli di valuta
      s = s
        .replace(/\u00A0/g, "")
        .replace(/\s+/g, "")
        .replace(/[€$£¥]/g, "");

      const lastDot = s.lastIndexOf(".");
      const lastComma = s.lastIndexOf(",");

      if (lastDot !== -1 && lastComma !== -1) {
        // ci sono entrambi: l'ultimo separatore è quello decimale
        if (lastDot > lastComma) {
          // . è decimale -> rimuovi le virgole (migliaia)
          s = s.replace(/,/g, "");
        } else {
          // , è decimale -> rimuovi i punti (migliaia) e sostituisci , con .
          s = s.replace(/\./g, "").replace(/,/g, ".");
        }
      } else if (lastComma !== -1) {
        // solo comma
        const decimals = s.length - lastComma - 1;
        if (decimals === 1 || decimals === 2) {
          // probabile separatore decimale
          s = s.replace(/,/g, ".");
        } else {
          // probabile separatore migliaia
          s = s.replace(/,/g, "");
        }
      } else if (lastDot !== -1) {
        // solo punto
        const decimals = s.length - lastDot - 1;
        if (decimals === 1 || decimals === 2) {
          // probabile decimale -> lascia
        } else {
          // probabile separatore migliaia
          s = s.replace(/\./g, "");
        }
      }

      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };

    // Numeri calcolati
    const baseCostNumber = computed(() => parseFormattedNumber(props.baseCost));
    const totalDevicesNumber = computed(() =>
      parseFormattedNumber(props.totalDevicesCost)
    );

    const totalSimulationNumber = computed(() => {
      return baseCostNumber.value + totalDevicesNumber.value;
    });

    // Formattazione in euro it-IT
    const formatCurrency = (n: number) =>
      n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

    const formattedBaseCost = computed(() =>
      formatCurrency(baseCostNumber.value)
    );
    const formattedTotalDevicesCost = computed(() =>
      formatCurrency(totalDevicesNumber.value)
    );
    const formattedTotalSimulationCost = computed(() =>
      formatCurrency(totalSimulationNumber.value)
    );

    const formattedCreatedAt = computed(() => {
      const dateVal =
        (props.simulation && (props.simulation as any).created_at) || null;
      if (!dateVal) return "—";
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? "—" : d.toLocaleString("it-IT");
    });

    return {
      // valori mostrati in template
      formattedBaseCost,
      formattedTotalDevicesCost,
      formattedTotalSimulationCost,
      formattedCreatedAt,
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
  padding: 6px 6px;
  border-top: 1px solid #e6e9f0;
  font-size: 16px;
  background-color: var(--color-yellow-primary);
  border-radius: 8px;
}
.p-card {
  padding: px 6px;
}
.total {
  margin-top: 1rem;
  font-size: 16px;
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}
.status {
  padding: 5px;
  border-radius: 8px;
  background-color: var(--color-yellow-primary);
  color: var(--color-grey-medium);
  font-size: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title-span {
  padding-left: 5px;
  font-size: 14px;
  color: var(--color-grey-medium);
}

.card-cost {
  display: flex;
  gap: 1rem;
}

.card-p {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.total-in {
  color: var(--color-black);
  font-size: 16px;
}
</style>
