<template>
  <h1>
    {{ props.title }}
  </h1>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<style scoped></style>
