import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { APIResponse } from '../types/globals';
import { CreateUserInput, User } from '../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const { username, firstName, lastName, email, password, imageUrl }: CreateUserInput = JSON.parse(
            event.body || '',
        );

        // Input validation

        if (!username || !firstName || !email || !password) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
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
            body: { message: 'User created successfully' },
        };
    } catch (error: any) {
        console.info({ error });
        return {
            statusCode: 500,
            body: {
                error: error.message,
            },
        };
    }
};
export const getUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    let response: APIResponse;
    try {
        const id = event.queryStringParameters?.id;
        if (id) {
            const params: DocumentClient.GetItemInput = {
                TableName: 'UserTable',
                Key: {
                    id,
                },
            };

            const result = await dbClient.get(params).promise();
            const item = result.Item;

            response = {
                statusCode: 200,
                body: {
                    data: JSON.stringify(item as User),
                },
            };
        } else {
            const params: DocumentClient.ScanInput = {
                TableName: 'UserTable',
            };

            const result = await dbClient.scan(params).promise();
            const items = result.Items;

            response = {
                statusCode: 200,
                body: {
                    data: JSON.stringify(items as User[]),
                },
            };
        }
    } catch (error: any) {
        response = {
            statusCode: 500,
            body: {
                error: error.message,
            },
        };
    }
    return response;
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    try {
        const id = event.queryStringParameters?.id;
        const { firstName, lastName, username } = JSON.parse(event.body || '');

        // Input validation
        if (!username || !firstName || !lastName || !id) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
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
            body: {
                data: JSON.stringify(Attributes),
                message: JSON.stringify('User updated successfully'),
            },
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: {
                error: JSON.stringify(error.message),
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
                message: 'User deleted successfully',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: {
                error: 'Failed to delete user',
            },
        };
    }
};
