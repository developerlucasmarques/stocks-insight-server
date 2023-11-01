import { dateFormatValidationFactory, stockSymbolValidationFactory, validationCompositeFactory } from '@/main/factories/validators'
import type { Validation } from '@/presentation/contracts'

export const fetchStockGainsValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    dateFormatValidationFactory(['purchasedAt']),
    stockSymbolValidationFactory()
  )
  return validationCompositeFactory(validations)
}
