import type { Either } from '@/shared/either'
import type { StockQuoteAtDateNotFoundError, StockQuoteNotFoundError } from '../errors'
import type { StockGains } from '../models/stock-gains'

export type FetchStockGainsData = {
  stockSymbol: string
  purchasedAt: string
  purchasedAmount: number
}

export type FetchStockGainsResponse = Either<
StockQuoteAtDateNotFoundError | StockQuoteNotFoundError, StockGains
>

export interface FetchStockGains {
  perform: (data: FetchStockGainsData) => Promise<FetchStockGainsResponse>
}
