<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>{{ t('hello') }}</div>
</template>

<route lang="yaml">
meta:
  layout: TitleLayout
</route>
