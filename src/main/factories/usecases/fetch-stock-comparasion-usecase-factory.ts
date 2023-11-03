import type { FetchStockComparison } from '@/domain/contracts'
import { FetchStockComparisonUseCase } from '@/interactions/usecases'
import { fetchManyStockQuotesAlphaVantageApiFactory } from '../api'

export const fetchStockComparasionUseCaseFactory = (): FetchStockComparison => {
  return new FetchStockComparisonUseCase(fetchManyStockQuotesAlphaVantageApiFactory())
}
