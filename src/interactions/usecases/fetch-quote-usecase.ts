import type { FetchQuote, FetchQuoteResponse } from '@/domain/contracts/fetch-quote'
import type { FetchQuoteBySymbolApi } from '../contracts/api/fetch-quote-by-symbol-api'
import { right } from '@/shared/either'

export class FetchQuoteUseCase implements FetchQuote {
  constructor (private readonly fetchQuoteBySymbolApi: FetchQuoteBySymbolApi) {}

  async perform (stockSymbol: string): Promise<FetchQuoteResponse> {
    await this.fetchQuoteBySymbolApi.fetchQuote(stockSymbol)
    return await Promise.resolve(
      right({ name: '', lastPrice: 0, pricedAt: '' })
    )
  }
}
