import type { FetchStockQuote, FetchStockQuoteResponse } from '@/domain/contracts'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'
import { StockQuoteNotFoundError } from '@/domain/errors'

export class FetchStockQuoteUseCase implements FetchStockQuote {
  constructor (private readonly fetchStockQuoteBySymbolApi: FetchStockQuoteBySymbolApi) {}

  async perform (stockSymbol: string): Promise<FetchStockQuoteResponse> {
    const stockQuote = await this.fetchStockQuoteBySymbolApi.fetchStockQuote(stockSymbol)
    if (!stockQuote) {
      return left(new StockQuoteNotFoundError(stockSymbol))
    }
    return right(stockQuote)
  }
}
