import type { Validation } from '@/presentation/contracts'
import { dateFormatValidationFactory, stockSymbolValidationFactory } from '@/main/factories/validators'
import { fetchStockGainsControllerValidationFactory } from './fetch-stock-gains-controller-validation-factory'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockGainsControllerValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockGainsControllerValidationFactory()
    const validations: Validation[] = []
    validations.push(
      stockSymbolValidationFactory(),
      dateFormatValidationFactory(['purchasedAt'])
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
