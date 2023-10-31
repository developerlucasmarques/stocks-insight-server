import type { Validation } from '@/presentation/contracts'
import { dateFormatValidationFactory } from '../../validators/date-format-validation-factory'
import { dateRangeValidationFactory } from '../../validators/date-range-validation-factory'
import { validationCompositeFactory } from '../../validators/validation-composite-factory'

export const fetchStockHistoryQueryValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    dateFormatValidationFactory(['from', 'to']),
    dateRangeValidationFactory('from', 'to')
  )
  return validationCompositeFactory(validations)
}
