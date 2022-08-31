<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link to="/configuration">
      <sm-button type="primary"> Page 1</sm-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { SmButton } from '@alegradev/smile-ui-next'
</script>

<style scoped></style>
