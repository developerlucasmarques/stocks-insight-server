import type { AddAllStockSymbols, AddAllStockSymbolsResponse } from '@/domain/contracts/add-all-stock-symbols'
import { StockSymbolsNotFoundError } from '@/domain/errors/stock-symbols-not-found-error'
import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api/fetch-all-symbols-of-listed-stocks-api'
import type { AddAllStockSymbolsCache } from '@/interactions/contracts/cache/add-all-stock-symbols-cache'
import { left, right } from '@/shared/either'

export class AddAllStockSymbolsUseCase implements AddAllStockSymbols {
  constructor (
    private readonly fetchAllSymbolsOfListedStocksApi: FetchAllSymbolsOfListedStocksApi,
    private readonly addAllStockSymbolsCache: AddAllStockSymbolsCache
  ) {}

  async perform (): Promise<AddAllStockSymbolsResponse> {
    const symbols = await this.fetchAllSymbolsOfListedStocksApi.fetchAll()
    if (symbols.length === 0) {
      return left(new StockSymbolsNotFoundError())
    }
    await this.addAllStockSymbolsCache.addAllSymbols(symbols)
    return right(null)
  }
}
