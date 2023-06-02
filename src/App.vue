<script setup lang="ts">
import { set } from '@vueuse/core'
import HelloWorld from './components/HelloWorld.vue'

const count = ref(0)

const test = () => {
  count.value++
  console.log('test')
  set(count, 20)
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev">
      <img
        src="/vite.svg"
        class="logo"
        alt="Vite logo"
      >
    </a>
    <a href="https://vuejs.org/">
      <img
        src="./assets/vue.svg"
        class="logo vue"
        alt="Vue logo"
      >
    </a>
    <button @click="test">
      hello
    </button>
    <span>{{ count }}</span>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
