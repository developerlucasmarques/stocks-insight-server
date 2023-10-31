import type { Controller, Validation } from '../../contracts'
import type { HttpRequest, HttpResponse } from '../../http-types/http'

export class FetchStockComparisonController implements Controller {
  constructor (
    private readonly paransValidation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.paransValidation.validate(httpRequest.params)
    return { statusCode: 0, body: '' }
  }
}
