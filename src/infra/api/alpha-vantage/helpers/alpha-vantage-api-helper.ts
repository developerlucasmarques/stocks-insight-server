import type { StockQuote } from '@/domain/models/stock-quote'
import type { GlobalStockQuote, DailyStockQuote } from '../types'
import type { StockHistory } from '@/domain/models/stock-history'
import type { FetchStockHistoryData } from '@/domain/contracts'

export class AlphaVantageApiHelper {
  static formatStockQuote (data: GlobalStockQuote): StockQuote {
    return {
      name: data['Global Quote']['01. symbol'],
      lastPrice: this.parseNumFixed(data['Global Quote']['05. price']),
      pricedAt: data['Global Quote']['07. latest trading day']
    }
  }

  static formatStockHistory (dailyStock: DailyStockQuote, data: FetchStockHistoryData): StockHistory {
    const timeSeries = dailyStock['Time Series (Daily)']
    const filteredData: Record<string, any> = {}
    for (const date in timeSeries) {
      if (date >= data.initialDate && date <= data.finalDate) {
        filteredData[date] = timeSeries[date]
      }
    }
    const stockHistory: StockHistory = {
      name: data.stockSymbol,
      prices: Object.entries(filteredData).map(([date, dataValue]) => ({
        opening: this.parseNumFixed(dataValue['1. open']),
        low: this.parseNumFixed(dataValue['3. low']),
        high: this.parseNumFixed(dataValue['2. high']),
        closing: this.parseNumFixed(dataValue['4. close']),
        pricedAt: date,
        volume: this.parseNumFixed(dataValue['5. volume'])
      }))
    }
    return stockHistory
  }

  private static parseNumFixed (value: string): number {
    return Number(parseFloat(value).toFixed(2))
  }
}
