import type { CalculateStockGainsData, Gains } from './calculate-stock-gains-types'

export class CalculateStockGains {
  static execute (data: CalculateStockGainsData): Gains {
    const { purchasedAmount, lastPrice, priceAtDate } = data
    const stocks = Math.floor(purchasedAmount / priceAtDate)
    const capitalGains = Number(((lastPrice * stocks) - purchasedAmount).toFixed(2))
    return { capitalGains }
  }
}
