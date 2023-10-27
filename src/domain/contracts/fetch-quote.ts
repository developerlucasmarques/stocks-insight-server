import type { Either } from '@/shared/either'
import type { StockQuote } from '../models/stock-quote'
import type { StockQuoteNotFoundError } from '../errors/sotck-quote-not-found-error'

export type FetchQuoteResponse = Either<StockQuoteNotFoundError, StockQuote>

export interface FetchQuote {
  perform: (stockSymbol: string) => Promise<FetchQuoteResponse>
}
