import { expect, describe, it } from '@jest/globals';

import { lambdaHandler } from './app';
import { createEvent } from '../../../jestUtils';

const getEvent = createEvent('GET', 'path');
const postEvent = createEvent('POST', 'path', undefined, { name: 'newName' });
const putEvent = createEvent('PUT', 'path', { id: 'bad09d96-b7bb-4fbc-939b-530cd7579182' }, { name: 'newName' });
const deleteEvent = createEvent('DELETE', 'path', { id: '123' });

describe('Unit test for object-admin', function () {
    it('verifies successful GET response', async () => {
        const result = await lambdaHandler(getEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
    });

    it('verifies successful POST response', async () => {
        const result = await lambdaHandler(postEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
    });

    it('verifies successful PUT response', async () => {
        const result = await lambdaHandler(putEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('Object updated successfully');
    });

    it('verifies successful DELETE response', async () => {
        const result = await lambdaHandler(deleteEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('Object deleted successfully');
    });
});
