<template>
  <header :class="styles.header">
    <h1 :class="styles.title" @click="goToHome" style="cursor: pointer">
      Simulatore costi
    </h1>
  </header>
</template>

<script setup lang="ts">
import styles from "../css-modules/Header.module.css";
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push("/");
};
</script>
