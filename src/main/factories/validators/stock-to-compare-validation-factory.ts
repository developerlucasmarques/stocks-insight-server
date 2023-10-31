import type { Validation } from '@/presentation/contracts'
import { StockToCompareValidation } from '@/presentation/helpers/validators/stock-to-compare/stock-to-compare-validation'
import { stockSymbolsRedisCacheFactory } from '../cache/stock-symbols-redis-cache-factory'

export const stockToCompareValidationFactory = (): Validation => {
  return new StockToCompareValidation(stockSymbolsRedisCacheFactory())
}
