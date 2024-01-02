import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createUser, deleteUser, getUser, updateUser } from './crudFunctions';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

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
            return INVALID_ENDPOINT;
    }
};
