import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api'
import axios from 'axios'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'

export class FetchAllSymbolsOfListedStocksAlphaVantageApi implements FetchAllSymbolsOfListedStocksApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (): string {
    return `${this.baseUrl}LISTING_STATUS&apikey=${this.apiKey}`
  }

  async fetchAll (): Promise<string[]> {
    const response = await axios.get(this.makeUrl())
    if (!response.data) {
      return []
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    return []
  }
}
