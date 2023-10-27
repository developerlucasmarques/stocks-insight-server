export class InvalidStockSymbolError extends Error {
  constructor (stockSymbol: string) {
    super(`Stock with symbol ${stockSymbol} invalid`)
    this.name = 'InvalidStockSymbolError'
  }
}
