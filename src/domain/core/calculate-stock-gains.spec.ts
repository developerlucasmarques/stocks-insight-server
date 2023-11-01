import { CalculateStockGains } from './calculate-stock-gains'
import type { CalculateStockGainsData } from './calculate-stock-gains-types'

const makeFakeStockQuote = (): CalculateStockGainsData => ({
  lastPrice: 150.99,
  pricedAtDate: 140.00,
  purchasedAmount: 2000
})

describe('CalculateStockGains', () => {
  it('Should return an CapitalGains', async () => {
    const sut = CalculateStockGains.execute(makeFakeStockQuote())
    expect(sut.capitalGains).toBe(113.86)
  })

  it('Should return an negative capital gains', async () => {
    const sut = CalculateStockGains.execute({
      lastPrice: 150.99,
      pricedAtDate: 160.00,
      purchasedAmount: 2000
    })
    expect(sut.capitalGains).toBe(-188.12)
  })
})
