import type { FetchStockHistoryData } from '@/domain/contracts/fetch-stock-history'
import type { StockHistory } from '@/domain/models/stock-history'

export interface FetchStockHistoryApi {
  fetchStockQuote: (data: FetchStockHistoryData) => Promise<null | StockHistory>
}
