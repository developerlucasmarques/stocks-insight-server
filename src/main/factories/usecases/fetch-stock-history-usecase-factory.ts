import type { FetchStockHistory } from '@/domain/contracts'
import { FetchStockHistoryUseCase } from '@/interactions/usecases'
import { alphaVantageApiFactory } from '../api/alpha-vantage-api-factory'

export const fetchStockHistoryUseCaseFactory = (): FetchStockHistory => {
  return new FetchStockHistoryUseCase(alphaVantageApiFactory())
}
