import type { Validation } from '@/presentation/contracts'
import { InvalidDateError } from '@/presentation/errors/invalid-date-error'
import { right, type Either, left } from '@/shared/either'

export class DateParamValidation implements Validation {
  async validate (input: any): Promise<Either<Error, null>> {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(input.to)) {
      return left(new InvalidDateError(input.to))
    }
    return right(null)
  }
}
