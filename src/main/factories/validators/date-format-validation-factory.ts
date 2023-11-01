import type { Validation } from '@/presentation/contracts'
import { DateFormatValidation } from '@/presentation/helpers/validators'

export const dateFormatValidationFactory = (fieldNames: string[]): Validation => {
  return new DateFormatValidation(fieldNames)
}
