import type { FetchStockHistory } from '@/domain/contracts'
import { FetchStockHistoryUseCase } from '@/interactions/usecases/fetch-stock-history/fetch-stock-history-usecase'
import { alphaVantageApiFactory } from '../api/alpha-vantage-api-factory'

export const fetchStockHistoryUseCaseFactory = (): FetchStockHistory => {
  return new FetchStockHistoryUseCase(alphaVantageApiFactory())
}
