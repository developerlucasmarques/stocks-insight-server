import type { StockQuoteAtDateAndLastDate } from '@/domain/models/stock-quote-at-date-and-last-date'

export type FetchStockQuoteAtDateAndLastDateApiData = {
  stockSymbol: string
  quoteAtDate: string
}

export interface FetchStockQuoteAtDateAndLastDateApi {
  fetchStockQuoteAtDate: (data: FetchStockQuoteAtDateAndLastDateApiData) => Promise<null | StockQuoteAtDateAndLastDate>
}
