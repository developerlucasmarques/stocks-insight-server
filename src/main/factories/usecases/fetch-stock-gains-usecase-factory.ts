import type { FetchStockGains } from '@/domain/contracts'
import { FetchStockGainsUseCase } from '@/interactions/usecases'
import { fetchStockQuoteAlphaVantageApiFactory, fetchStockQuoteAtDateAlphaVantageApiFactory } from '../api'

export const fetchStockGainsUseCaseFactory = (): FetchStockGains => {
  return new FetchStockGainsUseCase(
    fetchStockQuoteAtDateAlphaVantageApiFactory(),
    fetchStockQuoteAlphaVantageApiFactory()
  )
}
