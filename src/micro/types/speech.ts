export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[][]
  resultIndex: number
}

export interface SpeechRecognitionError {
  error: string
  message: string
}

export interface WebkitSpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: () => void
  onend: () => void
  onerror: (event: SpeechRecognitionError) => void
  onresult: (event: SpeechRecognitionEvent) => void
  start: () => void
  stop: () => void
}
