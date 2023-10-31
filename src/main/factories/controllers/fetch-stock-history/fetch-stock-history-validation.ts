import type { Validation } from '@/presentation/contracts'
import { stockSymbolValidationFactory } from '../../validators/stock-symbol-validation-factory'
import { validationCompositeFactory } from '../../validators/validation-composite-factory'
import { dateFormatValidationFactory } from '../../validators/date-format-validation-factory'
import { dateRangeValidationFactory } from '../../validators/date-range-validation-factory'

export const fetchStockHistoryValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    stockSymbolValidationFactory(),
    dateFormatValidationFactory(['to', 'from']),
    dateRangeValidationFactory('to', 'from')
  )
  return validationCompositeFactory(validations)
}
