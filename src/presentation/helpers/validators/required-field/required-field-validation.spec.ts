import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/presentation/errors'

describe('RequiredField Validation', () => {
  it('Should return a MissinParamError if input not contain field name', async () => {
    const sut = new RequiredFieldValidation('field')
    const result = await sut.validate({ name: 'any name' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })
})
