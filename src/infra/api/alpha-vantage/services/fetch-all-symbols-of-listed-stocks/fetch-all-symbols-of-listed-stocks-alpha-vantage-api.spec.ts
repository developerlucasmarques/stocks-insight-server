import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { FetchAllSymbolsOfListedStocksAlphaVantageApi } from './fetch-all-symbols-of-listed-stocks-alpha-vantage-api'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (): string => {
  return `${baseUrl}LISTING_STATUS&apikey=${apiKey}`
}

const makeFakeListingStatusResponse = (): string => (
  'symbol,name,exchange,assetType,ipoDate,delistingDate,status\r\n' +
  'A,Agilent Technologies Inc,NYSE,Stock,1999-11-18,null,Active\r\n' +
  'AA,Alcoa Corp,NYSE,Stock,2016-10-18,null,Active\r\n' +
  'AAA,AXS First Priority CLO Bond ETF,NYSE ARCA,ETF,2020-09-09,null,Active\r\n' +
  'AAAU,Goldman Sachs Physical Gold ETF,BATS,ETF,2018-08-15,null,Active\r\n'
)

const makeSut = (): FetchAllSymbolsOfListedStocksAlphaVantageApi => {
  return new FetchAllSymbolsOfListedStocksAlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('FetchAllSymbolsOfListedStocks AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeListingStatusResponse())
    await sut.fetchAll()
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })
})
