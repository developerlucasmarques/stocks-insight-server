import type { FetchStockGains, FetchStockGainsData, FetchStockGainsResponse } from '@/domain/contracts'
import { CalculateStockGains } from '@/domain/core/calculate-stock-gains'
import { StockQuoteAtDateNotFoundError } from '@/domain/errors'
import type { FetchStockQuoteAtDateAndLastDateApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockGainsUseCase implements FetchStockGains {
  constructor (
    private readonly fetchStockQuoteAtDateApi: FetchStockQuoteAtDateAndLastDateApi
  ) {}

  async perform (data: FetchStockGainsData): Promise<FetchStockGainsResponse> {
    const { stockSymbol, purchasedAt, purchasedAmount } = data
    const stockQuotes = await this.fetchStockQuoteAtDateApi.fetchStockQuoteAtDate({
      stockSymbol, quoteAtDate: purchasedAt
    })
    if (!stockQuotes) {
      return left(new StockQuoteAtDateNotFoundError(stockSymbol, purchasedAt))
    }
    const { quoteAtDate: { pricedAtDate }, quoteLastDate: { lastPrice } } = stockQuotes
    const { capitalGains } = CalculateStockGains.execute({
      purchasedAmount, lastPrice, pricedAtDate
    })
    return right({
      name: stockSymbol, lastPrice, pricedAtDate, purchasedAmount, purchasedAt, capitalGains
    })
  }
}
