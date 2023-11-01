import type { StockQuote } from './stock-quote'
import type { StockQuoteAtDate } from './stock-quote-at-date'

export type StockQuoteAtDateAndLastDate = {
  quoteAtDate: StockQuoteAtDate
  quoteLastDate: StockQuote
}
