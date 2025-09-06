<template>
  <ul>
    <li v-for="employee in employees" :key="employee.id">
      {{ employee.name }} - {{ employee.gross_salary }} €
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  employees: Array,
});
</script>
