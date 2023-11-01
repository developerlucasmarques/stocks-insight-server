import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class FetchStockGainsController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      return await Promise.resolve({
        body: '', statusCode: 0
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
