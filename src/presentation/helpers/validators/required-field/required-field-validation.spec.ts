import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  it('Should return a MissinParamError if input not contain field name', async () => {
    const sut = makeSut()
    const result = await sut.validate({ name: 'any name' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  it('Should return a MissinParamError if field is empty on input', async () => {
    const sut = makeSut()
    const result = await sut.validate({
      name: 'any name',
      field: ''
    })
    expect(result.value).toEqual(new MissingParamError('field'))
  })
})
