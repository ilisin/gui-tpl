<script lang="ts" setup>
import { useConfigStore } from '@/store/config'

const { ipcRenderer } = window.require('electron')

const config = useConfigStore()

const minimizeWindow = () => {
  ipcRenderer.send('win-control', 'minimize')
}

const maximizeWindow = () => {
  console.log('maximizeWindow')
  ipcRenderer.send('win-control', 'maximize')
}

const closeWindow = () => {
  ipcRenderer.send('win-control', 'close')
}

console.log(config.title)
console.log(config.isMac)
</script>

<template>
  <div
    class="titlebar"
    :class="{ windows: !config.isMac }"
    @dblclick="maximizeWindow"
  >
    <div
      v-if="!config.isMac"
      class="titlebar-icon"
    >
      <img src="@/assets/logo.svg">
      <!-- <AppMenu /> -->
    </div>
    <div class="titlebar-title noselect">
      标题：{{ config.title }}
    </div>
    <div
      v-if="!config.isMac"
      class="titlebar-actions"
    >
      <button
        id="minimize"
        class="titlebar-action"
        @click="minimizeWindow"
      >
        <i-mdi-window-minimize />
      </button>
      <button
        id="maximize"
        class="titlebar-action"
        @click="maximizeWindow"
      >
        <i-mdi-window-maximize />
      </button>
      <button
        id="quit"
        class="titlebar-action"
        @click="closeWindow"
      >
        <i-mdi-window-close />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.windows-title {
  user-select: none;
}
</style>
