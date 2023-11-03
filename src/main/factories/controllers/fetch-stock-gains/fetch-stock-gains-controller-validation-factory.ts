import type { Validation } from '@/presentation/contracts'
import { dateFormatValidationFactory, stockSymbolValidationFactory, validationCompositeFactory } from '@/main/factories/validators'

export const fetchStockGainsControllerValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    stockSymbolValidationFactory(),
    dateFormatValidationFactory(['purchasedAt'])
  )
  return validationCompositeFactory(validations)
}
