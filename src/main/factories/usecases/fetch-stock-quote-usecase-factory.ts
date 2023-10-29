import type { FetchStockQuote } from '@/domain/contracts'
import { FetchStockQuoteUseCase } from '@/interactions/usecases'
import { alphaVantageApiFactory } from '../api/alpha-vantage-api-factory'

export const fetchStockQuoteUseCaseFactory = (): FetchStockQuote => {
  return new FetchStockQuoteUseCase(alphaVantageApiFactory())
}
