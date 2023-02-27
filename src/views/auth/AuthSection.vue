<template>
  <section class="auth-page">
    <router-view />
    <div class="auth-hero-image"></div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.auth-page {
  .auth-hero-image {
    display: none;
  }
}
</style>
