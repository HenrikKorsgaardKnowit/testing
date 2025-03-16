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

test<TestContext>('Enter (KEY,1,2,3) gives "123   " as output. Safe is locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)

    expect(safe.readDisplay()).toBe('123   ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Enter (KEY,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". Safe is locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('1     ');
    safe.enter(Button.D7)
    expect(safe.readDisplay()).toBe('17    ');
    safe.enter(Button.D9)
    expect(safe.readDisplay()).toBe('179   ');
    
    expect(safe.isLocked()).toBe(true);
})  

test<TestContext>('Enter (KEY, 1, KEY, 3) gives “3     ”. Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.KEY)
    safe.enter(Button.D3)
    expect(safe.readDisplay()).toBe('3     ');
})

test<TestContext>('Enter (1) gives “ERROR ”. Safe locked.', ({safe}) => {
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
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

test<TestContext>('Enter (KEY,1,2,4,3,5,6) gives "     ".', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D4)
    safe.enter(Button.D3)
    safe.enter(Button.D5)
    safe.enter(Button.D6)

    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Unlock safe: Enter (KEY,1,2,3,4,5,6) gives "OPEN ". Safe unlocked. Enter (LOCK) gives "CLOSED". Safe locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D3)
    safe.enter(Button.D4)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('OPEN  ');
    expect(safe.isLocked()).toBe(false);
    safe.enter(Button.LOCK);
    expect(safe.readDisplay()).toBe('CLOSED');
    expect(safe.isLocked()).toBe(true);
})


// Additional tests identified when writing the implementation
test<TestContext>('Reset safe: Enter (KEY,1,2,4,3,5,6) gives "      ". Safe locked. Enter (1) gives "Error ". Safed locked.', ({safe}) => {
    safe.enter(Button.KEY)
    safe.enter(Button.D1)
    safe.enter(Button.D2)
    safe.enter(Button.D4)
    safe.enter(Button.D3)
    safe.enter(Button.D5)
    safe.enter(Button.D6)
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
    expect(safe.isLocked()).toBe(true);
})

test<TestContext>('Lock safe and forget KEY: Enter (LOCK,1) gives "ERROR". Safe locked.', ({safe}) => {
    safe.enter(Button.LOCK)
    expect(safe.readDisplay()).toBe('CLOSED');
    expect(safe.isLocked()).toBe(true);
    safe.enter(Button.D1)
    expect(safe.readDisplay()).toBe('ERROR ');
})

// behaviour test
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

// Check all digits
test.for([
    [Button.D0, Button.D1, Button.D2,"012   "],
    [Button.D3, Button.D4, Button.D5,"345   "],
    [Button.D6, Button.D7, Button.D8,"678   "],
    [Button.D9, Button.D9, Button.D9,"999   "],
  ])('Enter (KEY, %i, %i, %i) gives %i', ([ a, b, c, expected ], {safe}) => {
    safe.enter(Button.KEY)
    safe.enter(a)
    safe.enter(b)
    safe.enter(c)
    expect(safe.readDisplay()).toBe(expected)
}) 




