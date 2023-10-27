import type { StockQuote } from '@/domain/models/stock-quote'

export interface FetchQuoteBySymbolApi {
  fetchQuote: (stockSymbol: string) => Promise<null | StockQuote>
}
