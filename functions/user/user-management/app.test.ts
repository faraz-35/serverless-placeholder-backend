import { expect, describe, it } from '@jest/globals';

import { lambdaHandler } from './app';
import { createEvent } from '../../../jestUtils';

const getEvent = createEvent('GET', '/user-management', { id: '3188f62a-0f41-4a87-b54a-b361b5c7422a' });
const updateEvent = createEvent(
    'POST',
    '/user-management/updateUser',
    { id: '3188f62a-0f41-4a87-b54a-b361b5c7422a' },
    {
        username: 'testUsername',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        imageUrl: 'testImageUrl',
    },
);
const passwordEvent = createEvent(
    'POST',
    '/user-management/changePassword',
    { id: '3188f62a-0f41-4a87-b54a-b361b5c7422a' },
    {
        oldPassword: 'abc',
        newPassword: 'def',
    },
);
const deleteEvent = createEvent('DELETE', '/user-management', { id: '1f238feb-29e6-448b-9c70-d5af172480f6' });

describe('Unit test for user-management', function () {
    it('verifies successful Get User response', async () => {
        const result = await lambdaHandler(getEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('data');
    });
    it('verifies successful Update User response', async () => {
        const result = await lambdaHandler(updateEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User details updated successfully');
    });
    it('verifies successful Password Change response', async () => {
        const result = await lambdaHandler(passwordEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('Password changed successfully');
    });
    it('verifies successful delete User response', async () => {
        const result = await lambdaHandler(deleteEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User deleted successfully');
    });
});
