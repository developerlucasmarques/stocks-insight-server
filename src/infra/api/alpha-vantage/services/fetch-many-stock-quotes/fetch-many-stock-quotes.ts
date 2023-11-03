import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchManyStockQuotesBySymbolsApi } from '@/interactions/contracts/api'
import type { GlobalStockQuote } from '../../types'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class FetchManyStockQuotesAlphaVantageApi implements FetchManyStockQuotesBySymbolsApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (func: string, symbol: string, outputsize?: string): string {
    if (outputsize) {
      return `${this.baseUrl}${func}&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`
    }
    return `${this.baseUrl}${func}&symbol=${symbol}&apikey=${this.apiKey}`
  }

  private async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const url = this.makeUrl('GLOBAL_QUOTE', stockSymbol)
    const response = await axios.get(url)
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    const data: GlobalStockQuote = response.data
    return AlphaVantageApiHelper.formatStockQuote(data)
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
}
