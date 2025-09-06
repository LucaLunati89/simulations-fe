<template>
  <button
    class="btn"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",
  props: {
    label: { type: String, default: "Click Me" },
    type: { type: String as "button" | "submit" | "reset", default: "button" },
    disabled: { type: Boolean, default: false },
  },
});
</script>
