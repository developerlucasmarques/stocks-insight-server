import { Redis } from 'ioredis'
import { RedisMemoryServer } from 'redis-memory-server'
import request from 'supertest'
import app from '../config/app'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'

let redisServer: RedisMemoryServer
let redis: Redis

jest.setTimeout(10000)

describe('Stock Routes', () => {
  beforeAll(async () => {
    redisServer = new RedisMemoryServer()
    const host = await redisServer.getHost()
    const port = await redisServer.getPort()
    redis = new Redis({ host, port })
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
  })

  afterAll(async () => {
    redis.disconnect()
    await redisServer.stop()
  })

  beforeEach(async () => {
    await redis.flushall()
  })

  it('Should return 200 if StockQuote on success', async () => {
    await redis.set('stockSymbols', JSON.stringify(['AAPL', 'TSLA']))
    await request(app)
      .get('/stock/AAPL/quote')
      .expect(200)
  })

  it('Should return 200 if StockHistory on success', async () => {
    await redis.set('stockSymbols', JSON.stringify(['AAPL', 'TSLA']))
    await request(app)
      .get('/stocks/AAPL/history?from=2023-01-02&to=2023-01-03')
      .expect(200)
  })

  it('Should return 200 if StockComparison on success', async () => {
    await redis.set('stockSymbols', JSON.stringify(['AAPL', 'TSLA', 'AMZN']))
    await request(app)
      .get('/stocks/AAPL/compare?stocksToCompare=TSLA,AMZN')
      .expect(200)
  })
})
