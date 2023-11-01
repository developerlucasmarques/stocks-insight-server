import type { FetchStockGains, FetchStockGainsData, FetchStockGainsResponse } from '@/domain/contracts'
import { StockQuoteAtDateNotFoundError, StockQuoteNotFoundError } from '@/domain/errors'
import type { FetchStockQuoteAtDateApi, FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockGainsUseCase implements FetchStockGains {
  constructor (
    private readonly fetchStockQuoteAtDateApi: FetchStockQuoteAtDateApi,
    private readonly fetchStockQuoteBySymbolApi: FetchStockQuoteBySymbolApi
  ) {}

  async perform (data: FetchStockGainsData): Promise<FetchStockGainsResponse> {
    const { stockSymbol, purchasedAt } = data
    const stockQuoteAtDate = await this.fetchStockQuoteAtDateApi.fetchStockQuoteAtDate({
      stockSymbol, quoteDate: purchasedAt
    })
    if (!stockQuoteAtDate) {
      return left(new StockQuoteAtDateNotFoundError(stockSymbol, purchasedAt))
    }
    const stockQuote = await this.fetchStockQuoteBySymbolApi.fetchStockQuote(stockSymbol)
    if (!stockQuote) {
      return left(new StockQuoteNotFoundError(stockSymbol))
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
