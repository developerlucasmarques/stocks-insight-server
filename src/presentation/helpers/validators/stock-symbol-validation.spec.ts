import type { FetchStockSymbolCache, StockSymbol } from '@/interactions/contracts/cache/fetch-stock-symbol-cache'
import { StockSymbolValidation } from './stock-symbol-validation'
import { InvalidStockSymbolError } from '@/presentation/errors/invalid-stock-symbol-error'

const makeInput = (): any => ({ stockSymbol: 'any_stock_symbol' })

const makeFetchStockSymbolCache = (): FetchStockSymbolCache => {
  class FetchStockSymbolCacheStub implements FetchStockSymbolCache {
    async fetchOneSymbol (stockSymbol: string): Promise<null | StockSymbol> {
      return await Promise.resolve({ symbol: 'any_stock_symbol' })
    }
  }
  return new FetchStockSymbolCacheStub()
}

type SutTypes = {
  sut: StockSymbolValidation
  fetchStockSymbolCacheStub: FetchStockSymbolCache
}

const makeSut = (): SutTypes => {
  const fetchStockSymbolCacheStub = makeFetchStockSymbolCache()
  const sut = new StockSymbolValidation(fetchStockSymbolCacheStub)
  return { sut, fetchStockSymbolCacheStub }
}

describe('StockSymbol Validation', () => {
  it('Shoulad call FetchStockSymbolCache with correct stock symbol', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    const fetchSpy = jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol')
    await sut.validate(makeInput())
    expect(fetchSpy).toHaveBeenCalledWith('any_stock_symbol')
  })

  it('Should return InvalidStockSymbolError if FetchStockSymbolCache returns null', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.validate(makeInput())
    expect(result.value).toEqual(new InvalidStockSymbolError('any_stock_symbol'))
  })

  it('Should throw if FetchStockSymbolCache throws', async () => {
    const { sut, fetchStockSymbolCacheStub } = makeSut()
    jest.spyOn(fetchStockSymbolCacheStub, 'fetchOneSymbol').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.validate(makeInput())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if FetchStockSymbolCache is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(makeInput())
    expect(result.value).toBeNull()
  })
})
