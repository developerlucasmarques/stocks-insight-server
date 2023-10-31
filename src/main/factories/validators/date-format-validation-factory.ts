import type { Validation } from '@/presentation/contracts'
import { DateFormatValidation } from '@/presentation/helpers/validators/date-format/date-format-validation'

export const dateFormatValidationFactory = (fieldNames: string[]): Validation => {
  return new DateFormatValidation(fieldNames)
}
