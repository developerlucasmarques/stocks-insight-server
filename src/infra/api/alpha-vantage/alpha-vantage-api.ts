import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockHistoryApi, FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import axios from 'axios'
import { MaximumLimitReachedError } from './errors/maximun-limit-reached-error'
import type { GlobalStockQuote } from './types/global-stock-quote'
import { type StockHistory } from '@/domain/models/stock-history'
import { type FetchStockHistoryData } from '@/domain/contracts'

export class AlphaVantageApi implements FetchStockQuoteBySymbolApi, FetchStockHistoryApi {
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
    if (!response.data) {
      return null
    }
    if (response.data.Information) {
      throw new MaximumLimitReachedError(response.data)
    }
    const data: GlobalStockQuote = response.data
    return {
      name: data['Global Quote']['01. symbol'],
      lastPrice: Number(Number(data['Global Quote']['05. price']).toFixed(2)),
      pricedAt: data['Global Quote']['07. latest trading day']
    }
  }

  async fetchStockHistory (data: FetchStockHistoryData): Promise<null | StockHistory> {
    const url = this.makeUrl('TIME_SERIES_DAILY', data.stockSymbol, 'full')
    await axios.get(url)
    return null
  }
}
