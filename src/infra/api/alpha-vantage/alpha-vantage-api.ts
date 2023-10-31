import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import axios from 'axios'
import { MaximumLimitReachedError } from './errors/maximun-limit-reached-error'
import type { GlobalStockQuote } from './types/global-stock-quote'

export class AlphaVantageApi implements FetchStockQuoteBySymbolApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const url = this.makeUrl('GLOBAL_QUOTE', stockSymbol)
    const response = await axios.get(url)
    console.log(response.data)
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

  private makeUrl (func: string, symbol: string): string {
    return `${this.baseUrl}${func}&symbol=${symbol}&apikey=${this.apiKey}`
  }
}
