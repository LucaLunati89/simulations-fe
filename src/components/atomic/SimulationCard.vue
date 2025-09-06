<template>
  <div class="card">
    <h2 class="card-title">Simulazione #{{ simulation.id }}</h2>
    <div class="card-body">
      <p>
        <span class="label">Nome:</span>
        {{ simulation.name || "—" }}
      </p>
      <p>
        <span class="label">Stato:</span>
        {{ simulation.status }}
      </p>
      <p>
        <span class="label">Data creazione:</span>
        {{ new Date(simulation.created_at).toLocaleString() }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Simulation } from "../../api/types";

export default defineComponent({
  name: "SimulationCard",
  props: {
    simulation: {
      type: Object as PropType<Simulation>,
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
</style>
