import RedisMock from 'ioredis-mock'
import type { Redis } from 'ioredis'
import { StockSymbolsRedisCache } from './stock-symbols-redis-cache'
import { RedisHelper } from './helpers/redis-helper'

const makeSut = (): StockSymbolsRedisCache => {
  const redis = new RedisMock()
  jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
  return new StockSymbolsRedisCache()
}

let redis: Redis

describe('StockSymbolsRedis Cache', () => {
  beforeAll(() => {
    redis = new RedisMock()
  })

  afterAll(() => {
    redis.disconnect()
  })

  beforeEach(async () => {
    await redis.flushall()
  })

  it('Should add symbols in Redis stockSymbols', async () => {
    const sut = makeSut()
    await sut.addAllSymbols([
      'any_stock_symbol', 'another_stock_symbol'
    ])
    const symbols = await redis.get('stockSymbols')
    const parseSymbols = JSON.parse(symbols as string)
    expect(parseSymbols).toEqual(['any_stock_symbol', 'another_stock_symbol'])
  })
})
