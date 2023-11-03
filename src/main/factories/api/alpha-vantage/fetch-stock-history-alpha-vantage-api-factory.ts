import type { FetchStockHistoryApi } from '@/interactions/contracts/api'
import { FetchStockHistoryAlphaVantageApi } from '@/infra/api/alpha-vantage'
import env from '@/main/config/env'

export const fetchStockHistoryAlphaVantageApiFactory = (): FetchStockHistoryApi => {
  return new FetchStockHistoryAlphaVantageApi(env.alphaVantageApiKey)
}
