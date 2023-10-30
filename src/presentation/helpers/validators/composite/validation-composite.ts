import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  async validate (input: any): Promise<Either<Error, null>> {
    for (const validation of this.validations) {
      const validationResult = await validation.validate(input)
      if (validationResult.isLeft()) {
        return left(validationResult.value)
      }
    }
    return right(null)
  }
}
