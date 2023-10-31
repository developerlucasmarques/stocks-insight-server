export type HttpResponse = {
  statusCode: number
  body: any
}

export type HttpRequest = {
  params?: any
  query?: any
  body?: any
}
