import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchQuoteBySymbolApi } from '../contracts/api/fetch-quote-by-symbol-api'
import { FetchQuoteUseCase } from './fetch-quote-usecase'

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_name',
  lastPrice: 120.99,
  pricedAt: 'any_priced_at'
})

const makeFetchQuoteBySymbolApi = (): FetchQuoteBySymbolApi => {
  class FetchQuoteBySymbolApiStub implements FetchQuoteBySymbolApi {
    async fetchQuote (stockSymbol: string): Promise<null | StockQuote> {
      return await Promise.resolve(makeFakeStockQuote())
    }
  }
  return new FetchQuoteBySymbolApiStub()
}

type SutTypes = {
  sut: FetchQuoteUseCase
  fetchQuoteBySymbolApiStub: FetchQuoteBySymbolApi
}

const makeSut = (): SutTypes => {
  const fetchQuoteBySymbolApiStub = makeFetchQuoteBySymbolApi()
  const sut = new FetchQuoteUseCase(fetchQuoteBySymbolApiStub)
  return {
    sut,
    fetchQuoteBySymbolApiStub
  }
}

describe('FetchQuote UseCase', () => {
  it('Should call FetchQuoteBySymbolApi with correct stock symbol', async () => {
    const { sut, fetchQuoteBySymbolApiStub } = makeSut()
    const fetchQuoteSpy = jest.spyOn(fetchQuoteBySymbolApiStub, 'fetchQuote')
    await sut.perform('any_stock_symbol')
    expect(fetchQuoteSpy).toHaveBeenCalledWith('any_stock_symbol')
  })
})
