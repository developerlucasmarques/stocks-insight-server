import type { AddAllStockSymbols, AddAllStockSymbolsResponse } from '@/domain/contracts/add-all-stock-symbols'
import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api/fetch-all-symbols-of-listed-stocks-api'
import { right } from '@/shared/either'

export class AddAllStockSymbolsUseCase implements AddAllStockSymbols {
  constructor (
    private readonly fetchAllSymbols: FetchAllSymbolsOfListedStocksApi
  ) {}

  async perform (): Promise<AddAllStockSymbolsResponse> {
    await this.fetchAllSymbols.fetchAll()
    return right(null)
  }
}
