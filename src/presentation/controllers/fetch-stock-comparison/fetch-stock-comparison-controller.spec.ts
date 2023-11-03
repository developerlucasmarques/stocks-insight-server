import type { FetchStockComparison, FetchStockComparisonData, FetchStockComparisonResponse } from '@/domain/contracts'
import type { StockComparison } from '@/domain/models/stock-comparison'
import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { NoStockQuoteFoundError } from '@/domain/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { FetchStockComparisonController } from './fetch-stock-comparison-controller'
import { left, right, type Either } from '@/shared/either'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol',
    stocksToCompare: ['another_stock', 'other_stock']
  }
})

const makeFakeStockComparison = (): StockComparison => ({
  lastPrices: [{
    name: 'any_stock',
    lastPrice: 120.99,
    pricedAt: 'any_priced_at'
  }, {
    name: 'another_stock',
    lastPrice: 133.99,
    pricedAt: 'any_priced_at'
  }]
})

const makeValidation = (): Validation => {
  class ValdationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ValdationStub()
}

const makeFetchStockComparison = (): FetchStockComparison => {
  class FetchStockComparisonStub implements FetchStockComparison {
    async perform (data: FetchStockComparisonData): Promise<FetchStockComparisonResponse> {
      return await Promise.resolve(right(makeFakeStockComparison()))
    }
  }
  return new FetchStockComparisonStub()
}

type SutTypes = {
  sut: FetchStockComparisonController
  validationStub: Validation
  fetchStockComparisonStub: FetchStockComparison
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const fetchStockComparisonStub = makeFetchStockComparison()
  const sut = new FetchStockComparisonController(validationStub, fetchStockComparisonStub)
  return {
    sut, validationStub, fetchStockComparisonStub
  }
}

describe('FetchStockComparison Controller', () => {
  it('Should call Validation with correct value', async () => {
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

  it('Should call FetchStockComparison with correct values', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockComparisonStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      stocksToCompare: ['another_stock', 'other_stock']
    })
  })

  it('Should call FetchStockComparison with just one stock to compare', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockComparisonStub, 'perform')
    await sut.handle({
      params: {
        stockSymbol: 'any_stock_symbol',
        stocksToCompare: 'another_stock'
      }
    })
    expect(performSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      stocksToCompare: ['another_stock']
    })
  })

  it('Should return 404 if FetchStockComparison returns NoStockQuoteFoundError', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    jest.spyOn(fetchStockComparisonStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new NoStockQuoteFoundError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new NoStockQuoteFoundError()))
  })

  it('Should return 500 if FetchStockComparison throws', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    jest.spyOn(fetchStockComparisonStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if FetchStockComparison is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeStockComparison()))
  })
})
