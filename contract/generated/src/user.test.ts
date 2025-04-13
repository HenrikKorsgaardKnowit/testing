import { expect, test, beforeAll } from 'vitest'
import {zUser, getApiV1Users, getApiV1UsersById} from "./client.gen";
import { ZodError } from 'zod';

import { client } from './client.gen';

beforeAll(async () => {
    client.setConfig({
        baseUrl: 'https://fakerestapi.azurewebsites.net',
    });
})

test('Test user is null', () => {
    const user = null;
    expect(user).toBeNull()
})

test('Dummy User API accessible', async () => {
    const { data, error } = await getApiV1Users({});

    expect(error).toBeUndefined()
    expect(data).toBeDefined();
})

test('Check User return type', async () => {
    const { data, error } = await getApiV1UsersById({
        path: {
            id:1
        }
    });

    expect(error).toBeUndefined()
    expect(data).toBeDefined();
    expect(() => zUser.parse(data)).toBeDefined();
})

test('Check user within allotted time',{timeout:200}, async () => {
    const { data, error } = await getApiV1UsersById({
        path: {
            id:1
        }
    });

    expect(error).toBeUndefined()
    expect(data).toBeDefined();
    expect(() => zUser.parse(data)).toBeDefined();
})

test('Check User return type - fail example', () => {
    const data:object = {id:"1"}
    expect(() => zUser.parse(data)).toThrowError(ZodError);
})
