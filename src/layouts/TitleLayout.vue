<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <main class="m-6">
    <div class="card elevation-1 text-center">
      <router-view />
      <router-link to="/">{{ t('welcome') }}</router-link>
    </div>
  </main>
</template>
