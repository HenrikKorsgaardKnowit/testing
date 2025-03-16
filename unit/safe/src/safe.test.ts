import {expect, test} from 'vitest'
import { SafeImpl, Button } from './safe.ts'


test('Display reads 6 spaces and Safe is locked', () => {
    var safe = new SafeImpl()
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})
