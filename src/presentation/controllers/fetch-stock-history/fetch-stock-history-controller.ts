import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'
import type { FetchStockHistory } from '@/domain/contracts'

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
      await this.fetchStockHistory.perform({ stockSymbol, initialDate, finalDate })
      return { statusCode: 0, body: '' }
    } catch (error: any) {
      return serverError(error)
    }
  }
}
