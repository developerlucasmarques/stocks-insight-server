import { ValidationComposite } from './validation-composite'
import { type Either, left, right } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'
import { MissingParamError } from '@/presentation/errors'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return right(null)
    }
  }
  return new ValidationStub()
}

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut = new ValidationComposite([validationStubs[0], validationStubs[1]])
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      Promise.resolve(left(new MissingParamError('field')))
    )
    const result = await sut.validate({ name: 'any name' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more the one validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error()))
    )
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      Promise.resolve(left(new MissingParamError('name')))
    )
    const result = await sut.validate({ field: 'any_field' })
    expect(result.value).toEqual(new Error())
  })

  it('Should return null if no validation fails', async () => {
    const { sut } = makeSut()
    const result = await sut.validate({ field: 'any_field' })
    expect(result.value).toBe(null)
  })
})
