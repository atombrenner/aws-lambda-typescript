import Router from 'lambda-router-typescript';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2;
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2;

export async function handler(
    event: LambdaFunctionUrlEvent,
    context: Context
): Promise<LambdaFunctionUrlResult> {

    const router = new Router();

    try {
        const response = await router.call(event);
        return response;
    } catch (error: any) {
        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify(error.body) || "Internal error."
        };
    }

}
