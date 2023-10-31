import { badRequest } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import type { Either } from '@/shared/either'
import type { FetchStockComparison } from '@/domain/contracts'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly paransValidation: Validation,
    private readonly queryValidation: Validation,
    private readonly fetchStockComparison: FetchStockComparison
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationsResult: Array<Either<Error, null>> = [
      await this.paransValidation.validate(httpRequest.params),
      await this.queryValidation.validate(httpRequest.query)
    ]
    for (const validation of validationsResult) {
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
    }
    const stockSymbol = httpRequest.params.stockSymbol
    const stocksToCompare = httpRequest.query.stocksToCompare as string
    let stocksToCompareSplit: string[] = []
    if (stocksToCompare.includes(',')) {
      stocksToCompareSplit = stocksToCompare.split(',')
    }
    await this.fetchStockComparison.perform({
      stockSymbol,
      stocksToCompare: (stocksToCompareSplit.length > 0) ? stocksToCompareSplit : [stocksToCompare]
    })
    return { statusCode: 0, body: '' }
  }
}
