import type { FetchStockQuote } from '@/domain/contracts'
import { FetchStockQuoteUseCase } from '@/interactions/usecases'
import { fetchStockQuoteAlphaVantageApiFactory } from '../api'

export const fetchStockQuoteUseCaseFactory = (): FetchStockQuote => {
  return new FetchStockQuoteUseCase(fetchStockQuoteAlphaVantageApiFactory())
}
