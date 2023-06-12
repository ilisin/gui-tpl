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
    <span>is dark: {{ isDark }}</span>
    <h1>hello11s</h1>
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
