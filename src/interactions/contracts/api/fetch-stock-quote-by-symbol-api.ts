import type { StockQuote } from '@/domain/models/stock-quote'

export interface FetchStockQuoteBySymbolApi {
  fetchStockQuote: (stockSymbol: string) => Promise<null | StockQuote>
}
