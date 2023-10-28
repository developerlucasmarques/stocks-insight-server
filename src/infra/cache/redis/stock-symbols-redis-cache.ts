import type { AddAllStockSymbolsCache } from '@/interactions/contracts/cache/add-all-stock-symbols-cache'
import { RedisHelper } from './helpers/redis-helper'

export class StockSymbolsRedisCache implements AddAllStockSymbolsCache {
  async addAllSymbols (symbols: string[]): Promise<void> {
    const redis = RedisHelper.getInstance()
    await redis.set('stockSymbols', JSON.stringify(symbols))
  }
}
