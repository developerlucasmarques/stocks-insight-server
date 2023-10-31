import { right, type Either, left } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { FetchStockComparisonController } from './fetch-stock-comparison-controller'
import { badRequest } from '@/presentation/helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol'
  },
  query: {
    stocksToCompare: 'another_stock,other_stock'
  }
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

type SutTypes = {
  sut: FetchStockComparisonController
  paramsValidationStub: Validation
  queryValidationStub: Validation
}

const makeSut = (): SutTypes => {
  const paramsValidationStub = makeParamsValidation()
  const queryValidationStub = makeQueryValidation()
  const sut = new FetchStockComparisonController(paramsValidationStub, queryValidationStub)
  return { sut, paramsValidationStub, queryValidationStub }
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

  it('Should call Query Validation with correct values', async () => {
    const { sut, queryValidationStub } = makeSut()
    const validateSpy = jest.spyOn(queryValidationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ stockSymbol: 'another_stock' })
    expect(validateSpy).toHaveBeenCalledWith({ stockSymbol: 'other_stock' })
  })

  it('Should return 400 if Query Validation fails', async () => {
    const { sut, queryValidationStub } = makeSut()
    jest.spyOn(queryValidationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
