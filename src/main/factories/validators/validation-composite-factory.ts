import type { Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators'

export const validationCompositeFactory = (validations: Validation[]): Validation => {
  return new ValidationComposite(validations)
}
