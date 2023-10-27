import type { FetchStockQuote } from '@/domain/contracts/fetch-stock-quote'
import type { Controller } from '../contracts/controller'
import type { Validation } from '../contracts/validation'
import { badRequest, notFound, ok, serverError } from '../helpers/http-helper'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class FetchStockQuoteController implements Controller {
  constructor (
    private readonly validationStub: Validation,
    private readonly fetchStockQuote: FetchStockQuote
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validationStub.validate(httpRequest.params)
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
