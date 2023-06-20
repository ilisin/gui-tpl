<script lang="ts" setup>
import AppMenu from '@/components/AppMenu.vue'
</script>

<template>
  <h1 class="main-title">
    Main index
  </h1>

  <el-row>
    <RouterLink :to="{ name: 'Root', query: { frozen: 1 } }">
      Home
    </RouterLink>
  </el-row>
  <el-row style="margin-top: 30px;">
    <AppMenu />
  </el-row>
</template>

<style lang="scss" scoped>
.main-title {
  color: var(--el-text-color-primary);
}
</style>
