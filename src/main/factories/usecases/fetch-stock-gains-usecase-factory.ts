import { FetchStockGainsUseCase } from '@/interactions/usecases'
import { alphaVantageApiFactory } from '../api/alpha-vantage-api-factory'
import type { FetchStockGains } from '@/domain/contracts'

export const fetchStockGainsUseCaseFactory = (): FetchStockGains => {
  return new FetchStockGainsUseCase(
    alphaVantageApiFactory(), alphaVantageApiFactory()
  )
}
