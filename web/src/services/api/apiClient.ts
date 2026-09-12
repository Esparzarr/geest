export interface ApiClientErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

export type ApiClientError = Error
