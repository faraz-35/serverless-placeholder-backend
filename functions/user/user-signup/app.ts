import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IUserSignup } from '../../../types/user';
import { putItem } from '/opt/nodejs/dynamodb';
import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';
import { errorResponse, missingFieldsResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { email, password }: IUserSignup = JSON.parse(event.body || '');

        const validation = validateInput({ email, password });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        await putItem({ id, email, password: hashedPassword });
        return successResponse('User registered successfully', { id, email });
    } catch (error: any) {
        return errorResponse(error);
    }
};
