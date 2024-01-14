import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const createEvent = (
    method: string,
    path: string,
    queryStringParameters?: { [key: string]: string },
    body?: { [key: string]: string },
): APIGatewayProxyEventV2 => {
    return {
        rawPath: path,
        requestContext: {
            http: {
                method: method,
                path: path,
            },
        },
        queryStringParameters: queryStringParameters || {},
        body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEventV2;
};
