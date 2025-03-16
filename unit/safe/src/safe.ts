// Imagine a physical Hotel Safe interface with physical buttons. 
export enum Button {
    D0, D1, D2, D3, D4, D5, D6, D7, D8, D9, LOCK, KEY, PIN
}

interface Safe {
    // Enter a button press on the safe
    enter(button: Button): void;
    /** Read the output of the display on the safe.
    ∗ POSTCONDITON : It is always a non−null string of
    ∗ exactly 6 characters that can be printed on
    ∗ a 7−segment display.
    ∗ @return: the output on the display 
    */
    readDisplay(): string;
    /** Get the state of the safe: is it locked or not.
    * @return true if the safe is locked    
    */
    isLocked(): boolean;
}

//Iteration 0 - fix module issues
export class SafeImpl0 implements Safe {
    enter(button: Button): void {
    }

    readDisplay(): string {
        return '';
    }
    isLocked(): boolean {
        return false;
    }
}

//Iteration 0 - make the test pass by Faking it!
export class SafeImpl1 implements Safe {
    enter(button: Button): void {
    }

    readDisplay(): string {
        return '      ';
    }
    isLocked(): boolean {
        return true;
    }
}

//Iteration 1 - pass by faking "123   " return
export class SafeImpl2 implements Safe {

    private displayContents: string;

    constructor() {
        this.displayContents = "      "      
    }

    enter(button: Button): void {
        this.displayContents = "123   "
    }

    readDisplay(): string {
        return this.displayContents;
    }
    isLocked(): boolean {
        return true;
    }
}

//Iteration 2 - handle consequtive digit input and padding
export class SafeImpl3 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if(button != Button.KEY && button != Button.LOCK){
            this.keyInput.push(button)
        }
        
        var output = this.keyInput.join("")
        this.displayContents = output + this.BLANK.slice(output.length)
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return true;
    }
}

//Iteration 3 - Handle the key feature. Needed to provide input and resets 
export class SafeImpl4 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
            this.displayContents = this.BLANK;
        } else {
            this.keyInput.push(button)
            var output = this.keyInput.slice(1).join("")
            this.displayContents = output + this.BLANK.slice(output.length)
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return true;
    }
}

//Iteration 4 - handle digit input without a key returns "ERROR " 
export class SafeImpl5 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
            this.displayContents = this.BLANK;
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR "
            } else {
                var output = this.keyInput.slice(1).join("")
                this.displayContents = output + this.BLANK.slice(output.length)
            }   
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return true;
    }
}

//Iteration 5 - Handle opening the safe
export class SafeImpl6 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
            this.displayContents = this.BLANK;
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR "
            } else {
                var output = this.keyInput.slice(1).join("")
                this.displayContents = output + this.BLANK.slice(output.length)
            }

            if(this.displayContents == this.code){
                this.locked = false;
                this.displayContents = "OPEN  "
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}


//Iteration 6 - Handle "CLOSED" on wrong code
export class SafeImpl7 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
            this.displayContents = this.BLANK;
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR ";
            } else {
                var inputString = this.keyInput.slice(1).join("");
                inputString = inputString + this.BLANK.slice(inputString.length)
                if(inputString == this.code){
                    this.locked = false;
                    this.displayContents = "OPEN  "
                } else if(inputString.indexOf(" ") == -1){
                    this.displayContents = "CLOSED"
                } else {
                    this.displayContents = inputString;
                }
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}

//Iteration 7 - handle lock mechanism
export class SafeImpl8 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if (button == Button.LOCK) {
            this.displayContents = "CLOSED";
            this.locked = true;
            this.keyInput = [];
        } else if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
            this.displayContents = this.BLANK;
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR ";
            } else {
                var inputString = this.keyInput.slice(1).join("");
                inputString = inputString + this.BLANK.slice(inputString.length)
                if(inputString == this.code){
                    this.locked = false;
                    this.displayContents = "OPEN  "
                } else if(inputString.indexOf(" ") == -1){
                    this.displayContents = "CLOSED"
                } else {
                    this.displayContents = inputString;
                }
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}

