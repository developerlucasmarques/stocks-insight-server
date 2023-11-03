import type { FetchStockHistory } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class FetchStockHistoryController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly fetchStockHistory: FetchStockHistory
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { stockSymbol, from: initialDate, to: finalDate } = httpRequest.params
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
