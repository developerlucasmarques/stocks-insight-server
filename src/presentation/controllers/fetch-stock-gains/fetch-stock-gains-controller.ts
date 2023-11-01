import type { FetchStockGains } from '@/domain/contracts'
import type { Controller, Validation } from '@/presentation/contracts'
import { InvalidPurchasedAmountError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import type { Either } from '@/shared/either'

export class FetchStockGainsController implements Controller {
  constructor (
    private readonly paramsValidation: Validation,
    private readonly queryValidation: Validation,
    private readonly fetchStockGains: FetchStockGains
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validations: Array<Either<Error, null>> = [
        await this.paramsValidation.validate(httpRequest.params),
        await this.queryValidation.validate(httpRequest.query)
      ]
      for (const validation of validations) {
        if (validation.isLeft()) {
          return badRequest(validation.value)
        }
      }
      const { stockSymbol } = httpRequest.params
      const { purchasedAt, purchasedAmount } = httpRequest.query
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
