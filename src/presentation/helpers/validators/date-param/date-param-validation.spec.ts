import { InvalidDateError } from '@/presentation/errors/invalid-date-error'
import { DateParamValidation } from './date-param-validation'

const makeFakeInput = (initialDate: string, finalDate: string): any => (
  { to: initialDate, from: finalDate }
)

const makeSut = (): DateParamValidation => {
  return new DateParamValidation(['to', 'from'])
}

describe('DateParam Validation', () => {
  it('Should return InvalidDateError for date with invalid format', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023/01/02', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023/01/02'))
  })

  it('Should return InvalidDateError for date with invalid format (non-dash separator)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023_01_02', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023_01_02'))
  })

  it('Should return InvalidDateError for date with invalid format (non-numeric characters)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-Jan-02', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023-Jan-02'))
  })

  it('Should return InvalidDateError for date with invalid format (missing day)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023-01'))
  })

  it('Should return InvalidDateError for date with invalid format (missing month)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023--02', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023--02'))
  })

  it('Should return InvalidDateError for date with invalid format (extra characters)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01-02-extra', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023-01-02-extra'))
  })

  it('Should return InvalidDateError for an invalid date (nonexistent date)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-02-30', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023-02-30'))
  })

  it('Should return InvalidDateError for an invalid date (nonexistent date 2)', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-04-31', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023-04-31'))
  })

  it('Should return InvalidDateError if the second date is invalid', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01-02', '2023/01/03'))
    expect(result.value).toEqual(new InvalidDateError('2023/01/03'))
  })

  it('Should return valid result for a valid date', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01-02', '2023-01-03'))
    expect(result.isRight()).toBe(true)
  })
})
