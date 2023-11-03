import type { AddAllStockSymbols } from '@/domain/contracts'
import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api'
import type { AddAllStockSymbolsCache } from '@/interactions/contracts/cache'
import { AllStockSymbolsNotFoundError } from '@/domain/errors'

export class AddAllStockSymbolsUseCase implements AddAllStockSymbols {
  constructor (
    private readonly fetchAllSymbolsOfListedStocksApi: FetchAllSymbolsOfListedStocksApi,
    private readonly addAllStockSymbolsCache: AddAllStockSymbolsCache
  ) {}

  async perform (): Promise<void> {
    const symbols = await this.fetchAllSymbolsOfListedStocksApi.fetchAll()
    if (symbols.length === 0) {
      throw new AllStockSymbolsNotFoundError()
    }
    await this.addAllStockSymbolsCache.addAllSymbols(symbols)
  }
}
