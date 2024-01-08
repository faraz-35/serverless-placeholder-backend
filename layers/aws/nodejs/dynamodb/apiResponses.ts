import { APIGatewayProxyResult } from 'aws-lambda';
import { APIResponse } from '../../../../types/globals';

export const missingFieldsResponse = (missingFields: string[]): APIGatewayProxyResult => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            error: 'Missing required fields',
            data: missingFields,
        } as APIResponse),
    };
};

export const invalidFieldResponse = (field: string): APIGatewayProxyResult => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            error: 'Invalid ' + field,
        } as APIResponse),
    };
};

export const successResponse = (message?: string, data?: unknown): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: message,
            data: data,
        } as APIResponse),
    };
};

export const errorResponse = (error: any): APIGatewayProxyResult => {
    console.info({ error });
    return {
        statusCode: 500,
        body: JSON.stringify({
            error: error.message,
        } as APIResponse),
    };
};

export const INVALID_ENDPOINT: APIGatewayProxyResult = {
    statusCode: 404,
    body: JSON.stringify({
        error: 'Invalid endpoint',
    } as APIResponse),
};
