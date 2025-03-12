import {describe, expect, test} from 'vitest'
import { Calculator, CalculatorRefactor, CalculatorUUT, Operator } from './calculator.ts'

describe('Testing simple Calculator implementation', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.calculate(2, 2, Operator.ADDITION)
        expect(result).toBe(4);
    })

    test('Subtract 2 from 4 gives 2', () => {
        let calc = new Calculator()
        let result = calc.calculate(4, 2, Operator.SUBTRACTION)
        expect(result).toBe(2);
    })

    test('Multiply 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.calculate(2, 2, Operator.MULTIPLICATON)
        expect(result).toBe(4);
    })

    test('Divide 2 by 2 gives 1', () => {
        let calc = new Calculator()
        let result = calc.calculate(2, 2, Operator.DIVISION)
        expect(result).toBe(1);
    })
})


describe('Testing refactored Calculator implementation', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new CalculatorRefactor()
        let result = calc.calculate([2,Operator.ADDITION, 2])
        expect(result).toBe(4);
    })

    test('Subtract 2 from 4 gives 2', () => {
        let calc = new CalculatorRefactor()
        let result = calc.calculate([4, Operator.SUBTRACTION, 2])
        expect(result).toBe(2);
    })

    test('Multiply 2 and 2 gives 4', () => {
        let calc = new CalculatorRefactor()
        let result = calc.calculate([2, Operator.MULTIPLICATON,2])
        expect(result).toBe(4);
    })

    test('Divide 2 by 2 gives 1', () => {
        let calc = new CalculatorRefactor()
        let result = calc.calculate([2,Operator.DIVISION,2])
        expect(result).toBe(1);
    })
})

describe('Testing CalculatorUUT implementation', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new CalculatorUUT()
        let result = calc.addition(2, 2)
        expect(result).toBe(4);
    })

    test('Subtract 2 from 4 gives 2', () => {
        let calc = new CalculatorUUT ()
        let result = calc.subtraction(4, 2)
        expect(result).toBe(2);
    })

    test('Multiply 2 and 2 gives 4', () => {
        let calc = new CalculatorUUT()
        let result = calc.multiplication(2, 2)
        expect(result).toBe(4);
    })

    test('Divide 2 by 2 gives 1', () => {
        let calc = new CalculatorUUT()
        let result = calc.division(2, 2)
        expect(result).toBe(1);
    })
})
