import type { HttpResponse } from '../http-types/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
