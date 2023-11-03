import type { FetchStockComparison } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly fetchStockComparison: FetchStockComparison
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { stockSymbol, stocksToCompare } = httpRequest.params
      const fetchStockComparisonResult = await this.fetchStockComparison.perform({
        stocksToCompare: (stocksToCompare instanceof Array) ? stocksToCompare : [stocksToCompare],
        stockSymbol
      })
      if (fetchStockComparisonResult.isLeft()) {
        return notFound(fetchStockComparisonResult.value)
      }
      return ok(fetchStockComparisonResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
