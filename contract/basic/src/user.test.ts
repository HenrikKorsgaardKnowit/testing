import { expect, test } from 'vitest'
import {parseUser } from "./types/user";
import { ZodError } from 'zod';

test('Test user is null', () => {
    const user = null;
    expect(user).toBeNull()
})

test('Dummy User API accessible', async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data = await res.json()
    expect(data).toBeDefined()
})

test('Check User return type', async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data:object = await res.json();
    expect(() => parseUser(data)).toBeDefined();
})

test('Check user within allotted time',{timeout:200}, async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data:object = await res.json();
    expect(() => parseUser(data)).toBeDefined();
})

test('Check User return type - fail example', () => {
    const data:object = {id:"1"}
    expect(() => parseUser(data)).toThrowError(ZodError);
})
