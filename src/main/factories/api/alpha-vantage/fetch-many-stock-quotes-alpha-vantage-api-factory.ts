import type { FetchManyStockQuotesBySymbolsApi } from '@/interactions/contracts/api'
import { FetchManyStockQuotesAlphaVantageApi } from '@/infra/api/alpha-vantage'
import env from '@/main/config/env'

export const fetchManyStockQuotesAlphaVantageApiFactory = (): FetchManyStockQuotesBySymbolsApi => {
  return new FetchManyStockQuotesAlphaVantageApi(env.alphaVantageApiKey)
}
