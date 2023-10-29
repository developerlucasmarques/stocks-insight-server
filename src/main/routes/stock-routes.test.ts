import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import type { Redis } from 'ioredis'
import RedisMock from 'ioredis-mock'
import request from 'supertest'
import app from '../config/app'

let redis: Redis

describe('StockSymbolsRedis Cache', () => {
  beforeAll(() => {
    redis = new RedisMock()
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
  })

  afterAll(() => {
    redis.disconnect()
  })

  beforeEach(async () => {
    await redis.flushall()
  })

  it('Should return the current an stock quote', async () => {
    const stockSymbol = 'any_stock_symbol'
    await request(app)
      .get(`/stock/${stockSymbol}/quote`)
      .expect({ ok: stockSymbol })
  })
})
