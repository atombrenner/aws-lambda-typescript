import Router from 'lambda-router-typescript';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import UpdateController from './controllers/Update';
import UpdateService from './services/Update';
import MondayGQLGateway from './gateways/MondayGQL';
import DynamoDB from './repositories/DynamoDB';

type LambdaFunctionUrlEvent = APIGatewayProxyEventV2;
type LambdaFunctionUrlResult = APIGatewayProxyStructuredResultV2;

export async function handler(
    event: LambdaFunctionUrlEvent,
    context: Context
): Promise<LambdaFunctionUrlResult> {
    const mondayGateway = new MondayGQLGateway();
    const repository = new DynamoDB();

    const updateService = new UpdateService(mondayGateway, repository);

    const updateController = new UpdateController(updateService);

    const router = new Router();

    router.post("/update", (event) => updateController.handle(event as LambdaFunctionUrlEvent));

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
