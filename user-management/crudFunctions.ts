import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { APIResponse } from '../types/globals';
import { UpdateUserInput } from '../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const id = event.queryStringParameters?.id || '';

        // Input validation
        if (!id) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
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
            body: {
                data: JSON.stringify(item),
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

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const id = event.queryStringParameters?.id || '';
        const { username, firstName, lastName, imageUrl }: UpdateUserInput = JSON.parse(event.body || '');

        // Input validation
        if (!id || !username || !firstName || !lastName) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
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
            body: {
                data: 'User details updated successfully',
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

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const id = event.queryStringParameters?.id;

        // Input validation
        if (!id) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
            };
        }

        const params: DocumentClient.DeleteItemInput = {
            TableName: 'UserTable',
            Key: { id },
        };

        await dbClient.delete(params).promise();

        return {
            statusCode: 200,
            body: {
                data: 'Account deleted successfully',
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
