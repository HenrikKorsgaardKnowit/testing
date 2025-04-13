export enum Operator {
    ADDITION, SUBTRACTION, MULTIPLICATON, DIVISION
} 

// Iteration 0: Checking the setup
export class CalculatorSimple {
    add(a:number, b:number): number {
        return 0
    }
}


// Iteration 1: First implementation
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

// Iteration 2 and 3: Refactoring into better units and adding spy
export class CalculatorRefactor {

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

    private addition(a: number, b:number): number {
        return a + b;
    }

    private subtraction(a: number, b:number): number {
        return a - b;
    }

    private multiplication(a: number, b:number): number {
        return a * b;
    }

    private division(a: number, b:number): number {
        return a / b;
    }

    private getLastOperation():Operator {
        return this.lastOperation;
    }
}

// Iteration 3: Handle more complex 
export class CalculatorUUT {

    private lastOperation:Operator;

    // we assume that input is controlled elsewhere to make sure we in ordered, number, operator, number, operator, number
    calculate(input: (number|Operator)[]): number {

        var result:number = input[0] as number;

        for(var i = 1, n = input.length; i < n; i+=2 ){
            result = this.compute(result, input[i+1] as number, input[i] as Operator)
        }

        return result;
    }

    private compute(a: number, b:number, operator:Operator): number {
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

    private addition(a: number, b:number): number {
        return a + b;
    }

    private subtraction(a: number, b:number): number {
        return a - b;
    }

    private multiplication(a: number, b:number): number {
        return a * b;
    }

    private division(a: number, b:number): number {
        return a / b;
    }

    private getLastOperation():Operator {
        return this.lastOperation;
    }
}