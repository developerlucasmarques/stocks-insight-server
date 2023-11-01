import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'

export type FetchStockQuoteAtDateApiData = {
  stockSymbol: string
  quoteDate: string
}

export interface FetchStockQuoteAtDateApi {
  fetchStockQuoteAtDate: (data: FetchStockQuoteAtDateApiData) => Promise<null | StockQuoteAtDate>
}
