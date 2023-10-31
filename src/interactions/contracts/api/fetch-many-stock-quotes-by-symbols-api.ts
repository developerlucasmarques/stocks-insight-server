import type { StockQuote } from '@/domain/models/stock-quote'

export interface FetchManyStockQuotesBySymbolsApi {
  fetchManyStockQuotes: (stockSymbols: string[]) => Promise<null | StockQuote[]>
}
