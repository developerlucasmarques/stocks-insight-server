import type { Validation } from '@/presentation/contracts'
import { InvalidDateRangeError } from '@/presentation/errors'
import { left, right, type Either } from '@/shared/either'

export class DateRangeValidation implements Validation {
  constructor (
    private readonly initialDateField: string,
    private readonly finalDateField: string
  ) {}

  async validate (input: any): Promise<Either<Error, null>> {
    if (new Date(input[this.initialDateField]) > new Date(input[this.finalDateField])) {
      return left(new InvalidDateRangeError())
    }
    return right(null)
  }
}
