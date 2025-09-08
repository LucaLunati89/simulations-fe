<template>
  <footer :class="styles.footer">
    <p>
      Developed by Luca Lunati
      <span :class="styles.span">🚀</span>
    </p>
    <div>
      <a
        href="https://www.linkedin.com/in/luca-lunati/"
        target="_blank"
        rel="noopener noreferrer"
        :class="styles.link"
      >
        <i class="fab fa-linkedin"></i>
      </a>
      <a
        href="https://github.com/LucaLunati89"
        target="_blank"
        rel="noopener noreferrer"
        :class="styles.link"
      >
        <i class="fab fa-github"></i>
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import styles from "../css-modules/Footer.module.css";
</script>
