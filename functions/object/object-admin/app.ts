import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { createObject, deleteObject, getObject, updateObject } from './crudFunctions';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    switch (event.requestContext.http.method) {
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
