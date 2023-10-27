import type { FetchQuote } from '@/domain/contracts/fetch-quote'
import type { Controller } from '../contracts/controller'
import type { Validation } from '../contracts/validation'
import { badRequest, notFound, ok, serverError } from '../helpers/http-helper'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class FetchStockQuoteController implements Controller {
  constructor (
    private readonly validationStub: Validation,
    private readonly fetchQuote: FetchQuote
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validationStub.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const fetchQuoteResult = await this.fetchQuote.perform(httpRequest.params.stockSymbol)
      if (fetchQuoteResult.isLeft()) {
        return notFound(fetchQuoteResult.value)
      }
      return ok(fetchQuoteResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
