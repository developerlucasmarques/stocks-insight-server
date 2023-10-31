import type { FetchStockSymbolCache } from '@/interactions/contracts/cache'
import type { Validation } from '@/presentation/contracts'
import { InvalidStockSymbolError } from '@/presentation/errors'
import { right, type Either, left } from '@/shared/either'

export class StockToCompareValidation implements Validation {
  constructor (private readonly fetchStockSymbolCache: FetchStockSymbolCache) {}

  async validate (input: any): Promise<Either<Error, null>> {
    const stocksToCompare = input.stocksToCompare as string
    let stocksToCompareArray: string[] = []
    if (stocksToCompare.includes(',')) {
      const split = stocksToCompare.split(',')
      stocksToCompareArray = split.filter(stock => stock.trim() !== '')
    }
    if (stocksToCompareArray.length > 0) {
      for (const stock of stocksToCompareArray) {
        const stockSymbol = await this.fetchStockSymbolCache.fetchOneSymbol(stock)
        if (!stockSymbol) {
          return left(new InvalidStockSymbolError(stock))
        }
      }
      return right(null)
    }
    const stockSymbol = await this.fetchStockSymbolCache.fetchOneSymbol(stocksToCompare)
    if (!stockSymbol) {
      return left(new InvalidStockSymbolError(stocksToCompare))
    }
    return right(null)
  }
}
