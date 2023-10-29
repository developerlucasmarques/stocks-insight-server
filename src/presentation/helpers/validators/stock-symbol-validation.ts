import type { FetchStockSymbolCache } from '@/interactions/contracts/cache'
import type { Validation } from '@/presentation/contracts'
import { InvalidStockSymbolError } from '@/presentation/errors'
import { type Either, right, left } from '@/shared/either'

export class StockSymbolValidation implements Validation {
  constructor (private readonly fetchStockSymbolCache: FetchStockSymbolCache) {}

  async validate (input: any): Promise<Either<Error, null>> {
    const stockSymbol = await this.fetchStockSymbolCache.fetchOneSymbol(input.stockSymbol)
    if (!stockSymbol) {
      return left(new InvalidStockSymbolError(input.stockSymbol))
    }
    return await Promise.resolve(right(null))
  }
}
