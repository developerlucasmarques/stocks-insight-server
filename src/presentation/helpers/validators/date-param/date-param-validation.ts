import type { Validation } from '@/presentation/contracts'
import { InvalidDateError } from '@/presentation/errors/invalid-date-error'
import { right, type Either, left } from '@/shared/either'

export class DateParamValidation implements Validation {
  async validate (input: any): Promise<Either<Error, null>> {
    if (!this.isValidDate(input.to)) {
      return left(new InvalidDateError(input.to))
    }
    return right(null)
  }

  private isValidDate (inputDate: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(inputDate)) {
      return false
    }
    const parts = inputDate.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    if (month < 1 || month > 12) {
      return false
    }
    if (day < 1 || day > new Date(year, month, 0).getDate()) {
      return false
    }
    return true
  }
}
