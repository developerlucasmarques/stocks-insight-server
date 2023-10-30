import { Redis } from 'ioredis'
import { RedisMemoryServer } from 'redis-memory-server'
import request from 'supertest'
import app from '../config/app'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'

let redisServer: RedisMemoryServer
let redis: Redis

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

  it('Should return the current an stock quote', async () => {
    await redis.set('stockSymbols', JSON.stringify(['AAPL', 'TSLA']))
    await request(app)
      .get('/stock/AAPL/quote')
      .expect(200)
  })
})
