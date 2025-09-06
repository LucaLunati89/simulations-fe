<template>
  <div class="card">
    <h2 class="card-title">Dettaglio Dipendente #{{ employee.id }}</h2>
    <div class="card-body">
      <p>
        <span class="label">Stipendio Lordo:</span> {{ employee.gross_salary }}
      </p>
      <p><span class="label">Aliquota Tasse:</span> {{ employee.tax_rate }}%</p>
      <p>
        <span class="label">Mesi Contratto:</span>
        {{ employee.contract_months }}
      </p>
      <p><span class="label">Costo Base:</span> {{ employee.base_cost }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
interface EmployeeSimulation {
  id: number;
  gross_salary: string;
  tax_rate: string;
  contract_months: number;
  base_cost: string;
}

export default defineComponent({
  name: "EmployeeCard",
  props: {
    employee: {
      type: Object as PropType<EmployeeSimulation>,
      required: true,
    },
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
</style>
