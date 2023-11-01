import type { FetchStockGains } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'

export class FetchStockGainsController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly fetchStockGains: FetchStockGains
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = await this.validation.validate(httpRequest.params)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { stockSymbol, purchasedAt, purchasedAmount } = httpRequest.params
      await this.fetchStockGains.perform({
        stockSymbol, purchasedAt, purchasedAmount: Number(purchasedAmount)
      })
      return await Promise.resolve({
        body: '', statusCode: 0
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
