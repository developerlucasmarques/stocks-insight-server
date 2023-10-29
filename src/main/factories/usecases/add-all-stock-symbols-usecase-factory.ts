import type { AddAllStockSymbols } from '@/domain/contracts'
import { AddAllStockSymbolsUseCase } from '@/interactions/usecases'
import { eodhdApiFactory } from '../api/eodhd-api-factory'
import { stockSymbolsRedisCacheFactory } from '../cache/stock-symbols-redis-cache-factory'

export const addAllStockSymbolsUseCaseFactory = (): AddAllStockSymbols => {
  return new AddAllStockSymbolsUseCase(eodhdApiFactory(), stockSymbolsRedisCacheFactory())
}
