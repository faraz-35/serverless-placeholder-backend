import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const isLocal = process.env.ENV === 'LOCAL';
const DDBTable = process.env.TABLE_NAME;

const dbClient = new DocumentClient({
    endpoint: isLocal ? 'http://localhost:8000' : undefined,
    region: isLocal ? 'ca-central-1' : undefined,
});

// Put Item
export const putItem = (
    item: DocumentClient.PutItemInputAttributeMap,
    tableName: string = DDBTable!,
): Promise<DocumentClient.PutItemOutput> => {
    const params: DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            ...item,
        },
    };
    return dbClient.put(params).promise();
};

// Get Item
export const getItem = (
    key: DocumentClient.Key,
    attributes?: string[],
    tableName: string = DDBTable!,
): Promise<DocumentClient.GetItemOutput> => {
    const params: DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: key,
        ProjectionExpression: attributes ? attributes.join(', ') : undefined,
    };
    return dbClient.get(params).promise();
};

// Scan
export const scan = (
    limit?: string,
    exclusiveStartKey?: string,
    attributes?: string,
    tableName: string = DDBTable!,
): Promise<DocumentClient.ScanOutput> => {
    const params: DocumentClient.ScanInput = {
        TableName: tableName,
        Limit: limit ? parseInt(limit) : undefined,
    };
    if (exclusiveStartKey) {
        params.ExclusiveStartKey = { id: exclusiveStartKey };
    }
    if (attributes?.length || 0 > 0) {
        params.ProjectionExpression = attributes?.split(',').join(', ');
    }
    return dbClient.scan(params).promise();
};

// Query
export const queryItem = (
    queryObject: Record<string, any>,
    tableName: string = DDBTable!,
): Promise<DocumentClient.QueryOutput> => {
    const queryParameter = Object.keys(queryObject)[0];
    const queryValue = queryObject[queryParameter];

    const params: DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: queryParameter,
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
    key: DocumentClient.Key,
    object: DocumentClient.ExpressionAttributeValueMap,
    tableName: string = DDBTable!,
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
    key: DocumentClient.Key,
    arrayName: string,
    value: any,
    tableName: string = DDBTable!,
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
    key: DocumentClient.Key,
    arrayName: string,
    value: any,
    tableName: string = DDBTable!,
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
export const deleteItem = (
    key: DocumentClient.Key,
    tableName: string = DDBTable!,
): Promise<DocumentClient.DeleteItemOutput> => {
    const params: DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: key,
    };
    return dbClient.delete(params).promise();
};
