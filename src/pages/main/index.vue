<template>
  <h1>Main index</h1>

  <RouterLink :to="{ name: 'Root', query: { frozen: true } }">
    Home
  </RouterLink>
</template>
