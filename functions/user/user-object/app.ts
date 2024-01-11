import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { addObjectToUser, getObjectsByUser, removeObjectFromUser } from './objectManagement';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const path = event.rawPath;
    switch (path) {
        case '/user-object':
            return getObjectsByUser(event);
        case '/user-object/addObject':
            return addObjectToUser(event);
        case '/user-object/removeObject':
            return removeObjectFromUser(event);
        default:
            return INVALID_ENDPOINT;
    }
};
