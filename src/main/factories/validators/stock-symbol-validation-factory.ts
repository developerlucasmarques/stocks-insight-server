import type { Validation } from '@/presentation/contracts'
import { StockSymbolValidation } from '@/presentation/helpers/validators/stock-symbol-validation'
import { stockSymbolsRedisCacheFactory } from '../cache/stock-symbols-redis-cache-factory'

export const stockSymbolValidationFactory = (): Validation => {
  return new StockSymbolValidation(stockSymbolsRedisCacheFactory())
}
