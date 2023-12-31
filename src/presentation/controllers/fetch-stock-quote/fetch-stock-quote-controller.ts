import type { FetchStockQuote } from '@/domain/contracts'
import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'
import { badRequest, notFound, ok, serverError } from '../../helpers/http/http-helper'

export class FetchStockQuoteController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly fetchStockQuote: FetchStockQuote
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const fetchStockQuoteResult = await this.fetchStockQuote.perform(httpRequest.params.stockSymbol)
      if (fetchStockQuoteResult.isLeft()) {
        return notFound(fetchStockQuoteResult.value)
      }
      return ok(fetchStockQuoteResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
