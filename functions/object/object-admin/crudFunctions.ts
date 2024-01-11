import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import { ICreateObject, ObjectType, IUpdateObject } from '../../../types/object';
import { deleteItem, getItem, putItem, scan, updateItem } from '/opt/nodejs/dynamodb';
import { missingFieldsResponse, errorResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';
import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';

export const createObject = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { name }: ICreateObject = JSON.parse(event.body || '');

        const validation = validateInput({ name });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const object: ObjectType = {
            id: uuidv4(),
            name,
        };
        await putItem(object);
        return successResponse('Object created successfully', object);
    } catch (error: any) {
        return errorResponse(error);
    }
};
export const getObject = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const { id, limit, exclusiveStartKey } = event.queryStringParameters || {};
        if (id) {
            const result = await getItem({ id });
            const item = result.Item;

            return successResponse(undefined, item);
        } else {
            const result = await scan(limit, exclusiveStartKey);
            const items = result.Items;
            const lastEvaluatedKey = result.LastEvaluatedKey;

            return successResponse(undefined, { items: items as ObjectType[], lastEvaluatedKey });
        }
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const updateObject = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id;
        const { name }: IUpdateObject = JSON.parse(event.body || '');

        const validation = validateInput({ name, id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        const { Attributes } = await updateItem({ id }, { name });

        return successResponse('Object updated successfully', Attributes);
    } catch (error: any) {
        return errorResponse(error);
    }
};

export const deleteObject = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const id = event.queryStringParameters?.id;

        const validation = validateInput({ id });
        if (validation !== true) {
            return missingFieldsResponse(validation);
        }

        await deleteItem({ id });
        return successResponse('Object deleted successfully', undefined);
    } catch (error: any) {
        return errorResponse(error);
    }
};
