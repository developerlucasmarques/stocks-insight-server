import type { FetchQuote, FetchQuoteResponse } from '@/domain/contracts/fetch-quote'
import type { FetchQuoteBySymbolApi } from '../contracts/api/fetch-quote-by-symbol-api'
import { left, right } from '@/shared/either'
import { StockQuoteNotFoundError } from '@/domain/errors/sotck-quote-not-found-error'

export class FetchQuoteUseCase implements FetchQuote {
  constructor (private readonly fetchQuoteBySymbolApi: FetchQuoteBySymbolApi) {}

  async perform (stockSymbol: string): Promise<FetchQuoteResponse> {
    const stockQuote = await this.fetchQuoteBySymbolApi.fetchQuote(stockSymbol)
    if (!stockQuote) {
      return left(new StockQuoteNotFoundError(stockSymbol))
    }
    return right(stockQuote)
  }
}
