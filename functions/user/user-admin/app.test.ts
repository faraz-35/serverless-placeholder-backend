import { expect, describe, it } from '@jest/globals';

import { lambdaHandler } from './app';
import { createEvent } from '../../../jestUtils';

const getEvent = createEvent('GET', 'path');
const postEvent = createEvent('POST', 'path', undefined, {
    username: 'testUser',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    password: 'testPassword',
    imageUrl: 'https://example.com/image.jpg',
});
const putEvent = createEvent(
    'PUT',
    'path',
    { id: '123' },
    {
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        username: 'UpdatedUsername',
    },
);
const deleteEvent = createEvent('DELETE', 'path', { id: '123' });

describe('Unit test for user-admin', function () {
    it('verifies successful GET response', async () => {
        const result = await lambdaHandler(getEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
    });

    it('verifies successful POST response', async () => {
        const result = await lambdaHandler(postEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User created successfully');
    });

    it('verifies successful PUT response', async () => {
        const result = await lambdaHandler(putEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User updated successfully');
    });

    it('verifies successful DELETE response', async () => {
        const result = await lambdaHandler(deleteEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User deleted successfully');
    });
});
