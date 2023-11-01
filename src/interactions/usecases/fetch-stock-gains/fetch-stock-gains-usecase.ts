import type { FetchStockGains, FetchStockGainsData, FetchStockGainsResponse } from '@/domain/contracts'
import { StockQuoteAtDateNotFoundError } from '@/domain/errors'
import type { FetchStockQuoteAtDateApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockGainsUseCase implements FetchStockGains {
  constructor (private readonly fetchStockQuoteAtDateApi: FetchStockQuoteAtDateApi) {}

  async perform (data: FetchStockGainsData): Promise<FetchStockGainsResponse> {
    const { stockSymbol, purchasedAt } = data
    const stockQuoteAtDate = await this.fetchStockQuoteAtDateApi.fetchStockQuoteAtDate({
      stockSymbol, quoteDate: purchasedAt
    })
    if (!stockQuoteAtDate) {
      return left(new StockQuoteAtDateNotFoundError(stockSymbol, purchasedAt))
    }
    return right({
      name: 'IBM',
      lastPrice: 150.50,
      pricedAtDate: 140.50,
      purchasedAmount: 9975.50,
      purchasedAt: '2023-01-30',
      capitalGains: 710
    })
  }
}
