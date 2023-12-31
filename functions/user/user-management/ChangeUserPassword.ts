import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { APIResponse } from '../../../types/globals';
import { ChangeUserPasswordInput } from '../../../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});
export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const { oldPassword, newPassword }: ChangeUserPasswordInput = JSON.parse(event.body || '');

        // Input validation
        if (!id || !oldPassword || !newPassword) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
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
            body: JSON.stringify({
                data: 'Password changed successfully',
            } as APIResponse),
        };
    } catch (error: any) {
        console.info({ error });
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            } as APIResponse),
        };
    }
};
