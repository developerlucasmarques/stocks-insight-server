import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'

export class FetchStockHistoryController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