//Iteration 8.1 - handle safe opened, then error input, then locked 
export class SafeImpl9 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if (button == Button.LOCK) {
            this.displayContents = "CLOSED";
            this.locked = true;
            this.keyInput = [];
        } else if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR ";
                this.locked = true;
                this.keyInput = [];
            } else {
                var inputString = this.keyInput.slice(1).join("");
                inputString = inputString + this.BLANK.slice(inputString.length)
                if(inputString == this.code){
                    this.locked = false;
                    this.displayContents = "OPEN  "
                    this.keyInput = []
                } else if(inputString.indexOf(" ") == -1){
                    this.displayContents = "CLOSED"
                    this.keyInput = [];
                } else {
                    this.displayContents = inputString;
                }
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}

//Iteration 8.2 - handle additional unlock and lock cases
export class SafeImpl10 implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if (button == Button.LOCK) {
            this.displayContents = "CLOSED";
            this.locked = true;
            this.keyInput = [];
        } else if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR ";
                this.locked = true;
                this.keyInput = [];
            } else {
                var inputString = this.keyInput.slice(1).join("");
                inputString = inputString + this.BLANK.slice(inputString.length)
                if(inputString == this.code){
                    this.locked = false;
                    this.displayContents = "OPEN  "
                    this.keyInput = []
                } else if(inputString.indexOf(" ") == -1){
                    this.displayContents = this.BLANK;
                    this.keyInput = [];
                } else {
                    this.displayContents = inputString;
                }
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}

//Done 
export class SafeImpl implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
    }

    enter(button: Button): void {
        if (button == Button.LOCK) {
            this.displayContents = "CLOSED";
            this.locked = true;
            this.keyInput = [];
        } else if(button == Button.KEY) {
            this.keyInput = [Button.KEY];
        } else {
            this.keyInput.push(button)
            if(this.keyInput[0] != Button.KEY){
                this.displayContents = "ERROR ";
                this.locked = true;
                this.keyInput = [];
            } else {
                var inputString = this.keyInput.slice(1).join("");
                inputString = inputString + this.BLANK.slice(inputString.length)
                if(inputString == this.code){
                    this.locked = false;
                    this.displayContents = "OPEN  "
                    this.keyInput = []
                } else if(inputString.indexOf(" ") == -1){
                    this.displayContents = this.BLANK;
                    this.keyInput = [];
                } else {
                    this.displayContents = inputString;
                }
            }
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}

// Refactoring towards a state-oriented inpmplementation
export class SafeImplRefactor implements Safe {

    private displayContents: string;
    private keyInput: Button[];
    private readonly BLANK: string = "      ";
    private locked: boolean = true;
    private code: string = "123456";
    private inputState: boolean;

    constructor() {
        this.displayContents = this.BLANK;
        this.keyInput = [];
        this.inputState = false;
    }

    enter(button: Button): void {
        if (button == Button.LOCK) {
            this.locked = true;
            this.keyInput = [];
            this.displayContents = "CLOSED";
            this.inputState = false;
            return;
        }

        if(button == Button.KEY){
            this.displayContents = this.BLANK;
            this.locked = true;
            this.keyInput = [];
            this.inputState = true;
            return;
        }

        if(this.inputState){
            this.keyInput.push(button)
            var inputString = this.keyInput.join("");
            inputString = inputString + this.BLANK.slice(inputString.length)
            if(inputString == this.code){
                this.locked = false;
                this.displayContents = "OPEN  "
                this.keyInput = []
                this.inputState = false;
            } else if(inputString.indexOf(" ") == -1){
                this.displayContents = this.BLANK;
                this.keyInput = [];
                this.inputState = false;
            } else {
                this.displayContents = inputString;
            }
        } else {
            this.displayContents = "ERROR ";
            this.locked = true;
            this.keyInput = [];
        }
    }

    readDisplay(): string {
        return this.displayContents;
    }

    isLocked(): boolean {
        return this.locked;
    }
}




