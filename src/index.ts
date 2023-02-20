import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2

export async function handler(
    event: LambdaFunctionUrlEvent,
    context: Context
): Promise<LambdaFunctionUrlResult> {
    return {
        statusCode: 200
    }
}
