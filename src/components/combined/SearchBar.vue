<template>
  <div class="search-box card">
    <p>Stipendio:</p>
    <Input v-model="from" type="number" placeholder="Da" />
    <Input v-model="to" type="number" placeholder="A" />
    <Button label="Cerca" @click="handleSearch"> </Button>

    <Select
      v-model="sortOption"
      :options="[
        { label: 'Id', value: 'id', default: true },
        {
          label: 'Stipendio maggiore',
          value: 'gross_salary',
          default: false,
        },
        { label: 'Stipendio minore', value: '-gross_salary', default: false },
      ]"
    />
  </div>
</template>

<script lang="ts">
import Input from "../atomic/Input.vue";
import Button from "../atomic/Button.vue";
import Select from "../atomic/Select.vue";
import { ref } from "vue";
export default {
  name: "SearchBar",
  components: { Input, Button, Select },
  emits: ["search"],
  setup(props, { emit }) {
    const sortOption = ref("id");
    const from = ref("");
    const to = ref("");

    const handleSearch = () => {
      emit("search", {
        from: from.value,
        to: to.value,
        sortOption: sortOption.value,
      });
    };
    return { sortOption, from, to, handleSearch };
  },
};
</script>

<style scoped>
.search-box {
  display: flex;
  gap: 1rem;
  flex-direction: row;
}
</style>
