import type { Validation } from '@/presentation/contracts'
import { DateRangeValidation } from '@/presentation/helpers/validators/date-range/date-range-validation'

export const dateRangeValidationFactory = (
  initialDateFieldName: string, finalDateFieldName: string
): Validation => {
  return new DateRangeValidation(initialDateFieldName, finalDateFieldName)
}
