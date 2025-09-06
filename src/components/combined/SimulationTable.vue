<template>
  <div>
    <Table :data="tableData" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import type { Simulation } from "../../api/types";
import Table from "../atomic/Table.vue";
import { fetchEmployeeSimulations } from "../../api/simulation";
export default {
  name: "SimulationTable",
  props: {
    employeeSimulationId: {
      type: Number,
      required: true,
    },
  },
  components: { Table },
  setup(props: { employeeSimulationId: number }) {
    const tableData = ref<Simulation[]>([]);
    const loadData = async () => {
      try {
        const response = await fetchEmployeeSimulations(
          props.employeeSimulationId
        );
        tableData.value = response.results;
      } catch (error) {
        console.error("Errore nel fetch dei dispositivi:", error);
      }
    };
    onMounted(() => {
      loadData();
    });
    return { tableData };
  },
};
</script>
