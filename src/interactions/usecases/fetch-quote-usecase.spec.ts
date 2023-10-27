import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchQuoteBySymbolApi } from '../contracts/api/fetch-quote-by-symbol-api'
import { FetchQuoteUseCase } from './fetch-quote-usecase'
import { StockQuoteNotFoundError } from '@/domain/errors/sotck-quote-not-found-error'

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

  it('Should return StockQuoteNotFoundError if FetchQuoteBySymbolApi returns null', async () => {
    const { sut, fetchQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchQuoteBySymbolApiStub, 'fetchQuote').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform('any_stock_symbol')
    expect(result.value).toEqual(new StockQuoteNotFoundError('any_stock_symbol'))
  })

  it('Should throw if FetchQuoteBySymbolApi throws', async () => {
    const { sut, fetchQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchQuoteBySymbolApiStub, 'fetchQuote').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_stock_symbol')
    await expect(promise).rejects.toThrow()
  })

  it('Should return StockQuote if FetchQuoteBySymbolApi is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform('any_stock_symbol')
    expect(result.value).toEqual(makeFakeStockQuote())
  })
})
