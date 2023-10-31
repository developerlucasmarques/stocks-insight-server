import type { FetchStockComparison, FetchStockComparisonData, FetchStockComparisonResponse } from '@/domain/contracts'
import type { StockComparison } from '@/domain/models/stock-comparison'
import type { Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right, type Either } from '@/shared/either'
import { FetchStockComparisonController } from './fetch-stock-comparison-controller'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol'
  },
  query: {
    stocksToCompare: 'another_stock,other_stock'
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

const makeParamsValidation = (): Validation => {
  class ParamsValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ParamsValidationStub()
}

const makeQueryValidation = (): Validation => {
  class QueryValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new QueryValidationStub()
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
  paramsValidationStub: Validation
  queryValidationStub: Validation
  fetchStockComparisonStub: FetchStockComparison
}

const makeSut = (): SutTypes => {
  const paramsValidationStub = makeParamsValidation()
  const queryValidationStub = makeQueryValidation()
  const fetchStockComparisonStub = makeFetchStockComparison()
  const sut = new FetchStockComparisonController(
    paramsValidationStub, queryValidationStub, fetchStockComparisonStub
  )
  return {
    sut, paramsValidationStub, queryValidationStub, fetchStockComparisonStub
  }
}

describe('FetchStockComparison Controller', () => {
  it('Should call Params Validation with correct value', async () => {
    const { sut, paramsValidationStub } = makeSut()
    const validateSpy = jest.spyOn(paramsValidationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ stockSymbol: 'any_stock_symbol' })
  })

  it('Should return 400 if Params Validation fails', async () => {
    const { sut, paramsValidationStub } = makeSut()
    jest.spyOn(paramsValidationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Params Validation throws', async () => {
    const { sut, paramsValidationStub } = makeSut()
    jest.spyOn(paramsValidationStub, 'validate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Query Validation with correct values', async () => {
    const { sut, queryValidationStub } = makeSut()
    const validateSpy = jest.spyOn(queryValidationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })

  it('Should return 400 if Query Validation fails', async () => {
    const { sut, queryValidationStub } = makeSut()
    jest.spyOn(queryValidationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Query Validation throws', async () => {
    const { sut, queryValidationStub } = makeSut()
    jest.spyOn(queryValidationStub, 'validate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call FetchStockHistory with correct values', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockComparisonStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      stocksToCompare: ['another_stock', 'other_stock']
    })
  })

  it('Should call FetchStockHistory with just one stock to compare', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockComparisonStub, 'perform')
    await sut.handle({
      params: { stockSymbol: 'any_stock_symbol' },
      query: { stocksToCompare: 'another_stock' }
    })
    expect(performSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      stocksToCompare: ['another_stock']
    })
  })

  it('Should call FetchStockHistory without any empty stocksToCompare', async () => {
    const { sut, fetchStockComparisonStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockComparisonStub, 'perform')
    await sut.handle({
      params: { stockSymbol: 'any_stock_symbol' },
      query: { stocksToCompare: 'another_stock,,,,other,,,,other_stock' }
    })
    expect(performSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      stocksToCompare: ['another_stock', 'other', 'other_stock']
    })
  })
})
