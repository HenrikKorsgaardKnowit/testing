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

test<TestContext>('Enter (key,1,2,4,3,5,6) gives "CLOSED ".', ({safe}) => {
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

test<TestContext>('Unlocked safe: Enter (KEY,1,2,LOCK) gives empty display. Safe locked', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.LOCK)
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})

//what happens if we enter 

test<TestContext>('Reset safe: Enter (KEY,1,2,3,4,5,6) gives "OPEN  ". Safe unlocked. Enter (1) gives "Error ". Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)
    safe.enter(Button.D4)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('OPEN  ');
    expect(safe.isLocked()).toBe(false);
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Reset safe: Enter (KEY,1,2,4,3,5,6) gives "CLOSED". Safe locked. Enter (1) gives "Error ". Safed locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D4)
    safe.enter(Button.D3)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('CLOSED');
    expect(safe.isLocked()).toBe(true);
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Lock safe and forget KEY: Enter (KEY,1,2,LOCK,1) gives "ERROR". Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.LOCK)
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
})

test<TestContext>('Open then lock: Enter (KEY,1,2,3,4,5,6) gives "OPEN  ". Safe unlocked. Enter (LOCK). Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)
    safe.enter(Button.D4)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('OPEN  ');
    expect(safe.isLocked()).toBe(false);
    safe.enter(Button.LOCK)
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})


test<TestContext>('Open then press KEY: Enter (KEY,1,2,3,4,5,6) gives "OPEN  ". Safe unlocked. Enter (KEY). Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)
    safe.enter(Button.D4)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('OPEN  ');
    expect(safe.isLocked()).toBe(false);
    safe.enter(Button.KEY)
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})



