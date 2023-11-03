import type { FetchStockHistory } from '@/domain/contracts'
import { FetchStockHistoryUseCase } from '@/interactions/usecases'
import { fetchStockHistoryAlphaVantageApiFactory } from '../api'

export const fetchStockHistoryUseCaseFactory = (): FetchStockHistory => {
  return new FetchStockHistoryUseCase(fetchStockHistoryAlphaVantageApiFactory())
}
