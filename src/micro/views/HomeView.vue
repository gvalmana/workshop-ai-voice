<template>
  <SCard title="" class="w-full max-w-4xl mx-auto">
    <div class="flex flex-col items-center p-4">
      <img
        alt="AI Assistant logo"
        src="https://cdn1.alegra.com/websites/alegra-new-brand-icon-accounting-minus-padding.svg"
        class="w-24 h-24"
      />
      <h1 class="text-2xl font-bold mt-6 text-[#0F172A]">{{ $transF('assistant_title') }}</h1>

      <VoiceRecognition />
    </div>
  </SCard>
</template>

<script setup lang="ts">
import { SCard } from '@alegradev/smile-ui-next'
import { $transF } from 'app_alegra_commons/translate'
import VoiceRecognition from '../components/VoiceRecognition.vue'
</script>
