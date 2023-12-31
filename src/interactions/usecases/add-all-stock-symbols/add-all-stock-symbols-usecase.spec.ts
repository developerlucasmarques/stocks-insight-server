import { AllStockSymbolsNotFoundError } from '@/domain/errors'
import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api'
import type { AddAllStockSymbolsCache } from '@/interactions/contracts/cache'
import { AddAllStockSymbolsUseCase } from './add-all-stock-symbols-usecase'

const makeFetchAllSymbolsOfListedStocksApi = (): FetchAllSymbolsOfListedStocksApi => {
  class FetchAllSymbolsOfListedStocksApiStub implements FetchAllSymbolsOfListedStocksApi {
    async fetchAll (): Promise<string[]> {
      return await Promise.resolve(['any_stock_symbol', 'another_stock_symbol'])
    }
  }
  return new FetchAllSymbolsOfListedStocksApiStub()
}

const makeAddAllStockSymbolsCache = (): AddAllStockSymbolsCache => {
  class AddAllStockSymbolsCacheStub implements AddAllStockSymbolsCache {
    async addAllSymbols (): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddAllStockSymbolsCacheStub()
}

type SutTypes = {
  sut: AddAllStockSymbolsUseCase
  fetchAllSymbolsOfListedStocksApiStub: FetchAllSymbolsOfListedStocksApi
  addAllStockSymbolsCacheStub: AddAllStockSymbolsCache
}

const makeSut = (): SutTypes => {
  const fetchAllSymbolsOfListedStocksApiStub = makeFetchAllSymbolsOfListedStocksApi()
  const addAllStockSymbolsCacheStub = makeAddAllStockSymbolsCache()
  const sut = new AddAllStockSymbolsUseCase(
    fetchAllSymbolsOfListedStocksApiStub, addAllStockSymbolsCacheStub
  )
  return {
    sut, fetchAllSymbolsOfListedStocksApiStub, addAllStockSymbolsCacheStub
  }
}

describe('AddAllStockSymbols UseCase', () => {
  it('Should call FetchAllSymbolsOfListedStocksApi', async () => {
    const { sut, fetchAllSymbolsOfListedStocksApiStub } = makeSut()
    const fetchAllSpy = jest.spyOn(fetchAllSymbolsOfListedStocksApiStub, 'fetchAll')
    await sut.perform()
    expect(fetchAllSpy).toHaveBeenCalled()
  })

  it('Should return AllStockSymbolsNotFoundError if FetchAllSymbolsOfListedStocksApi returns empty', async () => {
    const { sut, fetchAllSymbolsOfListedStocksApiStub } = makeSut()
    jest.spyOn(fetchAllSymbolsOfListedStocksApiStub, 'fetchAll').mockReturnValueOnce(
      Promise.resolve([])
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
    await expect(promise).rejects.toBeInstanceOf(AllStockSymbolsNotFoundError)
  })

  it('Should throw if FetchAllSymbolsOfListedStocksApi throws', async () => {
    const { sut, fetchAllSymbolsOfListedStocksApiStub } = makeSut()
    jest.spyOn(fetchAllSymbolsOfListedStocksApiStub, 'fetchAll').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAllStockSymbolsCache with correct symbols', async () => {
    const { sut, addAllStockSymbolsCacheStub } = makeSut()
    const addAllSymbolsSpy = jest.spyOn(addAllStockSymbolsCacheStub, 'addAllSymbols')
    await sut.perform()
    expect(addAllSymbolsSpy).toHaveBeenCalledWith([
      'any_stock_symbol', 'another_stock_symbol'
    ])
  })

  it('Should throw if AddAllStockSymbolsCache throws', async () => {
    const { sut, addAllStockSymbolsCacheStub } = makeSut()
    jest.spyOn(addAllStockSymbolsCacheStub, 'addAllSymbols').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AddAllStockSymbolsCache is a success', async () => {
    const { sut } = makeSut()
    const promise = sut.perform()
    await expect(promise).resolves.toBeUndefined()
  })
})
