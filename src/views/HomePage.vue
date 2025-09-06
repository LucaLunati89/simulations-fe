<template>
  <div :class="styles.content" class="home-container">
    <SearchBar @search="onSearch" />

    <Table :data="tableData">
      <template #actions="{ row }">
        <Button label="Dettaglio" @click="goToDetail(row.id)" />
      </template>
    </Table>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :next="next"
      :previous="previous"
      @change-page="onChangePage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import SearchBar from "../components/combined/SearchBar.vue";
import Table from "../components/atomic/Table.vue";
import Pagination from "../components/atomic/Pagination.vue";
import Button from "../components/atomic/Button.vue";
import { fetchEmployeeSimulations } from "../api/employeeSimulation";
import type { EmployeeSimulation } from "../api/types";
import styles from "../css-modules/Simulation.module.css";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomePage",
  components: { SearchBar, Table, Pagination, Button },
  setup() {
    const tableData = ref<EmployeeSimulation[]>([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const next = ref<string | null>(null);
    const previous = ref<string | null>(null);

    const filters = ref({
      from: "",
      to: "",
      sortOption: "-gross_salary",
    });

    // Funzione per caricare dati filtrati/paginati
    const loadData = async (page = 1) => {
      try {
        const response = await fetchEmployeeSimulations({
          min_salary: filters.value.from
            ? Number(filters.value.from.replace(/\./g, ""))
            : undefined,
          max_salary: filters.value.to
            ? Number(filters.value.to.replace(/\./g, ""))
            : undefined,
          order_by: filters.value.sortOption,
          page,
          page_size: 10,
        });

        tableData.value = response.results;
        currentPage.value = page;
        next.value = response.next;
        previous.value = response.previous;
        totalPages.value = Math.ceil(response.count / 10);
      } catch (err) {
        console.error(err);
      }
    };

    // Carica prima pagina all’apertura
    onMounted(() => {
      loadData(1);
    });

    // Quando si clicca "Cerca"
    const onSearch = (f: { from: string; to: string; sortOption: string }) => {
      filters.value = f;
      loadData(1); // resetta a pagina 1
    };

    // Cambio pagina
    const onChangePage = (page: number) => {
      loadData(page);
    };

    const router = useRouter();

    // Funzione per navigare al dettaglio
    const goToDetail = (id: number) => {
      router.push(`/employee-simulations/${id}`);
    };

    return {
      tableData,
      currentPage,
      totalPages,
      next,
      previous,
      onSearch,
      onChangePage,
      styles,

      goToDetail,
    };
  },
});
</script>

<style scoped>
.home-container {
  width: 90%; /* usa il 90% della larghezza dello schermo */
  max-width: 1400px; /* limite massimo su schermi grandi */
  margin: 2rem auto; /* mantiene centrato verticalmente */
  padding: 1rem 2rem;
  padding-bottom: calc(var(--footer-height) + 20px);
  padding-top: calc(var(--header-height) + 20px);
}

h1 {
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}
</style>
