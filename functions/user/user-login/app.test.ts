import { expect, describe, it } from '@jest/globals';

import { lambdaHandler } from './app';
import { createEvent } from '../../../jestUtils';

const postEvent = createEvent('POST', 'path', undefined, {
    email: 'test@example.com',
    password: 'testPassword',
});

describe('Unit test for user-login', function () {
    it('verifies successful login response', async () => {
        const result = await lambdaHandler(postEvent);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body || '')).toHaveProperty('message');
        expect(JSON.parse(result.body || '').message).toEqual('User logged in successfully');
    });
});
