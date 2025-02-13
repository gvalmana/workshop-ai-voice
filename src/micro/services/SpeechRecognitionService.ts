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
  private isSupported: boolean = false
  private config: SpeechRecognitionConfig = {}

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.isSupported = true
      console.log('Speech Recognition is supported')
    } else {
      console.warn('Speech Recognition is not supported')
    }
  }

  public async initialize(config: SpeechRecognitionConfig): Promise<boolean> {
    if (!this.isSupported) {
      return false
    }

    try {
      // Verificar permisos del micrófono
      await navigator.mediaDevices.getUserMedia({ audio: true })

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

    this.recognition.continuous = this.config.continuous ?? true
    this.recognition.interimResults = this.config.interimResults ?? true
    this.recognition.lang = this.config.language ?? 'es-ES'

    this.recognition.onstart = () => {
      console.log('Speech Recognition started')
      this.config.onStart?.()
    }

    this.recognition.onend = () => {
      console.log('Speech Recognition ended')
      this.config.onEnd?.()
    }

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech Recognition error:', event.error)
      this.config.onError?.(event.error)
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      console.log('Speech Recognition result:', result)
      this.config.onResult?.(result)
    }
  }

  public start(): void {
    if (this.recognition) {
      try {
        this.recognition.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        this.config.onError?.('Error starting recognition')
      }
    }
  }

  public stop(): void {
    if (this.recognition) {
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
