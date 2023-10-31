import type { FetchStockComparison, FetchStockComparisonResponse } from '@/domain/contracts'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { right } from '@/shared/either'

export class FetchStockComparisonUseCase implements FetchStockComparison {
  constructor (private readonly fetchStockQuoteBySymbolApi: FetchStockQuoteBySymbolApi) {}

  async perform (stockSymbols: string[]): Promise<FetchStockComparisonResponse> {
    for (const symbol of stockSymbols) {
      await this.fetchStockQuoteBySymbolApi.fetchStockQuote(symbol)
    }
    return right({ lastPrices: [] })
  }
}
