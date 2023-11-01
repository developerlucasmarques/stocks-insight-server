import type { FetchStockComparison } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import type { Either } from '@/shared/either'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly paramsValidation: Validation,
    private readonly queryValidation: Validation,
    private readonly fetchStockComparison: FetchStockComparison
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationsResult: Array<Either<Error, null>> = [
        await this.paramsValidation.validate(httpRequest.params),
        await this.queryValidation.validate(httpRequest.query)
      ]
      for (const validation of validationsResult) {
        if (validation.isLeft()) {
          return badRequest(validation.value)
        }
      }
      const stocksToCompare = httpRequest.query.stocksToCompare
      const fetchStockComparisonResult = await this.fetchStockComparison.perform({
        stockSymbol: httpRequest.params.stockSymbol,
        stocksToCompare: (stocksToCompare instanceof Array) ? stocksToCompare : [stocksToCompare]
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
