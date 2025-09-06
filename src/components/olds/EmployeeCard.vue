<template>
  <div class="card">
    <h2>Simulazione dipendente</h2>
    <p><strong>Id:</strong> {{ employeeSimulation.id }}</p>
    <p>
      <strong>Stipendio lordo:</strong> €{{ employeeSimulation.gross_salary }}
    </p>
    <p><strong>Aliquota fiscale:</strong> {{ employeeSimulation.tax_rate }}%</p>
    <p>
      <strong>Durata del contratto (mesi):</strong>
      {{ employeeSimulation.contract_months }}
    </p>
    <hr class="lines" />
    <p style="color: var(--text)">
      <strong>Base Cost:</strong> €{{ employeeSimulation.base_cost }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EmployeeSimulation } from "../../api/types";
defineProps<{ employeeSimulation: EmployeeSimulation }>();
</script>
