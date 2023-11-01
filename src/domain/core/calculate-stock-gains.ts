import type { CalculateStockGainsData, Gains } from './calculate-stock-gains-types'

export class CalculateStockGains {
  static execute (data: CalculateStockGainsData): Gains {
    const { purchasedAmount, lastPrice, pricedAtDate } = data
    const stocks = Math.floor(purchasedAmount / pricedAtDate)
    const capitalGains = Number(((lastPrice * stocks) - purchasedAmount).toFixed(2))
    return { capitalGains }
  }
}
