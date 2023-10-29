import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { FetchStockQuoteUseCase } from './fetch-stock-quote-usecase'
import { StockQuoteNotFoundError } from '@/domain/errors'

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_name',
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
  sut: FetchStockQuoteUseCase
  fetchStockQuoteBySymbolApiStub: FetchStockQuoteBySymbolApi
}

const makeSut = (): SutTypes => {
  const fetchStockQuoteBySymbolApiStub = makeFetchStockQuoteBySymbolApi()
  const sut = new FetchStockQuoteUseCase(fetchStockQuoteBySymbolApiStub)
  return { sut, fetchStockQuoteBySymbolApiStub }
}

describe('FetchStockQuote UseCase', () => {
  it('Should call FetchStockQuoteBySymbolApi with correct stock symbol', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    const fetchStockQuoteSpy = jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote')
    await sut.perform('any_stock_symbol')
    expect(fetchStockQuoteSpy).toHaveBeenCalledWith('any_stock_symbol')
  })

  it('Should return StockQuoteNotFoundError if FetchStockQuoteBySymbolApi returns null', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform('any_stock_symbol')
    expect(result.value).toEqual(new StockQuoteNotFoundError('any_stock_symbol'))
  })

  it('Should throw if FetchStockQuoteBySymbolApi throws', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_stock_symbol')
    await expect(promise).rejects.toThrow()
  })

  it('Should return StockQuote if FetchStockQuoteBySymbolApi is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform('any_stock_symbol')
    expect(result.value).toEqual(makeFakeStockQuote())
  })
})
