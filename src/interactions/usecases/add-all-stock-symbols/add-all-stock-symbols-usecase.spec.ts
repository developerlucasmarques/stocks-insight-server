import type { FetchAllSymbolsOfListedStocksApi, StockSymbols } from '@/interactions/contracts/api/fetch-all-symbols-of-listed-stocks-api'
import { AddAllStockSymbolsUseCase } from './add-all-stock-symbols-usecase'

const makeFakeStockSymbols = (): StockSymbols => ({
  symbols: ['any_stock_symbol', 'another_stock_symbol']
})

const makeFetchAllSymbolsOfListedStocksApi = (): FetchAllSymbolsOfListedStocksApi => {
  class FetchAllSymbolsOfListedStocksApiStub implements FetchAllSymbolsOfListedStocksApi {
    async fetchAll (): Promise<null | StockSymbols> {
      return await Promise.resolve(makeFakeStockSymbols())
    }
  }
  return new FetchAllSymbolsOfListedStocksApiStub()
}

type SutTypes = {
  sut: AddAllStockSymbolsUseCase
  fetchAllSymbolsOfListedStocksApiStub: FetchAllSymbolsOfListedStocksApi
}

const makeSut = (): SutTypes => {
  const fetchAllSymbolsOfListedStocksApiStub = makeFetchAllSymbolsOfListedStocksApi()
  const sut = new AddAllStockSymbolsUseCase(fetchAllSymbolsOfListedStocksApiStub)
  return { sut, fetchAllSymbolsOfListedStocksApiStub }
}

describe('AddAllStockSymbols UseCase', () => {
  it('Should call FetchAllSymbolsOfListedStocksApi', async () => {
    const { sut, fetchAllSymbolsOfListedStocksApiStub } = makeSut()
    const fetchAllSpy = jest.spyOn(fetchAllSymbolsOfListedStocksApiStub, 'fetchAll')
    await sut.perform()
    expect(fetchAllSpy).toHaveBeenCalled()
  })
})
