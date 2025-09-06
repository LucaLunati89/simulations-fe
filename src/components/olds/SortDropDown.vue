<template>
  <select v-model="localSort" @change="applySort" class="sort-select">
    <option value="gross_salary">Stipendio minore</option>
    <option value="-gross_salary">Stipendio maggiore</option>
  </select>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  selectedSort: String,
});
const emit = defineEmits(["updateSort"]);

const localSort = ref(props.selectedSort);

const applySort = () => {
  emit("updateSort", localSort.value);
};
</script>
