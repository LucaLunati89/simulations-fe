<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="$emit('changePage', currentPage - 1)"
    >
      Prev
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages"
      @click="$emit('changePage', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});
</script>
