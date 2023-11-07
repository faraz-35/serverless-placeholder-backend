import { expect, describe, it } from '@jest/globals';

import { lambdaHandler } from './app';
import { createEvent } from '../../../jestUtils';

const getEvent = createEvent(
    'GET',
    '/user-object',
    { id: '1f238feb-29e6-448b-9c70-d5af172480f6' },
    {
        objectId: 'bad09d96-b7bb-4fbc-939b-530cd7579182',
    },
);
const addEvent = createEvent(
    'POST',
    '/user-object/addObject',
    { id: '1f238feb-29e6-448b-9c70-d5af172480f6' },
    {
        objectId: 'bad09d96-b7bb-4fbc-939b-530cd7579182',
    },
);
const removeEvent = createEvent(
    'POST',
    '/user-object/removeObject',
    { id: '1f238feb-29e6-448b-9c70-d5af172480f6' },
    {
        objectId: 'bad09d96-b7bb-4fbc-939b-530cd7579182',
    },
);

describe('Unit test for user-object', function () {
    it('verifies successful Get Object response', async () => {
        const result = await lambdaHandler(getEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
    });
    it('verifies successful Add Object response', async () => {
        const result = await lambdaHandler(addEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('Object added to user successfully');
    });
    it('verifies successful Remove Object response', async () => {
        const result = await lambdaHandler(removeEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('Object removed from user successfully');
    });
});
