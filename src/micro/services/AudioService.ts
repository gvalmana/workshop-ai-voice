import notificationSound from '../assets/notification.mp3'

class AudioService {
  private notificationAudio: HTMLAudioElement | null = null
  private responseAudio: HTMLAudioElement | null = null
  private initialized: boolean = false
  private hasUserInteracted: boolean = false

  constructor() {
    this.notificationAudio = new Audio(notificationSound)
    // Escuchar cualquier interacción del usuario con la página
    document.addEventListener('click', () => this.handleUserInteraction())
    document.addEventListener('keydown', () => this.handleUserInteraction())
    document.addEventListener('touchstart', () => this.handleUserInteraction())
  }

  private handleUserInteraction(): void {
    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true
      this.initialize()
    }
  }

  public async initialize(): Promise<void> {
    try {
      if (this.notificationAudio && !this.initialized) {
        await this.notificationAudio.load()
        this.notificationAudio.volume = 0.5
        this.initialized = true
      }
    } catch (error) {
      console.error('Error initializing audio:', error)
    }
  }

  public async playStartSound(): Promise<void> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (this.notificationAudio) {
        this.notificationAudio.currentTime = 0
        await this.notificationAudio.play()
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }

  public async playResponseAudio(base64Audio: string): Promise<void> {
    try {
      // Convertir base64 a blob
      const audioData = atob(base64Audio)
      const arrayBuffer = new ArrayBuffer(audioData.length)
      const view = new Uint8Array(arrayBuffer)

      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i)
      }

      const blob = new Blob([arrayBuffer], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(blob)

      // Crear y reproducir el audio
      if (this.responseAudio) {
        URL.revokeObjectURL(this.responseAudio.src) // Limpiar URL anterior
      }

      this.responseAudio = new Audio(audioUrl)
      await this.responseAudio.play()
    } catch (error) {
      console.error('Error playing response audio:', error)
    }
  }

  public stopResponseAudio(): void {
    if (this.responseAudio) {
      this.responseAudio.pause()
      this.responseAudio.currentTime = 0
    }
  }

  public hasInteracted(): boolean {
    return this.hasUserInteracted
  }
}

export const audioService = new AudioService()
