import type { AddAllStockSymbols } from '@/domain/contracts'
import { AddAllStockSymbolsUseCase } from '@/interactions/usecases'
import { fetchAllSymbolsOfListedStocksAlphaVantageApiFactory } from '../api'
import { stockSymbolsRedisCacheFactory } from '../cache/stock-symbols-redis-cache-factory'

export const addAllStockSymbolsUseCaseFactory = (): AddAllStockSymbols => {
  return new AddAllStockSymbolsUseCase(
    fetchAllSymbolsOfListedStocksAlphaVantageApiFactory(),
    stockSymbolsRedisCacheFactory()
  )
}
