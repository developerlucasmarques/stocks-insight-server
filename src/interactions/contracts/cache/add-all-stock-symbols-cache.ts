export interface AddAllStockSymbolsCache {
  addAllSymbols: (symbols: string[]) => Promise<void>
}
