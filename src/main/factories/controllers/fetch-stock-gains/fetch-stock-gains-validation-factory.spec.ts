import { dateFormatValidationFactory, stockSymbolValidationFactory } from '@/main/factories/validators'
import type { Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'
import { fetchStockGainsValidationFactory } from './fetch-stock-gains-validation-factory'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockGainsValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockGainsValidationFactory()
    const validations: Validation[] = []
    validations.push(
      dateFormatValidationFactory(['purchasedAt']),
      stockSymbolValidationFactory()
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
