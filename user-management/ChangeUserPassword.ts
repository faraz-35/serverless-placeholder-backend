import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { APIResponse } from '../types/globals';
import { ChangeUserPasswordInput } from '../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});
export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const id = event.queryStringParameters?.id;
        const { oldPassword, newPassword }: ChangeUserPasswordInput = JSON.parse(event.body || '');

        // Input validation
        if (!id || !oldPassword || !newPassword) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
            };
        }

        const params: DocumentClient.UpdateItemInput = {
            TableName: 'UserTable',
            Key: { id },
            UpdateExpression: 'SET password = :ps',
            ExpressionAttributeValues: {
                ':ps': newPassword,
            },
        };

        await dbClient.update(params).promise();
        return {
            statusCode: 200,
            body: {
                data: 'Password changed successfully',
            },
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: {
                error: error.message,
            },
        };
    }
};
