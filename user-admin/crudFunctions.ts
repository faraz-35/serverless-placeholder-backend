import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { APIResponse } from '../types/globals';
import { CreateUserInput, User } from '../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { username, firstName, lastName, email, password, imageUrl }: CreateUserInput = JSON.parse(
            event.body || '',
        );

        // Input validation

        if (!username || !firstName || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.PutItemInput = {
            TableName: 'UserTable',
            Item: {
                id: uuidv4(),
                username,
                email,
                password,
                firstName,
                lastName,
                imageUrl,
            },
        };
        await dbClient.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully' } as APIResponse),
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
export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const limit = event.queryStringParameters?.limit;
        const exclusiveStartKey = event.queryStringParameters?.exclusiveStartKey;
        if (id) {
            const params: DocumentClient.GetItemInput = {
                TableName: 'UserTable',
                Key: {
                    id,
                },
            };

            const result = await dbClient.get(params).promise();
            const item = result.Item;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: item as User,
                } as APIResponse),
            };
        } else {
            const params: DocumentClient.ScanInput = {
                TableName: 'UserTable',
                Limit: limit ? parseInt(limit) : undefined,
                ExclusiveStartKey: exclusiveStartKey ? JSON.parse(decodeURIComponent(exclusiveStartKey)) : undefined,
            };

            const result = await dbClient.scan(params).promise();
            const items = result.Items;
            const lastEvaluatedKey = result.LastEvaluatedKey;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: { items: items as User[], lastEvaluatedKey },
                } as APIResponse),
            };
        }
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
        const id = event.queryStringParameters?.id;
        const { firstName, lastName, username } = JSON.parse(event.body || '');

        // Input validation
        if (!username || !firstName || !lastName || !id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.UpdateItemInput = {
            TableName: 'UserTable',
            Key: { id },
            UpdateExpression: 'set #firstName = :firstName, #lastName = :lastName, #username = :username',
            ExpressionAttributeNames: { '#firstName': 'firstName', '#lastName': 'lastName', '#username': 'username' },
            ExpressionAttributeValues: { ':firstName': firstName, ':lastName': lastName, ':username': username },
            ReturnValues: 'UPDATED_NEW',
        };

        const { Attributes } = await dbClient.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: Attributes,
                message: 'User updated successfully',
            } as APIResponse),
        };
    } catch (error: any) {
        console.info({ error });
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: JSON.stringify(error.message),
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
                message: 'User deleted successfully',
            } as APIResponse),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to delete user',
            } as APIResponse),
        };
    }
};
