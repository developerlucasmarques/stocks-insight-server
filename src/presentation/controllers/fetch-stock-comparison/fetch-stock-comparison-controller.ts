import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
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
    try {
      const validationsResult: Array<Either<Error, null>> = [
        await this.paransValidation.validate(httpRequest.params),
        await this.queryValidation.validate(httpRequest.query)
      ]
      for (const validation of validationsResult) {
        if (validation.isLeft()) {
          return badRequest(validation.value)
        }
      }
      const stocksToCompare = httpRequest.query.stocksToCompare as string
      let stocksToCompareArray: string[] = []
      if (stocksToCompare.includes(',')) {
        const split = stocksToCompare.split(',')
        stocksToCompareArray = split.filter(stock => stock.trim() !== '')
      }
      await this.fetchStockComparison.perform({
        stockSymbol: httpRequest.params.stockSymbol,
        stocksToCompare: (stocksToCompareArray.length > 0) ? stocksToCompareArray : [stocksToCompare]
      })
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
