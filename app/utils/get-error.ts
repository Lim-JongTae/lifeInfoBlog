import { type ZodError } from 'zod'

export interface ApiError {
  statusCode: number
  statusMessage: string
}

export const getZodError = (error: ZodError<any>): ApiError => {
  const firstError = error.issues[0]
  return {
    statusCode: 400,
    statusMessage: firstError?.message || '유효성 검사에 실패했습니다.'
  }
}

export const getApiError = (error: any): ApiError => {
  return {
    statusCode: error?.statusCode || 500,
    statusMessage: error?.statusMessage || error?.message || '오류가 발생했습니다.'
  }
}