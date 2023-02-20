import AWS from 'aws-sdk';

import Repository from "./Base";

export default class DynamoDB implements Repository {

    private documentClient: AWS.DynamoDB.DocumentClient;

    constructor() {
        AWS.config.region = 'us-east-1';
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async createOrUpdateItem(id: number, object: object, tableName: string): Promise<void> {
        return this.documentClient.put({
            TableName: tableName,
            Item: {
                ...object,
                id: id
            }
        })
            .promise()
            .then(() => { });
    }

    async deleteItem(id: number, tableName: string): Promise<void> {
        return this.documentClient.delete({
            TableName: tableName,
            Key: {
                id: id
            }
        })
            .promise()
            .then(() => { });
    }

    async getAllItems(tableName: string): Promise<object[]> {
        const items = [];
        let hasPagination = false;
        let exclusiveStartKey = null;

        do {
            const scanResult: AWS.DynamoDB.DocumentClient.ScanOutput = await this.getItems(tableName, exclusiveStartKey || undefined);
            hasPagination = !!scanResult.LastEvaluatedKey;
            exclusiveStartKey = scanResult.LastEvaluatedKey;

            if (scanResult.Items) {
                items.push(...scanResult.Items);
            }
        } while (hasPagination);

        return items;
    }

    private getItems(tableName: string, exclusiveStartKey?: object) {
        return this.documentClient.scan({
            TableName: tableName,
            ExclusiveStartKey: exclusiveStartKey
        }).promise();
    }

}
