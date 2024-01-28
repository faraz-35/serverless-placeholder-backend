import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { addObjectToUser, getObjectsByUser, removeObjectFromUser } from './objectManagement';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

const stage = process.env.ENV;

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const path = event.rawPath;
    switch (path) {
        case `/${stage}/user-object`:
            return getObjectsByUser(event);
        case `/${stage}/user-object/addObject`:
            return addObjectToUser(event);
        case `/${stage}/user-object/removeObject`:
            return removeObjectFromUser(event);
        default:
            return INVALID_ENDPOINT;
    }
};
