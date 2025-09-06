<template>
  <div class="filterbar">
    <label>Filtro Stipendio:</label>
    <div :class="styles.inputsrow">
      <input
        class="input"
        type="number"
        v-model.number="localMin"
        placeholder="Da"
      />
      <input
        class="input"
        type="number"
        v-model.number="localMax"
        placeholder="A"
      />
      <button class="btn" @click="applyFilters">Applica</button>
    </div>
  </div>
</template>

<script setup>
import styles from "../css-modules/FilterBar.module.css";
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  minSalary: Number,
  maxSalary: Number,
});
const emit = defineEmits(["updateFilters"]);

const localMin = ref(props.minSalary);
const localMax = ref(props.maxSalary);

const applyFilters = () => {
  emit("updateFilters", {
    minSalary: localMin.value,
    maxSalary: localMax.value,
  });
};
</script>
