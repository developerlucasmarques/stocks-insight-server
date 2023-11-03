import type { HttpRequest, HttpResponse } from '../http-types/http'
import type { Middleware } from '../contracts'
import { ok, serverError } from '../helpers/http/http-helper'

export class ConvertToUppercaseMiddleware implements Middleware {
  constructor (
    private readonly keyOfHttpRequest: keyof HttpRequest,
    private readonly fieldName: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const key = this.keyOfHttpRequest
      const field = this.fieldName
      if (httpRequest[key][field] instanceof Array) {
        for (let i = 0; i < httpRequest[key][field].length; i++) {
          httpRequest[key][field][i] = httpRequest[key]?.[field][i].toUpperCase()
        }
        return ok(httpRequest[key])
      }
      httpRequest[key][field] = httpRequest[key]?.[field].toUpperCase()
      return ok(httpRequest[key])
    } catch (error: any) {
      return serverError(error)
    }
  }
}
