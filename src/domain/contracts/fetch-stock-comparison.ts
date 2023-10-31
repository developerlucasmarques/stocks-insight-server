import type { Either } from '@/shared/either'
import type { StockQuoteNotFoundError } from '../errors/sotck-quote-not-found-error'
import type { StockComparison } from '../models/stock-comparison'

export type FetchStockComparisonResponse = Either<StockQuoteNotFoundError, StockComparison>

export interface FetchStockComparison {
  perform: (stockSymbols: string[]) => Promise<FetchStockComparisonResponse>
}
