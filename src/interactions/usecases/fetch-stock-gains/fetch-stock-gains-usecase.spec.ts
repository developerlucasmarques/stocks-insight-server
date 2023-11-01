import type { FetchStockGainsData } from '@/domain/contracts'
import { CalculateStockGains } from '@/domain/core/calculate-stock-gains'
import { StockQuoteAtDateNotFoundError } from '@/domain/errors'
import type { StockGains } from '@/domain/models/stock-gains'
import type { StockQuoteAtDateAndLastDate } from '@/domain/models/stock-quote-at-date-and-last-date'
import type { FetchStockQuoteAtDateAndLastDateApi, FetchStockQuoteAtDateAndLastDateApiData } from '@/interactions/contracts/api'
import { FetchStockGainsUseCase } from './fetch-stock-gains-usecase'

const makeFetchStockGainsData = (): FetchStockGainsData => ({
  stockSymbol: 'any_stock_symbol',
  purchasedAt: '2023-01-02',
  purchasedAmount: 9900.30
})

const makeFakeStockQuoteAtDateAndLastDate = (): StockQuoteAtDateAndLastDate => ({
  quoteAtDate: {
    name: 'any_stock_symbol',
    pricedAtDate: 130.99,
    quoteDate: '2023-01-02'
  },
  quoteLastDate: {
    name: 'any_stock_symbol',
    lastPrice: 150.99,
    pricedAt: '2023-01-10'
  }
})

const makeFakeStockGains = (): StockGains => ({
  name: 'any_stock_symbol',
  lastPrice: 150.99,
  pricedAtDate: 130.99,
  purchasedAmount: 9900.30,
  purchasedAt: '2023-01-02',
  capitalGains: 1423.95
})

const makeFetchStockQuoteAtDateAndLastDateApi = (): FetchStockQuoteAtDateAndLastDateApi => {
  class FetchStockQuoteAtDateApiStub implements FetchStockQuoteAtDateAndLastDateApi {
    async fetchStockQuoteAtDate (data: FetchStockQuoteAtDateAndLastDateApiData): Promise<null | StockQuoteAtDateAndLastDate> {
      return await Promise.resolve(makeFakeStockQuoteAtDateAndLastDate())
    }
  }
  return new FetchStockQuoteAtDateApiStub()
}

type SutTypes = {
  sut: FetchStockGainsUseCase
  fetchStockQuoteAtDateAndLastDateApiStub: FetchStockQuoteAtDateAndLastDateApi
}

const makeSut = (): SutTypes => {
  const fetchStockQuoteAtDateAndLastDateApiStub = makeFetchStockQuoteAtDateAndLastDateApi()
  const sut = new FetchStockGainsUseCase(
    fetchStockQuoteAtDateAndLastDateApiStub
  )
  return { sut, fetchStockQuoteAtDateAndLastDateApiStub }
}

describe('FetchStockGains UseCase', () => {
  it('Should call FetchStockQuoteAtDateApi with correct values', async () => {
    const { sut, fetchStockQuoteAtDateAndLastDateApiStub } = makeSut()
    const fetchStockQuoteAtDateSpy = jest.spyOn(fetchStockQuoteAtDateAndLastDateApiStub, 'fetchStockQuoteAtDate')
    await sut.perform(makeFetchStockGainsData())
    expect(fetchStockQuoteAtDateSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      quoteAtDate: '2023-01-02'
    })
  })

  it('Should return StockQuoteAtDateNotFoundError if FetchStockQuoteAtDateApi returns null', async () => {
    const { sut, fetchStockQuoteAtDateAndLastDateApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteAtDateAndLastDateApiStub, 'fetchStockQuoteAtDate').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFetchStockGainsData())
    expect(result.value).toEqual(new StockQuoteAtDateNotFoundError('any_stock_symbol', '2023-01-02'))
  })

  it('Should throw if FetchStockQuoteAtDateApi throws', async () => {
    const { sut, fetchStockQuoteAtDateAndLastDateApiStub } = makeSut()
    jest.spyOn(fetchStockQuoteAtDateAndLastDateApiStub, 'fetchStockQuoteAtDate').mockReturnValueOnce(
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
      purchasedAmount: 9900.30
    })
  })

  it('Should return StockGains if CalculateStockGains is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFetchStockGainsData())
    expect(result.value).toEqual(makeFakeStockGains())
  })
})
