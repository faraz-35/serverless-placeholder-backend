import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs';

import { IUserLogin } from '../../../types/user';
import { queryItem } from '/opt/nodejs/dynamodb';
import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';
import {
    errorResponse,
    invalidFieldResponse,
    missingFieldsResponse,
    successResponse,
} from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password }: IUserLogin = JSON.parse(event.body || '');

        const validation = validateInput({ email, password });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const result = await queryItem('UserTable', { email });
        const user = result.Items ? result.Items[0] : null;

        if (!user) {
            return invalidFieldResponse('email');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return invalidFieldResponse('password');
        } else {
            delete user.password;
            return successResponse('User logged in successfully', user);
        }
    } catch (error: any) {
        return errorResponse(error);
    }
};
