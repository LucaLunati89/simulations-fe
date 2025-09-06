<template>
  <div :class="styles.content">
    <div class="filter-card">
      <filter-bar
        :minSalary="filters.minSalary"
        :maxSalary="filters.maxSalary"
        @updateFilters="updateFilters"
      />
      <sort-dropdown :selectedSort="sort" @updateSort="updateSort" />
    </div>
    <employee-list :employees="employees" />
    <pagination
      :currentPage="page"
      :totalPages="totalPages"
      @changePage="changePage"
    />
  </div>
</template>

<script setup>
import styles from "../css-modules/Simulation.module.css";
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import FilterBar from "../components/FilterBar.vue";
import SortDropdown from "../components/SortDropdown.vue";
import EmployeeList from "../components/EmployeeList.vue";
import Pagination from "../components/Pagination.vue";

const employees = ref([]);
const page = ref(1);
const pageSize = ref(2);
const totalPages = ref(1);
const sort = ref("-gross_salary");
const filters = ref({
  minSalary: 25000,
  maxSalary: 50000,
});

const fetchEmployees = async () => {
  try {
    const params = {
      min_salary: filters.value.minSalary,
      max_salary: filters.value.maxSalary,
      order_by: sort.value,
      page: page.value,
      page_size: pageSize.value,
    };
    const response = await axios.get(
      "http://127.0.0.1:8000/api/employee-simulations/",
      { params }
    );
    employees.value = response.data.results;
    totalPages.value = Math.ceil(response.data.count / pageSize.value);
  } catch (err) {
    console.error(err);
  }
};

watch([filters, sort, page], fetchEmployees, { deep: true });
onMounted(fetchEmployees);

const updateFilters = (newFilters) => {
  filters.value = newFilters;
  page.value = 1; // reset pagina
};

const updateSort = (newSort) => {
  sort.value = newSort;
  page.value = 1; // reset pagina
};

const changePage = (newPage) => {
  page.value = newPage;
};
</script>
