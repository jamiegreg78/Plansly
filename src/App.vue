<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// TODO: Make this Dynamic / automatic
onMounted(() => {
  document.querySelector('body')?.setAttribute('data-lightMode', 'true')
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
}

html,
body {
  margin: 0;
  padding: 0;
}
</style>
