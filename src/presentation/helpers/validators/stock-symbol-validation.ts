import type { FetchStockSymbolCache } from '@/interactions/contracts/cache/fetch-stock-symbol-cache'
import type { Validation } from '@/presentation/contracts/validation'
import { type Either, right } from '@/shared/either'

export class StockSymbolValidation implements Validation {
  constructor (private readonly fetchStockSymbolCache: FetchStockSymbolCache) {}

  async validate (input: any): Promise<Either<Error, null>> {
    await this.fetchStockSymbolCache.fetchOneSymbol(input.stockSymbol)
    return await Promise.resolve(right(null))
  }
}
