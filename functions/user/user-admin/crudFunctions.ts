import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { ICreateUser, IUpdateUser, User } from '../../../types/user';
import { deleteItem, getItem, putItem, scan, updateItem } from '/opt/nodejs/dynamodb';
import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';
import { errorResponse, missingFieldsResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';

export const createUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { username, firstName, lastName, email, password, imageUrl }: ICreateUser = JSON.parse(event.body || '');

        const validation = validateInput({ username, firstName, email, password });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            imageUrl,
        };
        await putItem(user);

        delete (user as any).password;
        return successResponse('User created successfully', user);
    } catch (error: any) {
        return errorResponse(error);
    }
};
export const getUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { id, limit, exclusiveStartKey, attributes } = event.queryStringParameters || {};
        if (id) {
            const result = await getItem({ id });
            const item = result.Item;

            item && delete (item as any).password;
            return successResponse(undefined, item);
        } else {
            const result = await scan(limit, exclusiveStartKey, attributes);
            const items = result.Items;
            const lastEvaluatedKey = result.LastEvaluatedKey;
            return successResponse(undefined, { items: items as User[], lastEvaluatedKey });
        }
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const updateUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id;
        const { firstName, lastName, username }: IUpdateUser = JSON.parse(event.body || '');

        const validation = validateInput({ firstName, lastName, username, id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const { Attributes } = await updateItem({ id }, { firstName, lastName, username });

        return successResponse('User updated successfully', Attributes);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const deleteUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id;

        const validation = validateInput({ id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        await deleteItem({ id });

        return successResponse('User deleted successfully', undefined);
    } catch (error) {
        return errorResponse(error);
    }
};
