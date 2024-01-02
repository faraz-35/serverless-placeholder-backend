import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dbClient = new DocumentClient({
    endpoint: 'http://host.docker.internal:8000',
});

// Put Item
export const putItem = (
    table: string,
    item: DocumentClient.PutItemInputAttributeMap,
): Promise<DocumentClient.PutItemOutput> => {
    const params: DocumentClient.PutItemInput = {
        TableName: table,
        Item: {
            ...item,
        },
    };
    return dbClient.put(params).promise();
};

// Get Item
export const getItem = (
    table: string,
    key: DocumentClient.Key,
    attributes?: string[],
): Promise<DocumentClient.GetItemOutput> => {
    const params: DocumentClient.GetItemInput = {
        TableName: table,
        Key: key,
        ProjectionExpression: attributes ? attributes.join(', ') : undefined,
    };
    return dbClient.get(params).promise();
};

// Scan
export const scan = (table: string, limit?: string, exclusiveStartKey?: string): Promise<DocumentClient.ScanOutput> => {
    const params: DocumentClient.ScanInput = {
        TableName: table,
        Limit: limit ? parseInt(limit) : undefined,
        ExclusiveStartKey: exclusiveStartKey ? JSON.parse(decodeURIComponent(exclusiveStartKey)) : undefined,
    };
    return dbClient.scan(params).promise();
};

// Query
export const queryItem = (tableName: string, queryObject: Record<string, any>): Promise<DocumentClient.QueryOutput> => {
    const queryParameter = Object.keys(queryObject)[0];
    const queryValue = queryObject[queryParameter];

    const params: DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: `#${queryParameter} = :queryValue`,
        ExpressionAttributeNames: {
            [`#${queryParameter}`]: queryParameter,
        },
        ExpressionAttributeValues: {
            ':queryValue': queryValue,
        },
    };

    return dbClient.query(params).promise();
};

// Update Item
export const updateItem = (
    tableName: string,
    key: DocumentClient.Key,
    object: DocumentClient.ExpressionAttributeValueMap,
): Promise<DocumentClient.UpdateItemOutput> => {
    let updateExpression = 'set ';
    const expressionAttributeNames: Record<string, any> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(object).forEach((key, i) => {
        updateExpression += `#${key} = :${key}`;
        if (i !== Object.keys(object).length - 1) updateExpression += ', ';
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = object[key];
    });

    const params: DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
    };
    return dbClient.update(params).promise();
};

//Update append item to array
export const appendToArray = (
    tableName: string,
    key: DocumentClient.Key,
    arrayName: string,
    value: any,
): Promise<DocumentClient.UpdateItemOutput> => {
    const params: DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET #${arrayName} = list_append(if_not_exists(#${arrayName}, :empty_list), :new_value)`,
        ExpressionAttributeNames: {
            [`#${arrayName}`]: arrayName,
        },
        ExpressionAttributeValues: {
            ':new_value': [value],
            ':empty_list': [],
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return dbClient.update(params).promise();
};

//Update remove item form  array
export const removeFromArray = async (
    tableName: string,
    key: DocumentClient.Key,
    arrayName: string,
    value: any,
): Promise<DocumentClient.UpdateItemOutput> => {
    // Get the current item
    const currentItem = await dbClient.get({ TableName: tableName, Key: key }).promise();

    // Remove the value from the array
    const array = currentItem?.Item?.[arrayName];
    const index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }

    // Update the item in DynamoDB
    const params: DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET #${arrayName} = :new_array`,
        ExpressionAttributeNames: {
            [`#${arrayName}`]: arrayName,
        },
        ExpressionAttributeValues: {
            ':new_array': array,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return dbClient.update(params).promise();
};

// Delete Item
export const deleteItem = (table: string, key: DocumentClient.Key): Promise<DocumentClient.DeleteItemOutput> => {
    const params: DocumentClient.DeleteItemInput = {
        TableName: table,
        Key: key,
    };
    return dbClient.delete(params).promise();
};
