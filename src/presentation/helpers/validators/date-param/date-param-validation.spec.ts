import { InvalidDateError } from '@/presentation/errors/invalid-date-error'
import { DateParamValidation } from './date-param-validation'

const makeSut = (): DateParamValidation => {
  return new DateParamValidation()
}

describe('DateParam Validation', () => {
  it('Should return InvalidDateError for date with invalid format', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023/01/02' })
    expect(result.value).toEqual(new InvalidDateError('2023/01/02'))
  })

  it('Should return InvalidDateError for date with invalid format (non-dash separator)', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023_01_02' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new InvalidDateError('2023_01_02'))
  })

  it('Should return InvalidDateError for date with invalid format (non-numeric characters)', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023-Jan-02' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new InvalidDateError('2023-Jan-02'))
  })

  it('Should return InvalidDateError for date with invalid format (missing day)', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023-01' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new InvalidDateError('2023-01'))
  })

  it('Should return InvalidDateError for date with invalid format (missing month)', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023--02' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new InvalidDateError('2023--02'))
  })

  it('Should return InvalidDateError for date with invalid format (extra characters)', async () => {
    const sut = makeSut()
    const result = await sut.validate({ to: '2023-01-02-extra' })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new InvalidDateError('2023-01-02-extra'))
  })
})
