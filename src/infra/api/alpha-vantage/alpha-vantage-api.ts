import type { FetchStockHistoryData } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import type { StockQuote } from '@/domain/models/stock-quote'
import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchManyStockQuotesBySymbolsApi, FetchStockHistoryApi, FetchStockQuoteAtDateApi, FetchStockQuoteAtDateApiData, FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import type { DailyStockQuote, GlobalStockQuote } from './types'
import { AlphaVantageApiHelper } from './helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class AlphaVantageApi implements FetchStockQuoteBySymbolApi, FetchStockHistoryApi, FetchManyStockQuotesBySymbolsApi, FetchStockQuoteAtDateApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (func: string, symbol: string, outputsize?: string): string {
    if (outputsize) {
      return `${this.baseUrl}${func}&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`
    }
    return `${this.baseUrl}${func}&symbol=${symbol}&apikey=${this.apiKey}`
  }

  async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const url = this.makeUrl('GLOBAL_QUOTE', stockSymbol)
    const response = await axios.get(url)
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    const data: GlobalStockQuote = response.data
    return AlphaVantageApiHelper.formatStockQuote(data)
  }

  async fetchStockHistory (data: FetchStockHistoryData): Promise<null | StockHistory> {
    const url = this.makeUrl('TIME_SERIES_DAILY', data.stockSymbol, 'full')
    const response = await axios.get(url)
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    if (!AlphaVantageApiHelper.existInData(response.data, 'Time Series (Daily)')) {
      return null
    }
    const dailyStock: DailyStockQuote = response.data
    return AlphaVantageApiHelper.formatStockHistory(dailyStock, data)
  }

  async fetchManyStockQuotes (stockSymbols: string[]): Promise<StockQuote[]> {
    const stockQuoteResults: StockQuote[] = []
    for (const symbol of stockSymbols) {
      const stock = await this.fetchStockQuote(symbol)
      if (stock) {
        stockQuoteResults.push(stock)
      }
    }
    return stockQuoteResults
  }

  async fetchStockQuoteAtDate (data: FetchStockQuoteAtDateApiData): Promise<null | StockQuoteAtDate> {
    const url = this.makeUrl('TIME_SERIES_DAILY', data.stockSymbol, 'full')
    const response = await axios.get(url)
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    if (!response.data?.['Time Series (Daily)'][data.quoteDate]) {
      return null
    }
    const dailyStock: DailyStockQuote = response.data
    return AlphaVantageApiHelper.formatStockQuoteAtDate(dailyStock, data)
  }
}
