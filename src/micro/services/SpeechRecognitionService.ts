import type {
  WebkitSpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionError,
} from '../types/speech'

export interface SpeechRecognitionConfig {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  onResult?: (transcript: string) => void
}

class SpeechRecognitionService {
  private recognition: WebkitSpeechRecognition | null = null
  private keywordRecognition: WebkitSpeechRecognition | null = null
  private isSupported: boolean = false
  private config: SpeechRecognitionConfig = {}
  private isRecognitionActive: boolean = false

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.keywordRecognition = new (window as any).webkitSpeechRecognition()
      this.isSupported = true
      this.setupKeywordRecognition()
      console.log('Speech Recognition is supported')
    } else {
      console.warn('Speech Recognition is not supported')
    }
  }

  private setupKeywordRecognition(): void {
    if (!this.keywordRecognition) return

    this.keywordRecognition.continuous = true
    this.keywordRecognition.interimResults = true
    this.keywordRecognition.lang = 'es-ES'

    this.keywordRecognition.onresult = (event: SpeechRecognitionEvent) => {
      // TODO: Implementar la detección de la palabra "Alegra"
      // 1. Obtener el texto del resultado
      // 2. Verificar si contiene la palabra clave
      // 3. Iniciar el reconocimiento principal si se detecta
    }

    this.keywordRecognition.onend = () => {
      // Reiniciamos la escucha de palabra clave solo si no está activo el reconocimiento principal
      if (!this.isRecognitionActive) {
        setTimeout(() => {
          if (this.isSupported) {
            this.keywordRecognition?.start()
          }
        }, 100)
      }
    }

    this.keywordRecognition.start()
  }

  public async initialize(config: SpeechRecognitionConfig): Promise<boolean> {
    if (!this.isSupported) return false

    try {
      this.config = config
      this.setupRecognition()
      return true
    } catch (err) {
      console.error('Error during initialization:', err)
      return false
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = true
    this.recognition.lang = this.config.language ?? 'es-ES'

    this.recognition.onstart = () => {
      console.log('Recognition started')
      this.isRecognitionActive = true
      this.config.onStart?.()
    }

    this.recognition.onend = () => {
      console.log('Recognition ended')
      this.isRecognitionActive = false
      this.config.onEnd?.()
      // Reanudamos la escucha de palabra clave
      setTimeout(() => {
        if (this.isSupported && !this.isRecognitionActive) {
          this.keywordRecognition?.start()
        }
      }, 100)
    }

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Recognition error:', event.error)
      this.isRecognitionActive = false
      this.config.onError?.(event.error)
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      this.config.onResult?.(result)
    }
  }

  public start(): void {
    if (this.recognition && !this.isRecognitionActive) {
      try {
        this.recognition.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        this.config.onError?.('Error starting recognition')
      }
    }
  }

  public stop(): void {
    if (this.recognition && this.isRecognitionActive) {
      try {
        this.recognition.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported
  }
}

export const speechRecognition = new SpeechRecognitionService()
