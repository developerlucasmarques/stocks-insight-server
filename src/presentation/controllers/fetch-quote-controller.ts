import type { Controller } from '../contracts/controller'
import type { Validation } from '../contracts/validation'
import type { HttpRequest, HttpResponse } from '../http-types/http'

export class FetchQuoteController implements Controller {
  constructor (private readonly validationStub: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationResult = await this.validationStub.validate(httpRequest.params)
    if (validationResult.isLeft()) {
      return {
        statusCode: 400,
        body: validationResult.value
      }
    }
    return await Promise.resolve({
      body: '', statusCode: 0
    })
  }
}
