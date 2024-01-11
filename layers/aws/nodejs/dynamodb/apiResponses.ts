import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { APIResponse } from '../../../../types/globals';

export const missingFieldsResponse = (missingFields: string[]): APIGatewayProxyResultV2 => {
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: 'Missing required fields',
            data: missingFields,
        } as APIResponse),
    };
};

export const invalidFieldResponse = (field: string): APIGatewayProxyResultV2 => {
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: 'Invalid ' + field,
        } as APIResponse),
    };
};

export const successResponse = (message?: string, data?: unknown): APIGatewayProxyResultV2 => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            message: message,
            data: data,
        } as APIResponse),
    };
};

export const errorResponse = (error: any): APIGatewayProxyResultV2 => {
    console.info({ error });
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: error.message,
        } as APIResponse),
    };
};

export const INVALID_ENDPOINT: APIGatewayProxyResultV2 = {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    body: JSON.stringify({
        error: 'Invalid endpoint',
    } as APIResponse),
};
