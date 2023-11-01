import type { FetchStockGainsData } from '@/domain/contracts'
import { StockQuoteAtDateNotFoundError, StockQuoteNotFoundError } from '@/domain/errors'
import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchStockQuoteAtDateApi, FetchStockQuoteAtDateApiData, FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import { FetchStockGainsUseCase } from './fetch-stock-gains-usecase'
import type { StockQuote } from '@/domain/models/stock-quote'
import { CalculateStockGains } from '@/domain/core/calculate-stock-gains'

const makeFetchStockGainsData = (): FetchStockGainsData => ({
  stockSymbol: 'any_stock_symbol',
  purchasedAt: '2023-01-02',
  purchasedAmount: 1000
})

const makeFakeStockQuoteAtDate = (): StockQuoteAtDate => ({
  name: 'any_stock_symbol',
  pricedAtDate: 130.99,
  quoteDate: '2023-01-02'
})

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_name',
  lastPrice: 150.99,
  pricedAt: 'any_priced_at'
})

const makeFetchStockQuoteAtDateApiApi = (): FetchStockQuoteAtDateApi => {
  class FetchStockQuoteAtDateApiStub implements FetchStockQuoteAtDateApi {
    async fetchStockQuoteAtDate (data: FetchStockQuoteAtDateApiData): Promise<null | StockQuoteAtDate> {
      return await Promise.resolve(makeFakeStockQuoteAtDate())
    }
  }
  return new FetchStockQuoteAtDateApiStub()
}

const makeFetchStockQuoteBySymbolApi = (): FetchStockQuoteBySymbolApi => {
  class FetchStockQuoteBySymbolApiStub implements FetchStockQuoteBySymbolApi {
    async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote> {
      return await Promise.resolve(makeFakeStockQuote())
    }
  }
  return new FetchStockQuoteBySymbolApiStub()
}

type SutTypes = {
  sut: FetchStockGainsUseCase
  fetchStockQuoteAtDateApiStub: FetchStockQuoteAtDateApi
  fetchStockQuoteBySymbolApiStub: FetchStockQuoteBySymbolApi
}

const makeSut = (): SutTypes => {
  const fetchStockQuoteAtDateApiStub = makeFetchStockQuoteAtDateApiApi()
  const fetchStockQuoteBySymbolApiStub = makeFetchStockQuoteBySymbolApi()
  const sut = new FetchStockGainsUseCase(
    fetchStockQuoteAtDateApiStub, fetchStockQuoteBySymbolApiStub
  )
  return { sut, fetchStockQuoteAtDateApiStub, fetchStockQuoteBySymbolApiStub }
}

describe('FetchStockGains UseCase', () => {
  it('Should call FetchStockQuoteAtDateApi with correct values', async () => {
    const { sut, fetchStockQuoteAtDateApiStub } = makeSut()
    const fetchStockQuoteAtDateSpy = jest.spyOn(fetchStockQuoteAtDateApiStub, 'fetchStockQuoteAtDate')
    await sut.perform(makeFetchStockGainsData())
    expect(fetchStockQuoteAtDateSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      quoteDate: '2023-01-02'
    })
  })

  it('Should return StockQuoteAtDateNotFoundError if FetchStockQuoteAtDateApi returns null', async () => {
    const { sut, fetchStockQuoteAtDateApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteAtDateApiStub, 'fetchStockQuoteAtDate').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFetchStockGainsData())
    expect(result.value).toEqual(new StockQuoteAtDateNotFoundError('any_stock_symbol', '2023-01-02'))
  })

  it('Should throw if FetchStockQuoteAtDateApi throws', async () => {
    const { sut, fetchStockQuoteAtDateApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteAtDateApiStub, 'fetchStockQuoteAtDate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFetchStockGainsData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call FetchStockQuoteBySymbolApi with correct stock symbol', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    const fetchStockQuoteSpy = jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote')
    await sut.perform(makeFetchStockGainsData())
    expect(fetchStockQuoteSpy).toHaveBeenCalledWith('any_stock_symbol')
  })

  it('Should return StockQuoteNotFoundError if FetchStockQuoteBySymbolApi returns null', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFetchStockGainsData())
    expect(result.value).toEqual(new StockQuoteNotFoundError('any_stock_symbol'))
  })

  it('Should throw if FetchStockQuoteBySymbolApi throws', async () => {
    const { sut, fetchStockQuoteBySymbolApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteBySymbolApiStub, 'fetchStockQuote').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFetchStockGainsData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call CalculateStockGains with correct values', async () => {
    const { sut } = makeSut()
    const executeSpy = jest.spyOn(CalculateStockGains, 'execute')
    await sut.perform(makeFetchStockGainsData())
    expect(executeSpy).toHaveBeenCalledWith({
      lastPrice: 150.99,
      pricedAtDate: 130.99,
      purchasedAmount: 1000
    })
  })
})
