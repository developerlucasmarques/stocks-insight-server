import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api'
import { FetchAllSymbolsOfListedStocksAlphaVantageApi } from '@/infra/api/alpha-vantage'
import env from '@/main/config/env'

export const fetchAllSymbolsOfListedStocksAlphaVantageApiFactory = (): FetchAllSymbolsOfListedStocksApi => {
  return new FetchAllSymbolsOfListedStocksAlphaVantageApi(env.alphaVantageApiKey)
}
