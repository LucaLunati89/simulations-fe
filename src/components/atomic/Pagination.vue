<template>
  <div class="pagination">
    <button
      :disabled="!previous"
      @click="$emit('change-page', currentPage - 1)"
    >
      Precedente
    </button>

    <button
      v-for="page in pagesArray"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="$emit('change-page', page)"
    >
      {{ page }}
    </button>

    <button :disabled="!next" @click="$emit('change-page', currentPage + 1)">
      Successiva
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    next: { type: [String, Boolean], default: null },
    previous: { type: [String, Boolean], default: null },
  },
  emits: ["change-page"],
  setup(props) {
    // Array di pagine da mostrare
    const pagesArray = computed(() => {
      const pages = [];
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    });

    return { pagesArray };
  },
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.pagination button {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e9f0;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--color-grey-medium);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.07);
}

.pagination button.active {
  background-color: var(--color-fill-light);
  font-weight: 600;
  border-color: var(--color-grey-medium);
}
</style>
