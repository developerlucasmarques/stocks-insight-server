import { RedisHelper } from './redis-helper'

describe('RedisHelper', () => {
  beforeEach(() => {
    RedisHelper.connect()
  })

  afterEach(async () => {
    await RedisHelper.getInstance().quit()
  })

  it('Should create only once Redis instance', () => {
    const redis1 = RedisHelper.getInstance()
    const redis2 = RedisHelper.getInstance()
    expect(redis1).toBe(redis2)
  })
})
