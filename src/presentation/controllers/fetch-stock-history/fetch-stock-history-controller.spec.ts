import { badRequest } from '@/presentation/helpers/http/http-helper'
import { left, right, type Either } from '@/shared/either'
import type { Validation } from '../../contracts'
import type { HttpRequest } from '../../http-types/http'
import { FetchStockHistoryController } from './fetch-stock-history-controller'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol',
    from: '2023-01-02',
    to: '2023-01-03'
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
  sut: FetchStockHistoryController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new FetchStockHistoryController(validationStub)
  return { sut, validationStub }
}

describe('FetchStockHistory Controller', () => {
  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({
      stockSymbol: 'any_stock_symbol',
      from: '2023-01-02',
      to: '2023-01-03'
    })
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
