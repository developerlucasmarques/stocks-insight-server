export type StockSymbol = {
  symbol: string
}

export interface FetchStockSymbolCache {
  fetchOneSymbol: (stockSymbol: string) => Promise<null | StockSymbol>
}
