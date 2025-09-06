<template>
  <div class="input-container">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      class="input"
      type="text"
      :id="id"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="inputValue"
      @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "Input",
  props: {
    modelValue: { type: String, default: "" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue);

    // Formatta numero intero con separatore migliaia
    const formatNumber = (val: string) => {
      if (!val) return "";
      // rimuove tutto tranne i numeri
      const num = parseInt(val.replace(/\D/g, ""), 10);
      if (isNaN(num)) return "";
      return num.toLocaleString("it-IT");
    };

    const onInput = () => {
      inputValue.value = formatNumber(inputValue.value);
      emit("update:modelValue", inputValue.value);
    };

    // Sync esterno -> interno
    watch(
      () => props.modelValue,
      (newVal) => {
        inputValue.value = newVal;
      }
    );

    return { inputValue, onInput };
  },
});
</script>
