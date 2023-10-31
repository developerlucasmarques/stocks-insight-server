import type { FetchStockComparison } from '@/domain/contracts'
import { FetchStockComparisonUseCase } from '@/interactions/usecases'
import { alphaVantageApiFactory } from '../api/alpha-vantage-api-factory'

export const fetchStockComparasionUseCaseFactory = (): FetchStockComparison => {
  return new FetchStockComparisonUseCase(alphaVantageApiFactory())
}
