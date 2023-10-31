export type StockHistoryPrices = {
  opening: number
  low: number
  high: number
  closing: number
  pricedAt: string
  volume: number
}

export type StockHistory = {
  name: string
  prices: StockHistoryPrices[]
}
