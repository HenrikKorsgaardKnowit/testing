# Calculator: Introduction to unit testing
This small guide will introduce unit testing with examples in Typescript with [Vitest](https://vitest.dev/). 

Unit testing is all about testing small functional units of code. Unit testing is useful for ensuring the quality of the code, debugging and making early decisions about the _functionality_ of the code. Unit testing can help enforce single responsibility and reduce complexity, because writing unit test for smallest funcitonal units of code (unit under test), encourage developers to identify and write code based on smaller functions that do one thing.

The following will go through a simple example of working with unit tests in Typescript and Vitest. We will go through a _very_ simple implementation of a calculator as the basic example.

We will implement a very simple calculator. The implementation will consist of a Calculator class and an Enum representing the Operations (additions, subtraction, multiplication and division). The ideal approach is to use the [TDD coding cycle](https://en.wikipedia.org/wiki/Test-driven_development#Coding_cycle):

1. Quickly add a test
2. Run all tests and see the new one fail
3. Make a little change
4. Run all tests and see them all succeed
5. Refactor to remove duplication
6. Check that all tests succeed after refactoring

If you want to dive deeper into TDD, then try the Safe exercise and/or consult external guides on this approach. In this short example, we will assume that we write tests first and then implement the code.

## Setting up
Start a new project called calculator and initialize npm:

```
    mkdir calculator
    cd calculator
    npm init -y
```

Install Typescript and vitest:

```
    npm install typescript vitest --save-dev
```

Add a test command to `package.json`:

```
"scripts": {
    "test": "vitest"
}
```

### Iteration 0: Checking our setup
Start by creating two files: calculator.ts and calculator.test.ts. The first is our implementation and the second is the tests for the calculator. The starting setup should look like this:

```
//src/calcualtor.ts

export class Calculator {
    add(a:number, b:number): number {
        return 0
    }
}
```

```
//src/calculator.test.ts
import {describe, expect, test} from 'vitest'
import { Calculator } from './calculator.ts'

describe('Test 0: Checking setup with sum', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.add(2, 2)
        expect(result).toBe(4);
    })
})

```

We start by importing features from Vitest: 

- [Describe](https://vitest.dev/api/#describe): We use `describe` to bundle multiple test cases under a shared describtion
- [Test](https://vitest.dev/api/#test): We use `test` as the test case initiator
- [Expect](https://vitest.dev/api/expect.html): We use `expect` to evaluate the output up against an _expected_ result.

In the first test, we start with the simples function of a calculator: adding two numbers. When running (`npm run test`), the first test will fail. We expect the outcome of `add(2, 2)` to return 4. Go ahead and fix the feature to make the test pass.


## Iteration 1: Operations and calculation
Now we start implementing our Enum to handle Operations. We start by creating out Enum and making that part of the calculators operations. 

```
//src/calcualtor.ts
export enum Operator {
    ADDITION, SUBTRACTION, MULTIPLICATON, DIVISION
} 

export class Calculator {
    calculate(a:number, b:number, operator:Operator ): number {
        if(operator == Operator.ADDITION){
            return a + b;
        }
    }
}
```

We decide to add a `calculate(a:number, b:number, operator:Operator)` function to our calculator as the only entry point (this is just a design choice. Other implementations might differ.). We need to refactor our test from before:

```
//src/calculator.test.ts
import {describe, expect, test} from 'vitest'
import { Calculator, Operator } from './calculator.ts'

describe('Test 0: Checking setup with sum', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.calculate(2, 2, Operator.ADDITION)
        expect(result).toBe(4);
    })
})

```

Now we can start doing TDD and add new features. We follow the pattern of adding the test first and then the implementation:

- Subtraction test -> subtraction implementation
- Multiplication test -> Multiplication implementation
- Division test -> Division implementation

#### Test cases
```
//src/calculator.test.ts
import {describe, expect, test} from 'vitest'
import { Calculator, Operator } from './calculator.ts'

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
```

#### Implementation

```
//src/calculator.ts
export enum Operator {
    ADDITION, SUBTRACTION, MULTIPLICATON, DIVISION
} 

export class Calculator {
    calculate(a:number, b:number, operator:Operator ): number {
        if(operator == Operator.ADDITION){
            return a + b;
        }

        if(operator == Operator.SUBTRACTION){
            return a - b;
        }

        if(operator == Operator.MULTIPLICATON){
            return a * b;
        }

        if(operator == Operator.DIVISION){
            return a / b;
        }

        return 0
    }
}
```

## Reflection: Unit under test
When we work with unit testing, it is very important to consider a) what is the unit under test and b) are we testing the right thing. This analysis can help us improve the code by refactoring into smaller and more focused unit of test (functions) and ensure we test the right thing. In the code above we assume that all our tests cases test the logic operations of our calculator. They do, but not _directly_. By going through the `calculate()` function we also test the ability of the calculator to handle Operations. As a result, our test for addition (below) test both our calculators ability to identify and delegate the `Operator.ADDITION` Enum and addition. This may be a trivial observation here, but the `calculate()` method might easily introduce additional steps, e.g. input validation, multiple sequential operations (2 + 2 / 4) etc.

```
//src/calculator.test.ts
test('Add 2 and 2 gives 4', () => {
    let calc = new Calculator()
    let result = calc.calculate(2, 2, Operator.ADDITION)
    expect(result).toBe(4);
})
```

Furthermore, our simple analysis also indicate that our implementation is a bit entangles. We should refactor the operations into individual methods that can be called by our Operation delegation in `calculate()`.  

## Iteration 2: Refactoring our implementation
We already have tests, so lets use those as support in refactoring our implementation. We want to move the individual operations into isolated functions.

#### Refactored implementation

```
//src/calculator.ts
export enum Operator {
    ADDITION, SUBTRACTION, MULTIPLICATON, DIVISION
} 

export class Calculator {
   
    calculate(a: number, b:number, operator:Operator):number {
        if(operator == Operator.ADDITION){
            return this.addition(a, b);
        }

        if(operator == Operator.SUBTRACTION){
            return this.subtraction(a,b)
        }

        if(operator == Operator.MULTIPLICATON){
            return this.multiplication(a,b)
        }

        if(operator == Operator.DIVISION){
            return this.division(a,b)
        }

        return 0
    }

    private addition(a: number, b:number): number {
        return a + b;
    }

    private subtraction(a: number, b:number): number {...}

    private multiplication(a: number, b:number): number {...}

    private division(a: number, b:number): number {...}
}
```

Now we can run our tests to confirm that our refactoring has not introduced errors.

#### Refactored test cases
And because we have moved the Operations outside the `calculate()` function, we can refactor our test to test the correct unit under test:

```
//src/calculator.test.ts
import {describe, expect, test} from 'vitest'
import { Calculator, Operator } from './calculator.ts'

describe('Testing simple Calculator implementation', () => {
    test('Add 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.addition(2, 2)
        expect(result).toBe(4);
    })

    test('Subtract 2 from 4 gives 2', () => {
        let calc = new Calculator()
        let result = calc.subtraction(4, 2)
        expect(result).toBe(2);
    })

    test('Multiply 2 and 2 gives 4', () => {
        let calc = new Calculator()
        let result = calc.multiplication(2, 2)
        expect(result).toBe(4);
    })

    test('Divide 2 by 2 gives 1', () => {
        let calc = new Calculator()
        let result = calc.division(2, 2)
        expect(result).toBe(1);
    })
})
```

## Iteration 3: Adding a spy
Our refactoring creates a minor issue. We have lost the ability to test our Calculators ability to identify the correct Operation. To get this under test coverage, we will introduce a [Test Spy](https://en.wikipedia.org/wiki/Test-driven_development#Fakes,_mocks_and_integration_tests):

_``A spy captures and makes available parameter and state information, publishing accessors to test code for private information allowing for more advanced state validation.''_

We can check on the last operation by exposing it to our test cases:


```
//src/calculator.ts
export enum Operator {
    ADDITION, SUBTRACTION, MULTIPLICATON, DIVISION
} 

export class Calculator {

    private lastOperation:Operator;
   
    calculate(a: number, b:number, operator:Operator):number {
        this.lastOperation = operator;
        if(operator == Operator.ADDITION){
            return this.addition(a, b);
        }

        if(operator == Operator.SUBTRACTION){
            return this.subtraction(a,b)
        }

        if(operator == Operator.MULTIPLICATON){
            return this.multiplication(a,b)
        }

        if(operator == Operator.DIVISION){
            return this.division(a,b)
        }

        return 0
    }

    private getLastOperation():Operator {
        return this.lastOperation;
    }
}
```

Now we can add a test for testing the Operations are correctly delegated by our Calculator:

```
//src/calculator.test.ts
test('Test operations', () => {
        let calc = new CalculatorRefactor()
        calc.calculate(2,2, Operator.ADDITION)
        expect(calc.getLastOperation()).toBe(Operator.ADDITION);
        calc.calculate(2,2, Operator.SUBTRACTION)
        expect(calc.getLastOperation()).toBe(Operator.SUBTRACTION);
        calc.calculate(2,2, Operator.MULTIPLICATON)
        expect(calc.getLastOperation()).toBe(Operator.MULTIPLICATON);
        calc.calculate(2,2, Operator.DIVISION)
        expect(calc.getLastOperation()).toBe(Operator.DIVISION);
})
```

## Iteration 4: Extending functionality
Now that we have the basic test framework in place we can extend our functionality. Let us imagine that we want to send an array of numbers and operation so we can handle calculator input that deals with sequences of operations: 1 + 2 + 4 / 8. 

(We assume sequential entry so we do not have to deal with the order of math operations in this example.)

If we start by refactoring our `calculate()`function to take an array of numbers and operations as inputs:

```
//src/calculator.ts
class Calculator {

    private lastOperation:Operator;

    calculate(input: (number|Operator)[]): number {

        var result:number = input[0] as number;

        for(var i = 1, n = input.length; i < n; i+=2 ){
            result = this.compute(result, input[i+1] as number, input[i] as Operator)
        }

        return result;
    }

    private compute(a: number, b:number, operator:Operator): number{
        this.lastOperation = operator;
        if(operator == Operator.ADDITION){
            return this.addition(a, b);
        }

        if(operator == Operator.SUBTRACTION){
            return this.subtraction(a,b)
        }

        if(operator == Operator.MULTIPLICATON){
            return this.multiplication(a,b)
        }

        if(operator == Operator.DIVISION){
            return this.division(a,b)
        }

        return 0
    }
    ...
}
```

In doing this we also refactor our Operation handler into a `compute()` function. Now it is useful that our test focus on smaller units instead of the entry point `calculate()`. We can use the existing test as support while we add additional functionality. We just have to refactor our test to change `calculate()` to `compute()` for our test that evaluate operations.

```
//src/calculator.test.ts
test('Test operations', () => {
    let calc = new Calculator()
    calc.compute(2,2, Operator.ADDITION)
    expect(calc.getLastOperation()).toBe(Operator.ADDITION);
    calc.compute(2,2, Operator.SUBTRACTION)
    expect(calc.getLastOperation()).toBe(Operator.SUBTRACTION);
    calc.compute(2,2, Operator.MULTIPLICATON)
    expect(calc.getLastOperation()).toBe(Operator.MULTIPLICATON);
    calc.compute(2,2, Operator.DIVISION)
    expect(calc.getLastOperation()).toBe(Operator.DIVISION);
})

```

## Summary
This guide has show how to use unit tests with Vitest and how unit tests are for supporting refactoring. 

For more on TDD and identifying tests as part of the TDD cyckle, see the extended case study of the Hotel Safe.
