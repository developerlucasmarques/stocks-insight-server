import type { FetchQuote } from '@/domain/contracts/fetch-quote'
import type { Controller } from '../contracts/controller'
import type { Validation } from '../contracts/validation'
import { badRequest, notFound, serverError } from '../helpers/http-helper'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class FetchQuoteController implements Controller {
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
      return await Promise.resolve({
        body: '', statusCode: 0
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
