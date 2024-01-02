import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { addObjectToUser, getObjectsByUser, removeObjectFromUser } from './objectManagement';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { path } = event;
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
