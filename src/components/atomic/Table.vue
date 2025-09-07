<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ formatHeader(col) }}</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td v-for="col in columns" :key="col">{{ row[col] }}</td>
          <td>
            <slot name="actions" :row="row"></slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + 1" class="empty">
            Nessun dato disponibile
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Table",
  props: {
    data: {
      type: Array as () => Array<Record<string, any>>,
      required: true,
      default: () => [],
    },
  },
  setup(props) {
    const columns = computed(() =>
      props.data.length ? Object.keys(props.data[0]) : []
    );

    // formato più leggibile per gli header
    const formatHeader = (key: string) =>
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return { columns, formatHeader };
  },
});
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e6e9f0;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: var(--text);
  table-layout: fixed;
}

.custom-table th,
.custom-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e6e9f0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.custom-table th {
  background: #f5f6fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.custom-table tr:hover {
  background-color: rgba(37, 99, 235, 0.07);
}

.custom-table td {
  background: #fff;
}

.empty {
  text-align: center;
  color: #888;
  padding: 12px 0;
}
</style>
