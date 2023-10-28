import type { AddAllStockSymbols, AddAllStockSymbolsResponse } from '@/domain/contracts/add-all-stock-symbols'
import { StockSymbolsNotFoundError } from '@/domain/errors/stock-symbols-not-found-error'
import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api/fetch-all-symbols-of-listed-stocks-api'
import { left, right } from '@/shared/either'

export class AddAllStockSymbolsUseCase implements AddAllStockSymbols {
  constructor (
    private readonly fetchAllSymbols: FetchAllSymbolsOfListedStocksApi
  ) {}

  async perform (): Promise<AddAllStockSymbolsResponse> {
    const symbols = await this.fetchAllSymbols.fetchAll()
    if (!symbols) {
      return left(new StockSymbolsNotFoundError())
    }
    return right(null)
  }
}
