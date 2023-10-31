import type { FetchStockHistory, FetchStockHistoryData, FetchStockHistoryResponse } from '@/domain/contracts/fetch-stock-history'
import { StockHistoryNotFoundError } from '@/domain/errors/stock-history-not-found-error'
import type { FetchStockHistoryApi } from '@/interactions/contracts/api'
import { left, right } from '@/shared/either'

export class FetchStockHistoryUseCase implements FetchStockHistory {
  constructor (private readonly fetchStockHistoryApi: FetchStockHistoryApi) {}

  async perform (data: FetchStockHistoryData): Promise<FetchStockHistoryResponse> {
    const stockHistory = await this.fetchStockHistoryApi.fetchStockHistory(data)
    if (!stockHistory) {
      return left(new StockHistoryNotFoundError(data))
    }
    return right(stockHistory)
  }
}
