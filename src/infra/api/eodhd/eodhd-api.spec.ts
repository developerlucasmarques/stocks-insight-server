import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { EodhdApi } from './eodhd-api'

const apiToken = 'any_api_token'

const makeFakeUrl = (): string => {
  const baseUrl = 'https://eodhd.com/api/exchange-symbol-list/NASDAQ?api_token='
  return `${baseUrl}${apiToken}`
}

const makeFakeEodhdResponse = (): string => {
  return 'Code,Name,Country,Exchange,Currency,Type,Isin\n' +
    'AAACX,"A3 Alternative Credit Fund",USA,NASDAQ,USD,FUND,\n' +
    'AAC-UN,"Ares Acquisition Corp",USA,NASDAQ,USD,"Common Stock",KYG330321061,\n'
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
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeEodhdResponse())
    await sut.fetchAll()
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })

  it('Should return all stock symbols if fetch all is a success', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeEodhdResponse())
    const result = await sut.fetchAll()
    expect(result).toEqual(['AAACX', 'AAC-UN'])
  })

  it('Should return empty if stock symbols not found', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, null)
    const result = await sut.fetchAll()
    expect(result.length).toBe(0)
  })
})
