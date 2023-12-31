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

  describe('addAllSymbols()', () => {
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

  describe('fetchOneSymbol()', () => {
    it('Should fetch one symbol on success', async () => {
      const sut = makeSut()
      await redis.set('stockSymbols', JSON.stringify([
        'any_stock_symbol', 'another_stock_symbol'
      ]))
      const symbols = await sut.fetchOneSymbol('any_stock_symbol')
      expect(symbols).toEqual({ symbol: 'any_stock_symbol' })
    })

    it('Should return null if no symbol is found', async () => {
      const sut = makeSut()
      const symbols = await sut.fetchOneSymbol('any_stock_symbol')
      expect(symbols).toBeNull()
    })

    it('Should return null if the searched symbol is not found', async () => {
      const sut = makeSut()
      await redis.set('stockSymbols', JSON.stringify(['another_stock_symbol']))
      const symbols = await sut.fetchOneSymbol('any_stock_symbol')
      expect(symbols).toBeNull()
    })
  })
})
