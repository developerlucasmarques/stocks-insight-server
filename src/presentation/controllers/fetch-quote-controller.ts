import type { Controller } from '../contracts/controller'
import type { Validation } from '../contracts/validation'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class FetchQuoteController implements Controller {
  constructor (private readonly validationStub: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.validationStub.validate(httpRequest.params)
    return await Promise.resolve({
      body: '', statusCode: 0
    })
  }
}
