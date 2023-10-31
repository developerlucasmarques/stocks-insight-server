import { right, type Either, left } from '@/shared/either'
import type { Validation } from '../../contracts'
import type { HttpRequest } from '../../http-types/http'
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

type SutTypes = {
  sut: FetchStockComparisonController
  paramsValidationStub: Validation
}

const makeSut = (): SutTypes => {
  const paramsValidationStub = makeParamsValidation()
  const sut = new FetchStockComparisonController(paramsValidationStub)
  return { sut, paramsValidationStub }
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
})
