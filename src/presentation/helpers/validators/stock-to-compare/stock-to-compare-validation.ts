import type { FetchStockSymbolCache } from '@/interactions/contracts/cache'
import type { Validation } from '@/presentation/contracts'
import { InvalidStockSymbolError } from '@/presentation/errors'
import { right, type Either, left } from '@/shared/either'

export class StockToCompareValidation implements Validation {
  constructor (private readonly fetchStockSymbolCache: FetchStockSymbolCache) {}

  async validate (input: any): Promise<Either<Error, null>> {
    const stocksToCompare: string[] = input.stocksToCompare
    for (const stock of stocksToCompare) {
      const stockSymbol = await this.fetchStockSymbolCache.fetchOneSymbol(stock)
      if (!stockSymbol) {
        return left(new InvalidStockSymbolError(stock))
      }
    }
    return right(null)
  }
}
