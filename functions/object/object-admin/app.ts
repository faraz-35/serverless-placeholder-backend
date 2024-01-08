import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createObject, deleteObject, getObject, updateObject } from './crudFunctions';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

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
            return INVALID_ENDPOINT;
    }
};
