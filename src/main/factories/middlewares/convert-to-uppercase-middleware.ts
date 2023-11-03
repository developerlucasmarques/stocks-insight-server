import type { Middleware } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { ConvertToUppercaseMiddleware } from '@/presentation/middlewares'

export const converToUppercaseMiddlewareFactory = (
  keyOfHttpRequest: keyof HttpRequest, fieldName: string
): Middleware => {
  return new ConvertToUppercaseMiddleware(keyOfHttpRequest, fieldName)
}
