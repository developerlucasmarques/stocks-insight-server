import type { FetchStockComparison, FetchStockComparisonData, FetchStockComparisonResponse } from '@/domain/contracts'
import { NoStockQuoteFoundError } from '@/domain/errors'
import type { FetchManyStockQuotesBySymbolsApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockComparisonUseCase implements FetchStockComparison {
  constructor (private readonly fetchManyStockQuotesBySymbolsApi: FetchManyStockQuotesBySymbolsApi) {}

  async perform (data: FetchStockComparisonData): Promise<FetchStockComparisonResponse> {
    const stocks = [data.stockSymbol]
    data.stocksToCompare.forEach((stock) => stocks.push(stock))
    const stockQuotes = await this.fetchManyStockQuotesBySymbolsApi.fetchManyStockQuotes(stocks)
    if (stockQuotes.length === 0) {
      return left(new NoStockQuoteFoundError())
    }
    return right({ lastPrices: stockQuotes })
  }
}
