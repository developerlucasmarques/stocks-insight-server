import type { Controller } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const params: Record<string, any> = req.params
    if (req.query) {
      const keys = Object.keys(req.query)
      for (const key of keys) {
        params[key] = req.query[key]
      }
    }
    const httpRequest: HttpRequest = { body: req.body, params }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        name: httpResponse.body.name,
        error: httpResponse.body.message,
        statusCode: httpResponse.statusCode
      })
    }
  }
}
