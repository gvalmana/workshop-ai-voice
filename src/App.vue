<template>
  <router-view />
</template>

<script lang="ts" setup>
defineProps({
  name: String,
  mountParcel: null,
  singleSpa: null,
  // mainStore: <pinia main store generated type>,
})
</script>
