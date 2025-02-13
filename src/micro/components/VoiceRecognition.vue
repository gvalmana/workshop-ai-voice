<template>
  <div class="flex flex-col items-center w-full max-w-2xl mx-auto">
    <div class="w-full flex flex-col items-center gap-4 my-4">
      <SButton
        :variant="isListening ? 'danger' : 'primary'"
        @click="toggleListening"
        :disabled="!isSupported"
        class="w-full max-w-xs font-medium"
      >
        <span v-if="!isSupported" class="font-medium">Micrófono no soportado</span>
        <span v-else class="font-medium">
          {{ isListening ? 'Detener' : 'Comenzar a escuchar' }}
        </span>
      </SButton>
      <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>
      <p v-if="isListening" class="text-green-500 font-medium animate-pulse">Escuchando...</p>
      <p v-else-if="isSupported" class="text-gray-600 font-medium">
        Di "Alegra" o presiona el botón para comenzar
      </p>
    </div>

    <!-- Transcripción con ícono -->
    <div class="w-full max-w-lg mb-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
          <SmIcon icon="microphone" class="w-5 h-5 text-gray-600" />
        </div>
        <span class="text-sm font-medium text-gray-600">Tu mensaje</span>
      </div>
      <div class="p-6 bg-gray-50 rounded-lg min-h-[100px] shadow-sm">
        <p class="text-gray-700 font-medium leading-relaxed">{{ transcript }}</p>
      </div>
    </div>

    <!-- Respuesta de IA con ícono -->
    <div class="w-full max-w-lg">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
          <SmIcon icon="sparkles" class="w-5 h-5 text-blue-600" />
        </div>
        <span class="text-sm font-medium text-gray-600">Respuesta de Alegra</span>
      </div>
      <div class="p-6 bg-blue-50 rounded-lg min-h-[100px] shadow-sm">
        <p v-if="isLoading" class="text-gray-500 font-medium animate-pulse">Procesando...</p>
        <template v-else>
          <p v-if="typeof aiResponse === 'object'" class="text-gray-800">
            <!-- Si es una respuesta de reporte -->
            <template v-if="aiResponse.message">
              <span class="font-medium leading-relaxed">{{ aiResponse.message }}</span>
              <span class="text-2xl ml-2">{{ aiResponse.emoji }}</span>
            </template>
            <!-- Si es una respuesta con URL -->
            <template v-else-if="aiResponse.url">
              <template v-if="aiResponse.redirect">
                <a
                  :href="`${HOPPER_BASE_URL}${aiResponse.url}`"
                  target="_blank"
                  class="text-blue-600 hover:underline font-medium"
                >
                  Redirigiendo...
                </a>
              </template>
              <template v-else>
                <span class="font-medium">{{ aiResponse.url }}</span>
              </template>
            </template>
          </p>
          <p v-else class="text-gray-800 font-medium leading-relaxed">{{ aiResponse || '' }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SButton, SmIcon } from '@alegradev/smile-ui-next'
import { speechRecognition } from '../services/SpeechRecognitionService'
import { apiService } from '../api/ApiService'
import { audioService } from '../services/AudioService'
import type { ApiResponse } from '../types/speech'

const HOPPER_BASE_URL = 'https://hopper.alegra.com'

const isListening = ref(false)
const isSupported = ref(false)
const error = ref('')
const transcript = ref('')
const aiResponse = ref<ApiResponse['response']>('')
const isLoading = ref(false)

onMounted(async () => {
  isSupported.value = speechRecognition.isRecognitionSupported()

  if (isSupported.value) {
    const initialized = await speechRecognition.initialize({
      language: 'es-ES',
      onStart: async () => {
        error.value = ''
        isListening.value = true
        await audioService.playStartSound()
      },
      onEnd: () => {
        isListening.value = false
        if (transcript.value) {
          sendToApi()
        }
      },
      onError: err => {
        error.value = `Error: ${err}`
        isListening.value = false
      },
      onResult: result => {
        transcript.value = result
      },
    })

    if (!initialized) {
      error.value = 'No se pudo inicializar el reconocimiento de voz'
      isSupported.value = false
    }
  }
})

const toggleListening = async () => {
  if (!isSupported.value) return

  try {
    if (isListening.value) {
      speechRecognition.stop()
    } else {
      transcript.value = ''
      aiResponse.value = ''
      await speechRecognition.start()
    }
  } catch (err) {
    error.value = 'Error al intentar acceder al micrófono'
    isListening.value = false
  }
}

const sendToApi = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await apiService.sendTranscript(transcript.value)

    if (result.error) {
      error.value = result.error
    } else {
      aiResponse.value = result.response

      // Reproducir audio si existe en la respuesta
      if (typeof result.response === 'object' && result.response.audio) {
        await audioService.playResponseAudio(result.response.audio)
      }

      // Manejar redirección si existe
      if (typeof result.response === 'object' && result.response.url && result.response.redirect) {
        const fullUrl = `${HOPPER_BASE_URL}${result.response.url}`
        window.open(fullUrl, '_blank')
      }
    }
  } catch (err) {
    error.value = 'Error al comunicarse con la API'
    console.error('API error:', err)
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  speechRecognition.stop()
  audioService.stopResponseAudio()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
