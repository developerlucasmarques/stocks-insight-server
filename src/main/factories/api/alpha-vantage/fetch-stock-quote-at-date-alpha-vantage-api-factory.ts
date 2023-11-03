import type { FetchStockQuoteAtDateApi } from '@/interactions/contracts/api'
import { FetchStockQuoteAtDateAlphaVantageApi } from '@/infra/api/alpha-vantage'
import env from '@/main/config/env'

export const fetchStockQuoteAtDateAlphaVantageApiFactory = (): FetchStockQuoteAtDateApi => {
  return new FetchStockQuoteAtDateAlphaVantageApi(env.alphaVantageApiKey)
}
