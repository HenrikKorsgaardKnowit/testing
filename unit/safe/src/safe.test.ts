/**
 * Implementation and test-cases to be written
 * - Display reads 6 spaces and Safe is locked
 * - Enter (key,1,2,3) gives “123 ” as output. Safe is locked.
 * - Enter (key,1,2,3,4,5,6) gives “OPEN ”, safe unlocked.
 * - Enter (1,2) gives “ERROR ”. Safe locked.
 * - Enter (key,1,2,4,3,5,6) gives “CLOSED”. Safe locked. 
 * - Unlocked safe: Enter (lock) gives empty display. Safe locked
 */

import {expect, test, beforeEach} from 'vitest'
import { SafeImpl, Button } from './safe.ts'

interface TestContext {
    safe: SafeImpl
}

beforeEach<TestContext>(async (ctx) => {
    // Clear mocks and add some testing data after before each test run
    ctx.safe = new SafeImpl();
})

test<TestContext>('Display reads 6 spaces and Safe is locked', ({safe}) => {
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Enter (key,1,2,3) gives "123   " as output. Safe is locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)

    expect(safe.readDisplay()).toBe('123   ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Enter (1) gives “ERROR ”. Safe locked.', ({safe}) => {
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
})

test<TestContext>('Enter (key, 1, key, 3) gives “3     ”. Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.KEY)
    safe.enter(Button.D3)
    expect(safe.readDisplay()).toBe('3     ');
})

/*
test<TestContext>('Enter (key,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". Safe is locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('1     ');
    safe.enter(Button.D7)
    expect(safe.readDisplay()).toBe('17    ');
    safe.enter(Button.D9)
    expect(safe.readDisplay()).toBe('179   ');
    
    expect(safe.isLocked()).toBe(true);
})


test<TestContext>('Enter (key,1,2,3,4,5,6) gives "OPEN ".', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)
    safe.enter(Button.D4)
    safe.enter(Button.D5)
    safe.enter(Button.D6)

    expect(safe.readDisplay()).toBe('OPEN  ');
    expect(safe.isLocked()).toBe(false);
})

test<TestContext>('Enter (key,1,2,4,3,5,6) gives "OPEN ".', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D4)
    safe.enter(Button.D3)
    safe.enter(Button.D5)
    safe.enter(Button.D6)

    expect(safe.readDisplay()).toBe('CLOSED');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Enter codes with digits 0, 8 and 9.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D9)
    safe.enter(Button.D0)
    safe.enter(Button.D8)

    expect(safe.readDisplay()).toBe('908   ');
})



test<TestContext>('Enter (key, 1, key, 3) gives “3     ”. Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('3     ');
})*/


