import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { EodhdApi } from './eodhd-api'

const apiToken = 'any_api_token'

const makeFakeUrl = (): string => {
  const baseUrl = 'https://eodhd.com/api/exchange-symbol-list/NASDAQ?api_token='
  return `${baseUrl}${apiToken}`
}

const makeSut = (): EodhdApi => {
  return new EodhdApi(apiToken)
}

let axiosMock: MockAdapter

describe('Eodhd Api', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, { data: 'any' })
    await sut.fetchAll()
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })
})
