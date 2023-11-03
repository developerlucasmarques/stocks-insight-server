import type { StockQuote } from '@/domain/models/stock-quote'
import type { GlobalStockQuote } from '../../types'
import { FetchManyStockQuotesAlphaVantageApi } from './fetch-many-stock-quotes'
import { MaximumLimitReachedError } from '../../errors/maximun-limit-reached-error'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (symbol: string): string => {
  return `${baseUrl}GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
}

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_symbol',
  lastPrice: 166.89,
  pricedAt: '2023-01-01'
})

const makeFakeStockQuotes = (): StockQuote[] => ([{
  name: 'any_stock_symbol',
  lastPrice: 166.89,
  pricedAt: '2023-01-01'
}, {
  name: 'another_stock_symbol',
  lastPrice: 167.09,
  pricedAt: '2023-01-01'
}])

const makeFakeGlobalStockQuote = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'any_stock_symbol',
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

const makeFakeGlobalStockQuote2 = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'another_stock_symbol',
    '02. open': '170.3700',
    '03. high': '171.3775',
    '04. low': '165.6700',
    '05. price': '167.0900',
    '06. volume': '70625258',
    '07. latest trading day': '2023-01-01',
    '08. previous close': '171.1000',
    '09. change': '-4.2100',
    '10. change percent': '-2.4605%'
  }
})

const makeSut = (): FetchManyStockQuotesAlphaVantageApi => {
  return new FetchManyStockQuotesAlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('FetchManyStockQuotes AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url for each stock symbol received', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, makeFakeGlobalStockQuote())
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(200, makeFakeGlobalStockQuote2())
    await sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl('any_stock_symbol'))
    expect(axiosMock.history.get[1].url).toBe(makeFakeUrl('another_stock_symbol'))
  })

  it('Should return StockQuote array if fetch many stock quote is a success', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, makeFakeGlobalStockQuote())
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(200, makeFakeGlobalStockQuote2())
    const result = await sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    expect(result).toEqual(makeFakeStockQuotes())
  })

  it('Should return an StockQuote if fetch many stock quote not found one stock', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, makeFakeGlobalStockQuote())
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(200, null)
    const result = await sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    expect(result).toEqual([makeFakeStockQuote()])
  })

  it('Should return empty if no stock quote found', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, null)
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(200, null)
    const result = await sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    expect(result.length).toBe(0)
  })

  it('Should throw if axios throws', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(404)
    const promise = sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if second consult axios throws', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, null)
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(404)
    const promise = sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if AlphaVantage return Information field', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl('any_stock_symbol')).reply(200, { Information: 'any_information' })
    axiosMock.onGet(makeFakeUrl('another_stock_symbol')).reply(200, null)
    const promise = sut.fetchManyStockQuotes(['any_stock_symbol', 'another_stock_symbol'])
    await expect(promise).rejects.toThrow()
    await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
  })
})
