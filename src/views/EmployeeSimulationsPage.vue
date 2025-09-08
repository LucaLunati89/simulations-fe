<template>
  <div :class="styles.content" class="home-container">
    <SearchBar @search="onSearch" class="custom-search" />

    <div>
      <div v-if="!isLoading" class="table-container">
        <Table :data="tableData">
          <template #actions="{ row }">
            <Button label="Dettaglio" @click="goToDetail(row.id)" />
          </template>
        </Table>
        <Pagination
          class="custom-pagination"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :next="next || false"
          :previous="previous || false"
          @change-page="onChangePage"
        />
      </div>
      <div v-else class="loader-container">
        <div class="loader"></div>
      </div>
    </div>
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
    const tableData = ref<EmployeeSimulationIT[]>([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const next = ref<string | null>(null);
    const previous = ref<string | null>(null);
    const isLoading = ref(false);

    interface EmployeeSimulationIT {
      id: number;
      stipendio_lordo: string;
      aliquota_fiscale: string;
      mesi_contratto: number;
      costo_base: string;
    }
    const filters = ref({
      from: "",
      to: "",
      sortOption: "",
    });

    const mapToItalian = (
      data: EmployeeSimulation[]
    ): EmployeeSimulationIT[] => {
      return data.map((item) => ({
        id: item.id,
        stipendio_lordo: parseAndFormat(item.gross_salary),
        aliquota_fiscale: item.tax_rate,
        mesi_contratto: item.contract_months,
        costo_base: parseAndFormat(item.base_cost),
      }));
    };

    function parseAndFormat(value: string): string {
      // Rimuove la virgola usata come separatore delle migliaia
      const normalized = value.replace(/,/g, "");

      // Converte in numero
      const numberValue = parseFloat(normalized);

      if (isNaN(numberValue)) {
        throw new Error("Valore non valido");
      }

      // Restituisce il numero formattato in italiano
      return numberValue.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    // Funzione per caricare dati filtrati/paginati
    const loadData = async (page = 1) => {
      isLoading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 0.2));

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

        tableData.value = mapToItalian(response.results);
        console.log("employee sim", tableData.value);
        currentPage.value = page;
        next.value = response.next;
        previous.value = response.previous;
        totalPages.value = Math.ceil(response.count / 10);
      } catch (err) {
        console.error(err);
      } finally {
        isLoading.value = false;
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
      isLoading,
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

/* AGGIUNTO: Container per centrare il loader */
.loader-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* AGGIUNTO: Stile del loader */
.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-black); /* Grigio più scuro per il base */
  border-top: 4px solid var(--color-yellow-primary); /* Nero per la parte che ruota */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
/* AGGIUNTO: Animazione di rotazione */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.custom-search {
  max-height: fit-content;
}
.custom-pagination {
  max-height: fit-content;
}

.table-container {
  min-height: 500px; /* Spazio fisso per la tabella */
  position: relative; /* IMPORTANTE: serve per il position: absolute del loader */
  margin: 1rem 0;
}
</style>
