import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'
import type { FetchStockHistory } from '@/domain/contracts'

export class FetchStockHistoryController implements Controller {
  constructor (
    private readonly paramsValidation: Validation,
    private readonly queryValidation: Validation,
    private readonly fetchStockHistory: FetchStockHistory
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const paramsValidationResult = await this.paramsValidation.validate(httpRequest.params)
      if (paramsValidationResult.isLeft()) {
        return badRequest(paramsValidationResult.value)
      }
      await this.queryValidation.validate(httpRequest.query)
      const { stockSymbol } = httpRequest.params
      const { from: initialDate, to: finalDate } = httpRequest.query
      const fetchStockHistoryResult = await this.fetchStockHistory.perform({
        stockSymbol, initialDate, finalDate
      })
      if (fetchStockHistoryResult.isLeft()) {
        return notFound(fetchStockHistoryResult.value)
      }
      return ok(fetchStockHistoryResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
