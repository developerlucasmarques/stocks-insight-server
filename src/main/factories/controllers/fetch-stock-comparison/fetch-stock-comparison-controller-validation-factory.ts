import type { Validation } from '@/presentation/contracts'
import { manyStocksValidationFactory, stockSymbolValidationFactory, validationCompositeFactory } from '@/main/factories/validators'

export const fetchStockComparisonControllerValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(
    stockSymbolValidationFactory(),
    manyStocksValidationFactory()
  )
  return validationCompositeFactory(validations)
}
