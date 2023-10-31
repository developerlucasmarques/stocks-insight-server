import type { FetchStockHistory, FetchStockHistoryData, FetchStockHistoryResponse } from '@/domain/contracts/fetch-stock-history'
import type { FetchStockHistoryApi } from '@/interactions/contracts/api'
import { right } from '@/shared/either'

export class FetchStockHistoryUseCase implements FetchStockHistory {
  constructor (private readonly fetchStockHistoryApi: FetchStockHistoryApi) {}

  async perform (data: FetchStockHistoryData): Promise<FetchStockHistoryResponse> {
    await this.fetchStockHistoryApi.fetchStockHistory(data)
    return right({
      name: '',
      prices: []
    })
  }
}
