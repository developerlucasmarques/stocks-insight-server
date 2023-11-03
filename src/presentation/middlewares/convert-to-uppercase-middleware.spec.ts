import type { HttpRequest } from '../http-types/http'
import { ConvertToUppercaseMiddleware } from './convert-to-uppercase-middleware'
import { ok } from '../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  params: { anyField: 'any_value' }
})

const makeSut = (): ConvertToUppercaseMiddleware => {
  return new ConvertToUppercaseMiddleware('params', 'anyField')
}

describe('ConvertToUppercase Middleware', () => {
  it('Should return uppercase field', async () => {
    const sut = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(ok({ anyField: 'ANY_VALUE' }))
  })
})
