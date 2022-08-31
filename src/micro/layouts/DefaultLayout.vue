<template>
  <div class="layout-container">
    <div class="sm-content-area">
      <div v-if="loading" class="sm-content-loading">
        <sm-progress-circle></sm-progress-circle>
      </div>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SmProgressCircle } from '@alegradev/smile-ui-next'
import { useAppStore } from 'app_alegra_commons/app'
import { computed, onMounted } from 'vue'

import { convertDictionaryToObject } from '../utils/appHelpers'
import useMicrofront from '../composables/useMicrofront'

const { loadUserInfo, addToDictionary } = useMicrofront()

onMounted(async () => {
  await loadUserInfo()
  addToDictionary(convertDictionaryToObject())
})

const APP = useAppStore()

const loading = computed(() => {
  return Boolean(APP.globalLoading)
})
</script>

<style lang="scss">
body {
  padding: 0px;
  margin: 0px;
}
.layout-container {
  @apply flex bg-sm-greyblue1;
  @apply min-h-screen;
}
.sm-content-area {
  @apply w-full;
  @apply overflow-auto;
  @apply p-5;
  @apply grow;
  @apply relative;
}
.sm-content-loading {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
