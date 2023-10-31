import type { Validation } from '@/presentation/contracts'
import { InvalidDateError } from '@/presentation/errors/invalid-date-error'
import { left, right, type Either } from '@/shared/either'

export class DateFormatValidation implements Validation {
  constructor (private readonly fieldNames: string[]) {}

  async validate (input: any): Promise<Either<Error, null>> {
    for (const field of this.fieldNames) {
      if (!this.isValidDate(input[field])) {
        return left(new InvalidDateError(input[field]))
      }
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
