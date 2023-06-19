<route lang="json">
{
  "name": "Root",
  "meta": {}
}
</route>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)

const onChange = () => {
  useDark()
  toggleDark()
  console.log('hello')
}
</script>

<template>
  <div>
    <ElButton @click="onChange">
      切换主题
    </ElButton>
    <RouterLink to="/demo/icons">
      icons
    </RouterLink>
    <RouterLink to="/console/demo">
      console
    </RouterLink>
    <span>is dark: {{ isDark }}</span>
    <h1>hello11s</h1>
    <span class="test-theme">span</span>
    <ElButton>hello</ElButton>
    <ElButton>hello</ElButton>
    <ElButton type="primary">
      hello
    </ElButton>
    <ElButton type="success">
      hello
    </ElButton>
    <ElButton type="info">
      hello
    </ElButton>
    <ElButton type="warning">
      hello
    </ElButton>
    <ElButton type="danger">
      hello
    </ElButton>
  </div>
</template>

<style scoped lang="scss">
.test-theme {
  color: var(--ui-color-text);
}
</style>
