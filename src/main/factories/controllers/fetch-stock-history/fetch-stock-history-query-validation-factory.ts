import { dateFormatValidationFactory, dateRangeValidationFactory, validationCompositeFactory } from '@/main/factories/validators'
import type { Validation } from '@/presentation/contracts'

export const fetchStockHistoryQueryValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    dateFormatValidationFactory(['from', 'to']),
    dateRangeValidationFactory('from', 'to')
  )
  return validationCompositeFactory(validations)
}
