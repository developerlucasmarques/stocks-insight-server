import type { FetchStockSymbolCache, StockSymbol } from '@/interactions/contracts/cache'
import { StockToCompareValidation } from './stock-to-compare-validation'

const makeInput = (): any => ({
  stocksToCompare: 'any_stock,another_stock,other_stock'
})

const makeFetchStockSymbolCache = (): FetchStockSymbolCache => {
  class FetchStockSymbolCacheStub implements FetchStockSymbolCache {
    async fetchOneSymbol (stockSymbol: string): Promise<null | StockSymbol> {
      return await Promise.resolve({ symbol: 'any_stock' })
    }
  }
  return new FetchStockSymbolCacheStub()
}

type SutTypes = {
  sut: StockToCompareValidation
  fetchStockSymbolCacheStub: FetchStockSymbolCache
}

const makeSut = (): SutTypes => {
  const fetchStockSymbolCacheStub = makeFetchStockSymbolCache()
  const sut = new StockToCompareValidation(fetchStockSymbolCacheStub)
  return { sut, fetchStockSymbolCacheStub }
}

describe('StockToCompare Validation', () => {
  it('Shoulad call FetchStockSymbolCache with correct values', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    const fetchSpy = jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol')
    await sut.validate(makeInput())
    expect(fetchSpy).toHaveBeenCalledWith('any_stock')
    expect(fetchSpy).toHaveBeenCalledWith('another_stock')
    expect(fetchSpy).toHaveBeenCalledWith('other_stock')
  })
})
