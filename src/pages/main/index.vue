<script lang="ts" setup>
import AppMenu from '@/components/AppMenu.vue'
</script>

<template>
  <h1>Main index</h1>

  <el-row>
    <RouterLink :to="{ name: 'Root', query: { frozen: true } }">
      Home
    </RouterLink>
  </el-row>
  <el-row style="margin-top: 30px;">
    <AppMenu />
  </el-row>
</template>
