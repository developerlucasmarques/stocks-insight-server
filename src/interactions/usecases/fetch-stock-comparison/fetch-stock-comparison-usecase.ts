import type { FetchStockComparison, FetchStockComparisonResponse } from '@/domain/contracts'
import { NoStockQuoteFoundError } from '@/domain/errors'
import type { FetchManyStockQuotesBySymbolsApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockComparisonUseCase implements FetchStockComparison {
  constructor (private readonly fetchManyStockQuotesBySymbolsApi: FetchManyStockQuotesBySymbolsApi) {}

  async perform (stockSymbols: string[]): Promise<FetchStockComparisonResponse> {
    const stockQuotes = await this.fetchManyStockQuotesBySymbolsApi.fetchManyStockQuotes(stockSymbols)
    if (stockQuotes.length === 0) {
      return left(new NoStockQuoteFoundError())
    }
    return right({ lastPrices: stockQuotes })
  }
}
