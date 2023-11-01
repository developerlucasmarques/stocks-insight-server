import { right, type Either } from '@/shared/either'
import type { Validation } from '../../contracts'
import type { HttpRequest } from '../../http-types/http'
import { FetchStockGainsController } from './fetch-stock-gains-controller'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol',
    purchasedAt: '2023-01-01',
    purchasedAmount: '10000'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ValidationStub()
}

type SutTypes = {
  sut: FetchStockGainsController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new FetchStockGainsController(validationStub)
  return { sut, validationStub }
}

describe('FetchStockGains Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().params)
  })
})
