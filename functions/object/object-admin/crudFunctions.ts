import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import { ICreateObject, ObjectType, IUpdateObject } from '../../../types/object';
// import { deleteItem, getItem, putItem, scan, updateItem } from '/opt/nodejs/dynamodb';
// import { missingFieldsResponse, errorResponse, successResponse } from '/opt/nodejs/dynamodb/apiResponses';
// import { validateInput } from '/opt/nodejs/dynamodb/inputValidation';

// export const createObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         const { name }: ICreateObject = JSON.parse(event.body || '');

//         const validation = validateInput({ name });
//         if (validation !== true) {
//             return missingFieldsResponse(validation);
//         }

//         const object: ObjectType = {
//             id: uuidv4(),
//             name,
//         };
//         await putItem('ObjectTable', object);
//         return successResponse('Object created successfully', object);
//     } catch (error: any) {
//         return errorResponse(error);
//     }
// };
export const getObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.queryStringParameters?.id;
        const limit = event.queryStringParameters?.limit;
        const exclusiveStartKey = event.queryStringParameters?.exclusiveStartKey;
        if (id) {
            // const result = await getItem('ObjectTable', { id });
            // const item = result.Item;

            // return successResponse(undefined, item);
            return {
                statusCode: 200,
                body: JSON.stringify('Bad Request' + uuidv4()),
            };
        } else {
            // const result = await scan('ObjectTable', limit, exclusiveStartKey);
            // const items = result.Items;
            // const lastEvaluatedKey = result.LastEvaluatedKey;

            // return successResponse(undefined, { items: items as ObjectType[], lastEvaluatedKey });
            return {
                statusCode: 200,
                body: JSON.stringify('Bad Request' + uuidv4()),
            };
        }
    } catch (error: any) {
        // return errorResponse(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Bad Request'),
        };
    }
};

// export const updateObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         const id = event.queryStringParameters?.id;
//         const { name }: IUpdateObject = JSON.parse(event.body || '');

//         const validation = validateInput({ name, id });
//         if (validation !== true) {
//             return missingFieldsResponse(validation);
//         }

//         const { Attributes } = await updateItem('ObjectTable', { id }, { name });

//         return successResponse('Object updated successfully', Attributes);
//     } catch (error: any) {
//         return errorResponse(error);
//     }
// };

// export const deleteObject = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         const id = event.queryStringParameters?.id;

//         const validation = validateInput({ id });
//         if (validation !== true) {
//             return missingFieldsResponse(validation);
//         }

//         await deleteItem('ObjectTable', { id });
//         return successResponse('Object deleted successfully', undefined);
//     } catch (error: any) {
//         return errorResponse(error);
//     }
// };
