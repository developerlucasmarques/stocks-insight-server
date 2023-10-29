import type { AddAllStockSymbolsCache, FetchStockSymbolCache, StockSymbol } from '@/interactions/contracts/cache'
import { RedisHelper } from './helpers/redis-helper'

export class StockSymbolsRedisCache implements AddAllStockSymbolsCache, FetchStockSymbolCache {
  async addAllSymbols (symbols: string[]): Promise<void> {
    const redis = RedisHelper.getInstance()
    await redis.set('stockSymbols', JSON.stringify(symbols))
  }

  async fetchOneSymbol (stockSymbol: string): Promise<null | StockSymbol> {
    const redis = RedisHelper.getInstance()
    const symbolsJson = await redis.get('stockSymbols')
    if (!symbolsJson) return null
    const allSymbols: string[] = JSON.parse(symbolsJson)
    const symbol = allSymbols.find((symbol) => symbol === stockSymbol)
    if (!symbol) return null
    return { symbol }
  }
}
