import type { Either } from '@/shared/either'
import type { StockSymbolsNotFoundError } from '../errors/stock-symbols-not-found-error'

export type AddAllStockSymbolsResponse = Either<StockSymbolsNotFoundError, null>

export interface AddAllStockSymbols {
  perform: () => Promise<AddAllStockSymbolsResponse>
}
