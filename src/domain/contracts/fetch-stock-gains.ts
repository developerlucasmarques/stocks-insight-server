import type { Either } from '@/shared/either'
import type { StockHistoryNotFoundError, StockQuoteNotFoundError } from '../errors'
import type { StockGains } from '../models/stock-gains'

export type FetchStockGainsData = {
  stockSymbol: string
  purchasedAt: string
  purchasedAmount: number
}

export type FetchStockGainsResponse = Either<StockHistoryNotFoundError | StockQuoteNotFoundError, StockGains>

export interface FetchStockGains {
  perform: (data: FetchStockGainsData) => Promise<FetchStockGainsResponse>
}
