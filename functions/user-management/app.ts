import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { changePassword } from './ChangeUserPassword';
import { deleteUser, getUser, updateUser } from './crudFunctions';
import { APIResponse } from '../../types/globals';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { path, httpMethod } = event;
    switch (httpMethod) {
        case 'GET':
            return getUser(event);
        case 'PUT':
            if (path === '/user-management/updateUser') {
                return updateUser(event);
            } else if (path === '/user-management/changePassword') {
                return changePassword(event);
            }
        case 'DELETE':
            return deleteUser(event);
        default:
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Invalid endpoint',
                } as APIResponse),
            };
    }
};
