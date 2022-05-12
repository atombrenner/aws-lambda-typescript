import { ALBResult, ScheduledEvent } from 'aws-lambda'

// TODO: add PR for new event type: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/aws-lambda
interface HttpRequestEvent {
  headers: Record<string, string>
  isBase64Encoded: boolean
  queryStringParameters?: Record<string, string>
  rawPath: string
  rawQueryString: string
  requestContext: {
    accountId: string
    apiId: string
    domainName: string
    domainPrefix: string
    http: {
      method: string
      path: string
      protocol: string
      sourceIp: string
      userAgent: string
    }
    requestId: string
    routeKey: string
    stage: string
    time: string
    timeEpoch: number
  }
  routeKey: string
  version: string
}

type HttpResponse = Partial<ALBResult>

export async function handler(event: HttpRequestEvent): Promise<HttpResponse> {
  console.log(`${event.requestContext.http.method} ${event.rawPath}`)
  return {
    statusCode: 200,
    body: JSON.stringify(event, null, 2),
  }
}
