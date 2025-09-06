<template>
  <div id="app">
    <Header />
    <router-view />
    <!--     <main class="content">
      <Simulation />
    </main> -->

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Simulation from "./components/Simulation.vue";

import { onMounted } from "vue";
onMounted(() => {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  if (header && footer) {
    const setHeights = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        header.offsetHeight + "px"
      );
      document.documentElement.style.setProperty(
        "--footer-height",
        footer.offsetHeight + "px"
      );
    };

    setHeights();
    window.addEventListener("resize", setHeights);
  }
});
</script>
