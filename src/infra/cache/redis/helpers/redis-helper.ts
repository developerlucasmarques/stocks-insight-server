import { Redis } from 'ioredis'
import env from '@/main/config/env'

export class RedisHelper {
  private static cli: Redis | null

  static connect (): void {
    if (!RedisHelper.cli) {
      this.cli = new Redis({
        host: env.redisHost,
        port: Number(env.redisPort),
        password: env.redisPassword
      })
    }
  }

  static getInstance (): Redis {
    if (!this.cli) {
      RedisHelper.connect()
      return this.cli as unknown as Redis
    }
    return this.cli
  }

  static async disconnect (): Promise<void> {
    if (this.cli) {
      await this.cli.quit()
      this.cli = null
    }
  }
}
