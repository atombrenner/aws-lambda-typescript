import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import GetService from '../services/Get';

import ErrorResponse from '../utils/ErrorResponse';

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2;
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2;

export default class GetController {
    constructor(
        private readonly getService: GetService
    ) { }

    async handle(event: LambdaFunctionUrlEvent): Promise<LambdaFunctionUrlResult> {
        try {

            const params = event.queryStringParameters;

            let result;

            if (!params || !params.startKey) {
                result = await this.getService.execute();
            } else {
                const startKey = parseInt(params.startKey);
                result = await this.getService.execute(startKey);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    ...result
                })
            }
        } catch (e: any) {
            if (e instanceof ErrorResponse) {
                const error: ErrorResponse = e;
                return {
                    statusCode: 500,
                    body: JSON.stringify(error)
                }
            }

            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: e.message || "Internal error!",
                    backtrace: JSON.stringify(e),
                    stack: e.stack || ""
                })
            }
        }
    }
}
