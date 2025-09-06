<template>
  <div class="custom-select">
    <!-- elemento visibile -->
    <div class="selected" @click="toggle">
      {{ selectedLabel }}
    </div>

    <!-- dropdown -->
    <div v-if="open" class="options">
      <div
        v-for="option in options"
        :key="option.value"
        class="option"
        @click="select(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";

export default defineComponent({
  name: "Select",
  props: {
    options: {
      type: Array as () => {
        label: string;
        value: string | number;
        default: boolean;
      }[],
      required: true,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const open = ref(false);

    const selectedLabel = computed(() => {
      const selected = props.options.find((o) => o.value === props.modelValue);
      const defaultOption = props.options.find((o) => o.default);
      return selected ? selected.label : defaultOption;
    });

    const toggle = () => {
      open.value = !open.value;
    };

    const select = (option: { label: string; value: string | number }) => {
      emit("update:modelValue", option.value);
      open.value = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".custom-select")) {
        open.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return { open, selectedLabel, toggle, select };
  },
});
</script>

<style scoped>
.custom-select {
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--color-white);
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: var(--text);
  transition: var(--transition);
}

.custom-select:hover {
  border-color: var(--color-grey-medium);
  box-shadow: var(--shadow-1);
}

.custom-select .selected {
  padding: 10px 12px;
}

.custom-select .selected:focus,
.custom-select:focus-within {
  outline: none;
  border-color: var(--color-grey-medium);
  box-shadow: var(--shadow-1);
}

.custom-select .options {
  position: absolute;
  width: 100%;
  top: calc(100% + 4px);
  left: 0;
  border: var(--border);
  border-radius: 10px;
  background: var(--color-white);
  box-shadow: var(--shadow-1);
  z-index: 10;
}

.custom-select .option {
  padding: 10px 12px;
  transition: background-color 0.15s;
}

.custom-select .option:hover {
  background-color: var(--color-fill-light);
}
</style>
