import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { IChangePassword, IUpdateUser } from '../../../types/user';
import { deleteItem, getItem, updateItem } from '/opt/nodejs/dynamodb';
import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';
import { errorResponse, missingFieldsResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id || '';

        const validation = validateInput({ id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const result = await getItem('UserTable', { id });
        const item = result.Item;
        return successResponse(undefined, item);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id || '';
        const { username, firstName, lastName, imageUrl }: IUpdateUser = JSON.parse(event.body || '');

        const validation = validateInput({ username, firstName, lastName, imageUrl, id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const { Attributes } = await updateItem('UserTable', { id }, { firstName, lastName, username, imageUrl });
        return successResponse('User details updated successfully', Attributes);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const changePassword = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const { oldPassword, newPassword }: IChangePassword = JSON.parse(event.body || '');

        const validation = validateInput({ oldPassword, newPassword, id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        await updateItem('UserTable', { id }, { password: newPassword });
        return successResponse('Password changed successfully');
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;

        const validation = validateInput({ id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        deleteItem('UserTable', { id });
        return successResponse('User deleted successfully');
    } catch (error: any) {
        return errorResponse(error);
    }
};
