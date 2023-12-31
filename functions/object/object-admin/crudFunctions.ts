import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { APIResponse } from '../../../types/globals';
import { CreateObjectInput, TObject, UpdateObjectInput } from '../../../types/object';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

export const createObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { name }: CreateObjectInput = JSON.parse(event.body || '');

        // Input validation
        if (!name) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields',
                } as APIResponse),
            };
        }

        const object: TObject = {
            id: uuidv4(),
            name,
        };
        const params: DocumentClient.PutItemInput = {
            TableName: 'ObjectTable',
            Item: {
                ...object,
            },
        };
        await dbClient.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Object created successfully',
                data: {
                    object,
                },
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
export const getObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const limit = event.queryStringParameters?.limit;
        const exclusiveStartKey = event.queryStringParameters?.exclusiveStartKey;
        if (id) {
            const params: DocumentClient.GetItemInput = {
                TableName: 'ObjectTable',
                Key: {
                    id,
                },
            };

            const result = await dbClient.get(params).promise();
            const item = result.Item;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: item as TObject,
                } as APIResponse),
            };
        } else {
            const params: DocumentClient.ScanInput = {
                TableName: 'ObjectTable',
                Limit: limit ? parseInt(limit) : undefined,
                ExclusiveStartKey: exclusiveStartKey ? JSON.parse(decodeURIComponent(exclusiveStartKey)) : undefined,
            };

            const result = await dbClient.scan(params).promise();
            const items = result.Items;
            const lastEvaluatedKey = result.LastEvaluatedKey;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: { items: items as TObject[], lastEvaluatedKey },
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

export const updateObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const { name }: UpdateObjectInput = JSON.parse(event.body || '');

        if (!name || !id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields',
                } as APIResponse),
            };
        }

        const params: DocumentClient.UpdateItemInput = {
            TableName: 'ObjectTable',
            Key: { id },
            UpdateExpression: 'set #name = :name',
            ExpressionAttributeNames: {
                '#name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': name,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        const { Attributes } = await dbClient.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: Attributes,
                message: 'Object updated successfully',
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

export const deleteObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;

        // Input validation
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields',
                } as APIResponse),
            };
        }

        const params: DocumentClient.DeleteItemInput = {
            TableName: 'ObjectTable',
            Key: { id },
        };

        await dbClient.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Object deleted successfully',
            } as APIResponse),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to delete object',
            } as APIResponse),
        };
    }
};
