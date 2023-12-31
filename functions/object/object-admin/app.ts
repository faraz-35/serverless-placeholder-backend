import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createObject, deleteObject, getObject, updateObject } from './crudFunctions';
import { APIResponse } from '../../../types/globals';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    switch (event.httpMethod) {
        case 'POST':
            return createObject(event);
        case 'GET':
            return getObject(event);
        case 'PUT':
            return updateObject(event);
        case 'DELETE':
            return deleteObject(event);
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid HTTP method',
                } as APIResponse),
            };
    }
};
