import type { Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'
import { dateFormatValidationFactory, dateRangeValidationFactory } from '@/main/factories/validators'
import { fetchStockHistoryQueryValidationFactory } from './fetch-stock-history-query-validation-factory'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockHistoryQueryValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockHistoryQueryValidationFactory()
    const validations: Validation[] = []
    validations.push(
      dateFormatValidationFactory(['from', 'to']),
      dateRangeValidationFactory('from', 'to')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
