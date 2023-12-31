import type { FetchStockSymbolCache, StockSymbol } from '@/interactions/contracts/cache'
import { ManyStocksValidation } from './many-stocks-validation'
import { InvalidStockSymbolError } from '@/presentation/errors'

const makeInput = (): any => ({
  stocksToCompare: ['any_stock', 'another_stock', 'other_stock']
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
  sut: ManyStocksValidation
  fetchStockSymbolCacheStub: FetchStockSymbolCache
}

const makeSut = (): SutTypes => {
  const fetchStockSymbolCacheStub = makeFetchStockSymbolCache()
  const sut = new ManyStocksValidation(fetchStockSymbolCacheStub)
  return { sut, fetchStockSymbolCacheStub }
}

describe('ManyStocks Validation', () => {
  it('Should call FetchStockSymbolCache with correct values', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    const fetchSpy = jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol')
    await sut.validate(makeInput())
    expect(fetchSpy).toHaveBeenCalledWith('any_stock')
    expect(fetchSpy).toHaveBeenCalledWith('another_stock')
    expect(fetchSpy).toHaveBeenCalledWith('other_stock')
  })

  it('Should return InvalidStockSymbolError if any FetchStockSymbolCache returns null', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.validate(makeInput())
    expect(result.value).toEqual(new InvalidStockSymbolError('any_stock'))
  })

  it('Should return valid result if FetchStockSymbolCache is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.validate({ stocksToCompare: 'any_stock' })
    expect(result.isRight()).toBe(true)
  })

  it('Should return valid result if FetchStockSymbolCache is a success and many stocks to compare', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(makeInput())
    expect(result.isRight()).toBe(true)
  })
})
