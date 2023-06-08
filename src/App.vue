<script setup lang="ts">
import { set } from '@vueuse/core'

const count = ref(0)

const test = () => {
  count.value++
  console.log('test')
  set(count, 20)
}
</script>

<template>
  <ElConfigProvider size="small">
    <RouterView />
  </ElConfigProvider>
</template>

<style scoped>
.logo {
  padding: 1.5em;
  block-size: 6em;
  transition: filter 300ms;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
