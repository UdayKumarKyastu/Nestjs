declare module '@commercetools/sdk-client' {
  export const createClient: any
}

declare module '@commercetools/sdk-middleware-auth' {
  export const createAuthMiddlewareForClientCredentialsFlow: any
}

declare module '@commercetools/sdk-middleware-http' {
  interface HttpMiddlewareOptions {
    host: string
    fetch: any
  }
  export const createHttpMiddleware: (options: HttpMiddlewareOptions) => unknown
}
declare module '@commercetools/sdk-middleware-queue' {
  export const createQueueMiddleware: any
}
declare module '@commercetools/sdk-middleware-logger' {
  export const createLoggerMiddleware: any
}
