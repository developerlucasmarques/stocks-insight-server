import type { Router } from 'express'
import { fetchStockQuoteControllerFactory, fetchStockStoryControllerFactory } from '../factories/controllers'
import { fetchStockComparisonControllerFactory } from '../factories/controllers/fetch-stock-comparison/fetch-stock-comparison-controller-factory'
import { fetchStockGainsControllerFactory } from '../factories/controllers/fetch-stock-gains/fetch-stock-gains-factory'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { converToUppercaseMiddlewareFactory } from '../factories/middlewares/convert-to-uppercase-middleware'

const convertToUppercaseStockSymbolMiddleware = adaptMiddleware(
  converToUppercaseMiddlewareFactory('params', 'stockSymbol')
)

export default (router: Router): void => {
  router.get(
    '/stock/:stockSymbol/quote',
    convertToUppercaseStockSymbolMiddleware,
    adaptRoute(fetchStockQuoteControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/history',
    convertToUppercaseStockSymbolMiddleware,
    adaptRoute(fetchStockStoryControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/compare',
    convertToUppercaseStockSymbolMiddleware,
    adaptMiddleware(converToUppercaseMiddlewareFactory('params', 'stocksToCompare')),
    adaptRoute(fetchStockComparisonControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/gains',
    convertToUppercaseStockSymbolMiddleware,
    adaptRoute(fetchStockGainsControllerFactory())
  )
}
