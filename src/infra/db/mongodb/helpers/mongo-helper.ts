import { MongoClient, type Collection } from 'mongodb'

export class MongoHelper {
  private static client: MongoClient | null
  private static uri: undefined | string

  static async connect (uri: string | undefined): Promise<void> {
    if (!uri) {
      this.uri = 'mongodb://127.0.0.1:27017/stocks-insight'
    } else {
      this.uri = uri
    }
    this.client = await MongoClient.connect(this.uri)
    console.log(`MongoDB running at ${this.uri}`)
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }

  static async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client?.db().collection(name) as Collection
  }
}
