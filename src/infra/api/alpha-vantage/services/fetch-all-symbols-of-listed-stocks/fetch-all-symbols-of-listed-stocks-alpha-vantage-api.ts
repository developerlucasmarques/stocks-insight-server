import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api'
import axios from 'axios'

export class FetchAllSymbolsOfListedStocksAlphaVantageApi implements FetchAllSymbolsOfListedStocksApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (): string {
    return `${this.baseUrl}LISTING_STATUS&apikey=${this.apiKey}`
  }

  async fetchAll (): Promise<string[]> {
    await axios.get(this.makeUrl())
    return []
  }
}
