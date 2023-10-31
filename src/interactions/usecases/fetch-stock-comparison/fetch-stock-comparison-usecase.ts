import type { FetchStockComparison, FetchStockComparisonResponse } from '@/domain/contracts'
import type { FetchManyStockQuotesBySymbolsApi } from '@/interactions/contracts/api'
import { right } from '@/shared/either'

export class FetchStockComparisonUseCase implements FetchStockComparison {
  constructor (private readonly fetchManyStockQuotesBySymbolsApi: FetchManyStockQuotesBySymbolsApi) {}

  async perform (stockSymbols: string[]): Promise<FetchStockComparisonResponse> {
    await this.fetchManyStockQuotesBySymbolsApi.fetchManyStockQuotes(stockSymbols)
    return right({ lastPrices: [] })
  }
}
