import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { APIResponse } from '../types/globals';
import { UserSignupInput } from '../types/user';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password }: UserSignupInput = JSON.parse(event.body || '');

        // Input validation
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' } as APIResponse),
            };
        }

        const params: DocumentClient.PutItemInput = {
            TableName: 'UserTable',
            Item: {
                id: uuidv4(),
                email,
                password,
            },
        };

        await dbClient.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User registered successfully',
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
