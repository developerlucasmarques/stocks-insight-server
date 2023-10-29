import app from '@/main/config/app'
import request from 'supertest'

describe('Stock Routes', () => {
  it('Should return the current an stock quote', async () => {
    const stockSymbol = 'any_stock_symbol'
    await request(app)
      .get(`/stock/${stockSymbol}/quote`)
      .expect({ ok: stockSymbol })
  })
})
