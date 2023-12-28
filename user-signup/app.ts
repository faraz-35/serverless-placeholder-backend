import { APIGatewayProxyEvent } from 'aws-lambda';
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

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIResponse> => {
    let response: APIResponse;
    try {
        const { email, password }: UserSignupInput = JSON.parse(event.body || '');

        // Input validation
        if (!email || !password) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
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
        response = {
            statusCode: 200,
            body: {
                message: 'User registered successfully',
            },
        };
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
