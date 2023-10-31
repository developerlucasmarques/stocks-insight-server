import { badRequest } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { type Either } from '@/shared/either'

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
    const validationsResult: Array<Either<Error, null>> = []
    const stocksToCompare: string[] = httpRequest.query?.stocksToCompare.split(',')
    for (const stock of stocksToCompare) {
      validationsResult.push(await this.queryValidation.validate({ stockSymbol: stock }))
    }
    for (const validation of validationsResult) {
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
    }
    return { statusCode: 0, body: '' }
  }
}
