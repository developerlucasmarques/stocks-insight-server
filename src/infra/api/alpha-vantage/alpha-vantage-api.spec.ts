import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AlphaVantageApi } from './alpha-vantage-api'
import type { GlobalStockQuote } from './types/global-stock-quote'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeGlobalStockQuote = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'AAPL',
    '02. open': '170.3700',
    '03. high': '171.3775',
    '04. low': '165.6700',
    '05. price': '166.8900',
    '06. volume': '70625258',
    '07. latest trading day': '2023-01-01',
    '08. previous close': '171.1000',
    '09. change': '-4.2100',
    '10. change percent': '-2.4605%'
  }
})

const makeSut = (): AlphaVantageApi => {
  return new AlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    const stockSymbol = 'AAPL'
    const url = `${baseUrl}GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`
    axiosMock.onGet(url).reply(200, makeFakeGlobalStockQuote())
    await sut.fetchStockQuote(stockSymbol)
    expect(axiosMock.history.get[0].url).toBe(url)
  })

  it('Should return a GlobalStockQuote if fetch stock quote is a success', async () => {
    const sut = makeSut()
    const stockSymbol = 'AAPL'
    const url = `${baseUrl}GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`
    axiosMock.onGet(url).reply(200, makeFakeGlobalStockQuote())
    const result = await sut.fetchStockQuote(stockSymbol)
    expect(result).toEqual({
      name: 'AAPL',
      lastPrice: 166.89,
      pricedAt: '2023-01-01'
    })
  })
})
