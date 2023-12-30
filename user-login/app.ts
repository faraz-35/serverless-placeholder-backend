import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcryptjs';

import { UserLoginInput } from '../types/user';
import { APIResponse } from '../types/globals';

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
        const { email, password }: UserLoginInput = JSON.parse(event.body || '');

        // Input validation
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields',
                } as APIResponse),
            };
        }

        const params: DocumentClient.QueryInput = {
            TableName: 'UserTable',
            IndexName: 'EmailIndex',
            KeyConditionExpression: '#email = :email',
            ExpressionAttributeNames: {
                '#email': 'email',
            },
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const result = await dbClient.query(params).promise();
        const user = result.Items ? result.Items[0] : null;

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    error: 'Invalid email',
                } as APIResponse),
            };
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    error: 'Invalid password',
                } as APIResponse),
            };
        } else {
            delete user.password;
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'User logged in successfully',
                    data: {
                        user,
                    },
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
