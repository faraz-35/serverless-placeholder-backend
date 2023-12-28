import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { APIResponse } from '../types/globals';
import { UserLoginInput } from '../types/user';

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
        const { email, password }: UserLoginInput = JSON.parse(event.body || '');

        // Input validation
        if (!email || !password) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' },
            };
        }

        const params: DocumentClient.QueryInput = {
            TableName: 'UserTable',
            IndexName: 'email',
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

        if (!user || user.password !== password) {
            response = {
                statusCode: 401,
                body: {
                    error: 'Invalid email or password',
                },
            };
        } else {
            response = {
                statusCode: 200,
                body: {
                    message: 'User logged in successfully',
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
