<script setup lang="ts">
import { set } from '@vueuse/core'
import HelloWorld from '@/components/HelloWorld.vue'

const count = ref(0)

const test = () => {
  count.value++
  console.log('test')
  set(count, 20)
}
</script>

<template>
  <RouterView />
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
    <a href="https://vuejs.org/">
      <img src="@images/avatars/avatar-1.png">
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
