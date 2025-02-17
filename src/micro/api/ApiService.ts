import type { ApiResponse } from '../types/speech'

class ApiService {
  private baseUrl: string = 'http://localhost:3000'

  private isReportRelated(transcript: string): boolean {
    const reportKeywords = [
      // Reportes y documentos
      'reporte',
      'reportes',
      'informe',
      'informes',
      'balance',
      'balances',
      'estadística',
      'estadísticas',
      // Verbos de visualización
      'muéstrame',
      'muestrame',
      'mostrar',
      'mostrame',
      'ver',
      'visualizar',
      'enseñame',
      'enséñame',
      // Consultas específicas
      'ventas',
      'ingresos',
      'gastos',
      'ganancias',
      'pérdidas',
      'inventario',
      // Períodos
      'mensual',
      'anual',
      'trimestral',
      'semestral',
      // Frases comunes
      'dame un resumen',
      'necesito saber',
    ]
    const lowercaseTranscript = transcript.toLowerCase()
    return reportKeywords.some(keyword => lowercaseTranscript.includes(keyword))
  }

  async sendTranscript(transcript: string): Promise<ApiResponse> {
    try {
      // Determinar el endpoint basado en el contenido
      const endpoint = this.isReportRelated(transcript) ? '/report-summary' : '/assistant'

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      return {
        response: data || '',
      }
    } catch (error) {
      console.error('Error calling API:', error)
      return {
        response: '',
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }
}

export const apiService = new ApiService()
