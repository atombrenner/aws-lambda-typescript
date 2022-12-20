import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'

// AWS Lambda Function Urls are reusing types from APIGateway
// but many fields are not used or filled with default values
// see: https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html
// It would be nice to have types with only the used fields and add them to:
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/aws-lambda
type LambdaFunctionUrlEvent = APIGatewayProxyEventV2
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2

export async function handler(
    event: LambdaFunctionUrlEvent,
    context: Context
): Promise<LambdaFunctionUrlResult> {
    console.log(context.functionName)
    console.log(`${event.requestContext.http.method} ${event.rawPath}`)
    return {
        statusCode: 200,
        body: JSON.stringify(event, null, 2),
    }
}
