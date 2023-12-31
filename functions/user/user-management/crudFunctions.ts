import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { APIResponse } from '../../../types/globals';
import { UpdateUserInput } from '../../../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id || '';

        // Input validation
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.GetItemInput = {
            TableName: 'UserTable',
            Key: { id },
        };

        const result = await dbClient.get(params).promise();
        const item = result.Item;

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: item,
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

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id || '';
        const { username, firstName, lastName, imageUrl }: UpdateUserInput = JSON.parse(event.body || '');

        // Input validation
        if (!id || !username || !firstName || !lastName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.UpdateItemInput = {
            TableName: 'UserTable',
            Key: { id },
            UpdateExpression: 'SET firstName = :fn, lastName = :ln, username = :un, imageUrl = :url',
            ExpressionAttributeValues: {
                ':fn': firstName,
                ':ln': lastName,
                ':un': username,
                ':url': imageUrl,
            },
        };

        await dbClient.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User details updated successfully',
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

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;

        // Input validation
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.DeleteItemInput = {
            TableName: 'UserTable',
            Key: { id },
        };

        await dbClient.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: 'Account deleted successfully',
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
