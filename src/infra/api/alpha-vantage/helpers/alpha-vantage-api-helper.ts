import type { FetchStockHistoryData } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import type { StockQuote } from '@/domain/models/stock-quote'
import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchStockQuoteAtDateApiData } from '@/interactions/contracts/api'
import type { DailyStockQuote, GlobalStockQuote } from '../types'

export class AlphaVantageApiHelper {
  private static parseNumFixed (value: string): number {
    return Number(parseFloat(value).toFixed(2))
  }

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

  static formatStockQuoteAtDate (dailyStock: DailyStockQuote, data: FetchStockQuoteAtDateApiData): StockQuoteAtDate {
    const stockQuoteAtDate = dailyStock['Time Series (Daily)']
    console.log('LOGGGGGGGG', stockQuoteAtDate[data.quoteDate])
    const stockQuoteAtDateFormated: StockQuoteAtDate = {
      name: data.stockSymbol,
      quoteDate: data.quoteDate,
      pricedAtDate: this.parseNumFixed(stockQuoteAtDate[data.quoteDate]['4. close'])
    }
    return stockQuoteAtDateFormated
  }
}
