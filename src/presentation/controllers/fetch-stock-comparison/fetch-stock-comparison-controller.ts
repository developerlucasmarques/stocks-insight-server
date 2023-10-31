import { badRequest } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly paransValidation: Validation,
    private readonly queryValidation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const paramsValidationResult = await this.paransValidation.validate(httpRequest.params)
    if (paramsValidationResult.isLeft()) {
      return badRequest(paramsValidationResult.value)
    }
    const stocksToCompare: string[] = httpRequest.query?.stocksToCompare.split(',')
    for (const stock of stocksToCompare) {
      await this.queryValidation.validate({ stockSymbol: stock })
    }
    return { statusCode: 0, body: '' }
  }
}
