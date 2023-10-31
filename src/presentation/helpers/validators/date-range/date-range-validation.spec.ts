import { InvalidDateRangeError } from '@/presentation/errors'
import { DateRangeValidation } from './date-range-validation'

const makeFakeInput = (initialDate: string, finalDate: string): any => (
  { to: initialDate, from: finalDate }
)

const makeSut = (): DateRangeValidation => {
  return new DateRangeValidation('to', 'from')
}

describe('DateRange Validation', () => {
  it('Should return InvalidDateRangeError if initial date is greater than final date', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01-03', '2023-01-02'))
    expect(result.value).toEqual(new InvalidDateRangeError())
  })

  it('Should return valid result if initial date is equal to final date', async () => {
    const sut = makeSut()
    const result = await sut.validate(makeFakeInput('2023-01-02', '2023-01-02'))
    expect(result.isRight()).toBe(true)
  })
})
