import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';
import { errorResponse, missingFieldsResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';
import { appendToArray, getItem, removeFromArray } from '/opt/nodejs/dynamodb';
import { IManageObject } from '../../../types/user';

export const getObjectsByUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id || '';

        const validation = validateInput({ id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const result = await getItem({ id }, ['objects']);

        return successResponse(undefined, result.Item || []);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const addObjectToUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id || '';
        const { objectId }: IManageObject = JSON.parse(event.body || '');

        const validation = validateInput({ id, objectId });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const result = await appendToArray({ id }, 'objects', objectId);

        return successResponse('Object added to user successfully', result.Attributes?.objects || []);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const removeObjectFromUser = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id || '';
        const { objectId }: IManageObject = JSON.parse(event.body || '');

        const validation = validateInput({ id, objectId });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const result = await removeFromArray({ id }, 'objects', objectId);

        return successResponse('Object removed from user successfully', result.Attributes?.objects || []);
    } catch (error: any) {
        return errorResponse(error);
    }
};
