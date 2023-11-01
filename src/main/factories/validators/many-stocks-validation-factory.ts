import type { Validation } from '@/presentation/contracts'
import { ManyStocksValidation } from '@/presentation/helpers/validators'
import { stockSymbolsRedisCacheFactory } from '../cache/stock-symbols-redis-cache-factory'

export const manyStocksValidationFactory = (): Validation => {
  return new ManyStocksValidation(stockSymbolsRedisCacheFactory())
}
