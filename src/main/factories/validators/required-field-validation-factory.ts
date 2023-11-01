import type { Validation } from '@/presentation/contracts'
import { RequiredFieldValidation } from '@/presentation/helpers/validators'

export const requiredFieldValidationFactory = (fieldName: string): Validation => {
  return new RequiredFieldValidation(fieldName)
}
