import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { FetchStockQuoteAlphaVantageApi } from '@/infra/api/alpha-vantage'
import env from '@/main/config/env'

export const fetchStockQuoteAlphaVantageApiFactory = (): FetchStockQuoteBySymbolApi => {
  return new FetchStockQuoteAlphaVantageApi(env.alphaVantageApiKey)
}
