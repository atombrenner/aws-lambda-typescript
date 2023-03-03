import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import UpdateService from '../services/Update';
import ErrorResponse from '../utils/ErrorResponse';

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2;
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2;

export default class UpdateController {
    constructor(
        private readonly updateService: UpdateService
    ) { }

    async handle(event: LambdaFunctionUrlEvent): Promise<LambdaFunctionUrlResult> {
        try {

            await this.updateService.execute();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true
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
