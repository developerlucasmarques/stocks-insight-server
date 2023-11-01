import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { fetchStockQuoteControllerFactory, fetchStockStoryControllerFactory } from '../factories/controllers'
import { fetchStockComparisonControllerFactory } from '../factories/controllers/fetch-stock-comparison/fetch-stock-comparison-controller-factory'
import { fetchStockGainsControllerFactory } from '../factories/controllers/fetch-stock-gains/fetch-stock-gains-factory'

export default (router: Router): void => {
  router.get(
    '/stock/:stockSymbol/quote', adaptRoute(fetchStockQuoteControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/history', adaptRoute(fetchStockStoryControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/compare', adaptRoute(fetchStockComparisonControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/gains', adaptRoute(fetchStockGainsControllerFactory())
  )
}
