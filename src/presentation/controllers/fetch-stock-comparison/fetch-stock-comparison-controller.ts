import { badRequest } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly paransValidation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const paramsValidationResult = await this.paransValidation.validate(httpRequest.params)
    if (paramsValidationResult.isLeft()) {
      return badRequest(paramsValidationResult.value)
    }
    return { statusCode: 0, body: '' }
  }
}
