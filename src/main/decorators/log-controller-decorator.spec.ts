import type { LogErrorRepo } from '@/interactions/contracts/db/log-error-repo'
import type { Controller } from '@/presentation/contracts'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { LogControllerDecorator } from './log-controller-decorator'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    field: 'any_value'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok({ data: 'any_value' }))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepo = (): LogErrorRepo => {
  class LogErrorRepositoryStub implements LogErrorRepo {
    async logError (stackError: string): Promise<void> {
      await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepoStub: LogErrorRepo
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepoStub = makeLogErrorRepo()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepoStub)
  return { sut, controllerStub, logErrorRepoStub }
}

describe('LogController Decorator', () => {
  it('Should call the Controller handle method with the correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Should return the same result of the Controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ data: 'any_value' }))
  })

  it('Should call LogErrorRepo with correct error if Controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepoStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(makeFakeServerError())
    )
    const logSpy = jest.spyOn(logErrorRepoStub, 'logError')
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
