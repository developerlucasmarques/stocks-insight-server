import type { Either } from '@/shared/either'
import type { NoStockQuoteFoundError } from '../errors'
import type { StockComparison } from '../models/stock-comparison'

export type FetchStockComparisonResponse = Either<NoStockQuoteFoundError, StockComparison>

export interface FetchStockComparison {
  perform: (stockSymbols: string[]) => Promise<FetchStockComparisonResponse>
}
