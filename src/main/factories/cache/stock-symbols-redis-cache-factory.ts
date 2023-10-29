import { StockSymbolsRedisCache } from '@/infra/cache/redis/stock-symbols-redis-cache'

export const stockSymbolsRedisCacheFactory = (): StockSymbolsRedisCache => {
  return new StockSymbolsRedisCache()
}
