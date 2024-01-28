import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { deleteUser, getUser, updateUser, changePassword } from './userManagment';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

const stage = process.env.ENV;

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const httpMethod = event.requestContext.http.method;
    const path = event.rawPath;
    switch (path) {
        case `/${stage}/user-management/changePassword`:
            return changePassword(event);
        case `/${stage}/user-management/updateUser`:
            return updateUser(event);
        case `/${stage}/user-management`:
            if (httpMethod === 'GET') {
                return getUser(event);
            } else if (httpMethod === 'DELETE') {
                return deleteUser(event);
            } else {
                return INVALID_ENDPOINT;
            }
        default:
            return INVALID_ENDPOINT;
    }
};
