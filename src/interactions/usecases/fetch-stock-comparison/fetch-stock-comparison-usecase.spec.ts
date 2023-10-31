import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { FetchStockComparisonUseCase } from './fetch-stock-comparison-usecase'

const makeFakeStockSymbols = (): string[] => (['any_stock', 'another_stock'])

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock',
  lastPrice: 120.99,
  pricedAt: 'any_priced_at'
})

const makeFetchStockQuoteBySymbolApi = (): FetchStockQuoteBySymbolApi => {
  class FetchStockQuoteBySymbolApiStub implements FetchStockQuoteBySymbolApi {
    async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote> {
      return await Promise.resolve(makeFakeStockQuote())
    }
  }
  return new FetchStockQuoteBySymbolApiStub()
}

type SutTypes = {
  sut: FetchStockComparisonUseCase
  fetchStockQuoteBySymbolApiStub: FetchStockQuoteBySymbolApi
}

const makeSut = (): SutTypes => {
  const fetchStockQuoteBySymbolApiStub = makeFetchStockQuoteBySymbolApi()
  const sut = new FetchStockComparisonUseCase(fetchStockQuoteBySymbolApiStub)
  return { sut, fetchStockQuoteBySymbolApiStub }
}

describe('FetchStockComparison UseCase', () => {
  it('Should call FetchStockQuoteBySymbolApi with correct stock symbols', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    const fetchStockQuoteSpy = jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote')
    await sut.perform(makeFakeStockSymbols())
    expect(fetchStockQuoteSpy).toHaveBeenCalledWith('any_stock')
    expect(fetchStockQuoteSpy).toHaveBeenCalledWith('another_stock')
  })
})
