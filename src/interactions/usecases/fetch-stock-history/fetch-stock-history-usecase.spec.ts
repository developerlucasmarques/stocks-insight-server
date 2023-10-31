import type { FetchStockHistoryData } from '@/domain/contracts/fetch-stock-history'
import type { StockHistory } from '@/domain/models/stock-history'
import type { FetchStockHistoryApi } from '@/interactions/contracts/api'
import { FetchStockHistoryUseCase } from './fetch-stock-history-usecase'

const makeFakeFetchStockHistoryData = (): FetchStockHistoryData => ({
  stockSymbol: 'any_stock_symbol',
  initialDate: '2023-01-02',
  finalDate: '2023-01-03'
})

const makeFakeStockHistory = (): StockHistory => ({
  name: 'any_stock_symbol',
  prices: [{
    opening: 139.09,
    low: 138.29,
    high: 141.10,
    closing: 140.50,
    pricedAt: '2023-01-02',
    volume: 9200
  }, {
    opening: 140.50,
    low: 136.29,
    high: 143.10,
    closing: 141.56,
    pricedAt: '2023-01-03',
    volume: 12500
  }]
})

const makeFetchStockHistoryApi = (): FetchStockHistoryApi => {
  class FetchStockHistoryApiStub implements FetchStockHistoryApi {
    async fetchStockHistory (data: FetchStockHistoryData): Promise<null | StockHistory> {
      return await Promise.resolve(makeFakeStockHistory())
    }
  }
  return new FetchStockHistoryApiStub()
}

type SutTypes = {
  sut: FetchStockHistoryUseCase
  fetchStockHistoryApiStub: FetchStockHistoryApi
}

const makeSut = (): SutTypes => {
  const fetchStockHistoryApiStub = makeFetchStockHistoryApi()
  const sut = new FetchStockHistoryUseCase(fetchStockHistoryApiStub)
  return { sut, fetchStockHistoryApiStub }
}

describe('FetchStockHistory UseCase', () => {
  it('Should call FetchStockHistoryApi with correct values', async () => {
    const { sut, fetchStockHistoryApiStub } = makeSut()
    const fetchStockHistorySpy = jest.spyOn(fetchStockHistoryApiStub, 'fetchStockHistory')
    await sut.perform(makeFakeFetchStockHistoryData())
    expect(fetchStockHistorySpy).toHaveBeenCalledWith(makeFakeFetchStockHistoryData())
  })
})
