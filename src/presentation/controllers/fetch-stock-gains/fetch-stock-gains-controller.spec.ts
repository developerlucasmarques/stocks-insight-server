import type { FetchStockGains, FetchStockGainsData, FetchStockGainsResponse } from '@/domain/contracts'
import type { StockGains } from '@/domain/models/stock-gains'
import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { InvalidPurchasedAmountError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { FetchStockGainsController } from './fetch-stock-gains-controller'
import { left, right, type Either } from '@/shared/either'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol',
    purchasedAt: '2023-01-01',
    purchasedAmount: '10000'
  }
})

const makeFakeFetchStockGainsData = (): FetchStockGainsData => ({
  stockSymbol: 'any_stock_symbol',
  purchasedAt: '2023-01-01',
  purchasedAmount: 10000
})

const makeFakeStockGains = (): StockGains => ({
  name: 'any_stock_symbol',
  lastPrice: 150.99,
  priceAtDate: 130.99,
  purchasedAmount: 9900.30,
  purchasedAt: '2023-01-02',
  capitalGains: 1423.95
})

const makeValidation = (): Validation => {
  class ValdationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ValdationStub()
}

const makeFetchStockGains = (): FetchStockGains => {
  class FetchStockGainsStub implements FetchStockGains {
    async perform (data: FetchStockGainsData): Promise<FetchStockGainsResponse> {
      return await Promise.resolve(right(makeFakeStockGains()))
    }
  }
  return new FetchStockGainsStub()
}

type SutTypes = {
  sut: FetchStockGainsController
  validationStub: Validation
  fetchStockGainsStub: FetchStockGains
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const fetchStockGainsStub = makeFetchStockGains()
  const sut = new FetchStockGainsController(validationStub, fetchStockGainsStub)
  return { sut, validationStub, fetchStockGainsStub }
}

describe('FetchStockGains Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().params)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 with InvalidPurchasedAmountError if purchased amount is equal 0', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        stockSymbol: 'any_stock_symbol',
        purchasedAt: '2023-01-01',
        purchasedAmount: '0'
      }
    })
    expect(httpResponse).toEqual(badRequest(new InvalidPurchasedAmountError()))
  })

  it('Should return 400 with InvalidPurchasedAmountError if purchased amount is less than 0', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        stockSymbol: 'any_stock_symbol',
        purchasedAt: '2023-01-01',
        purchasedAmount: '-1'
      }
    })
    expect(httpResponse).toEqual(badRequest(new InvalidPurchasedAmountError()))
  })

  it('Should call FetchStockGains with correct values', async () => {
    const { sut, fetchStockGainsStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockGainsStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeFetchStockGainsData())
  })

  it('Should return 404 if FetchStockGains returns an Error', async () => {
    const { sut, fetchStockGainsStub } = makeSut()
    jest.spyOn(fetchStockGainsStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new Error('any_message')))
  })

  it('Should return 500 if FetchStockGains throws', async () => {
    const { sut, fetchStockGainsStub } = makeSut()
    jest.spyOn(fetchStockGainsStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if FetchStockGains is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeStockGains()))
  })
})
