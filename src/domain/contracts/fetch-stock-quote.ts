import type { Either } from '@/shared/either'
import type { StockQuote } from '../models/stock-quote'
import type { StockQuoteNotFoundError } from '../errors/sotck-quote-not-found-error'

export type FetchStockQuoteResponse = Either<StockQuoteNotFoundError, StockQuote>

export interface FetchStockQuote {
  perform: (stockSymbol: string) => Promise<FetchStockQuoteResponse>
}
