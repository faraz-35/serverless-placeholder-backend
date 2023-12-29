import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createUser, deleteUser, getUser, updateUser } from './crudFunctions';
import { APIResponse } from '../types/globals';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    switch (event.httpMethod) {
        case 'POST':
            return createUser(event);
        case 'GET':
            return getUser(event);
        case 'PUT':
            return updateUser(event);
        case 'DELETE':
            return deleteUser(event);
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid HTTP method',
                } as APIResponse),
            };
    }
};
