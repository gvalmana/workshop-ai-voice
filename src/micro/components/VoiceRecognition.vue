<template>
  <div class="flex flex-col items-center w-full max-w-2xl mx-auto">
    <div class="w-full flex flex-col items-center gap-4 my-4">
      <SButton
        :variant="state.isListening ? 'danger' : 'primary'"
        @click="toggleListening"
        :disabled="!state.isSupported"
        class="w-full max-w-xs"
      >
        <span v-if="!state.isSupported">Micrófono no soportado</span>
        <span v-else>
          {{ state.isListening ? $transF('stop_listening') : $transF('start_listening') }}
        </span>
      </SButton>
      <p v-if="state.error" class="text-red-500 text-sm">{{ state.error }}</p>
    </div>

    <div class="w-full max-w-lg p-4 my-4 bg-gray-50 rounded-lg min-h-[100px]">
      <p>{{ state.transcript }}</p>
    </div>

    <div class="w-full max-w-lg p-4 bg-blue-50 rounded-lg min-h-[100px]">
      <p>{{ state.aiResponse }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SButton } from '@alegradev/smile-ui-next'
import { $transF } from 'app_alegra_commons/translate'
import { speechRecognition } from '../services/SpeechRecognitionService'

const state = ref({
  isListening: false,
  isSupported: false,
  error: '',
  transcript: '',
  aiResponse: '',
})

onMounted(async () => {
  state.value.isSupported = speechRecognition.isRecognitionSupported()

  if (state.value.isSupported) {
    const initialized = await speechRecognition.initialize({
      language: 'es-ES',
      onStart: () => {
        state.value.error = ''
        console.log('Comenzó el reconocimiento de voz')
      },
      onEnd: () => {
        if (state.value.isListening) {
          speechRecognition.start()
        }
        console.log('Terminó el reconocimiento de voz')
      },
      onError: error => {
        state.value.error = `Error: ${error}`
        state.value.isListening = false
      },
      onResult: transcript => {
        state.value.transcript = transcript
      },
    })

    if (!initialized) {
      state.value.error = 'No se pudo acceder al micrófono'
      state.value.isSupported = false
    }
  }
})

const toggleListening = (): void => {
  if (!state.value.isSupported) return

  try {
    if (state.value.isListening) {
      speechRecognition.stop()
    } else {
      state.value.transcript = ''
      speechRecognition.start()
    }
    state.value.isListening = !state.value.isListening
  } catch (err) {
    state.value.error = 'Error al intentar acceder al micrófono'
    state.value.isListening = false
  }
}

onUnmounted(() => {
  speechRecognition.stop()
})
</script>
