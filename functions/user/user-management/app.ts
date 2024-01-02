import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { deleteUser, getUser, updateUser, changePassword } from './userManagment';
import { INVALID_ENDPOINT } from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { path, httpMethod } = event;
    switch (path) {
        case '/user-management/changePassword':
            return changePassword(event);
        case '/user-management/updateUser':
            return updateUser(event);
        case '/user-management':
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
