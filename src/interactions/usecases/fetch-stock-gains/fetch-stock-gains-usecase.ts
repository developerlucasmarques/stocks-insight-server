import type { FetchStockGains, FetchStockGainsData, FetchStockGainsResponse } from '@/domain/contracts'
import { CalculateStockGains } from '@/domain/core/calculate-stock-gains'
import { StockQuoteAtDateNotFoundError, StockQuoteNotFoundError } from '@/domain/errors'
import type { FetchStockQuoteAtDateApi, FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockGainsUseCase implements FetchStockGains {
  constructor (
    private readonly fetchStockQuoteAtDateApi: FetchStockQuoteAtDateApi,
    private readonly fetchStockQuoteBySymbolApi: FetchStockQuoteBySymbolApi
  ) {}

  async perform (data: FetchStockGainsData): Promise<FetchStockGainsResponse> {
    const { stockSymbol, purchasedAt, purchasedAmount } = data
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
    const { lastPrice } = stockQuote
    const { pricedAtDate } = stockQuoteAtDate
    const { capitalGains } = CalculateStockGains.execute({
      purchasedAmount, lastPrice, pricedAtDate
    })
    return right({
      name: stockSymbol, lastPrice, pricedAtDate, purchasedAmount, purchasedAt, capitalGains
    })
  }
}
