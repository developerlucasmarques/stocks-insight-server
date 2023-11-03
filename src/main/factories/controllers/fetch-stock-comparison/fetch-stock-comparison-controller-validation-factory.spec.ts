import type { Validation } from '@/presentation/contracts'
import { manyStocksValidationFactory, stockSymbolValidationFactory } from '@/main/factories/validators'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'
import { fetchStockComparisonControllerValidationFactory } from './fetch-stock-comparison-controller-validation-factory'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockComparisonControllerValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockComparisonControllerValidationFactory()
    const validations: Validation[] = []
    validations.push(
      stockSymbolValidationFactory(),
      manyStocksValidationFactory()
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
