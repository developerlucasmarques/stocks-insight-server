import type { FetchStockGains } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { InvalidPurchasedAmountError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'

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
      if (Number(purchasedAmount) <= 0) {
        return badRequest(new InvalidPurchasedAmountError())
      }
      const fetchStockGainsResult = await this.fetchStockGains.perform({
        stockSymbol, purchasedAt, purchasedAmount: Number(purchasedAmount)
      })
      if (fetchStockGainsResult.isLeft()) {
        return notFound(fetchStockGainsResult.value)
      }
      return ok(fetchStockGainsResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
