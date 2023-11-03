import type { Validation } from '@/presentation/contracts'
import { dateFormatValidationFactory, dateRangeValidationFactory, stockSymbolValidationFactory, validationCompositeFactory } from '@/main/factories/validators'

export const fetchStockHistoryControllerValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    stockSymbolValidationFactory(),
    dateFormatValidationFactory(['from', 'to']),
    dateRangeValidationFactory('from', 'to')
  )
  return validationCompositeFactory(validations)
}
