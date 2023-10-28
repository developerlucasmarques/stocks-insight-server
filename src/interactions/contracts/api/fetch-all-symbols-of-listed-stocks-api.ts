export type StockSymbols = {
  symbols: string[]
}

export interface FetchAllSymbolsOfListedStocksApi {
  fetchAll: () => Promise<null | StockSymbols>
}
