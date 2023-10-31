import type { Either } from '@/shared/either'
import type { StockHistoryNotFoundError } from '../errors/stock-history-not-found-error'
import type { StockHistory } from '../models/stock-history'

export type FetchStockHistoryData = {
  stockSymbol: string
  initialDate: string
  finalDate: string
}

export type FetchStockHistoryResponse = Either<StockHistoryNotFoundError, StockHistory>

export interface FetchStockHistory {
  perform: (data: FetchStockHistoryData) => Promise<FetchStockHistoryResponse>
}
