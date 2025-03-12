// Imagine a physical Hotel Safe interface with physical buttons. 
export enum Button {
    D0,D1,D2,D3,D4,D5,D6,D7,D8,D9,LOCK,KEY,PIN
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
    readDisplay():string;
    /** Get the state of the safe: is it locked or not.
    * @return true if the safe is locked    
    */
    isLocked():boolean;
}

//Iteration 0 - fix module issues
export class SafeImpl1 implements Safe{
    enter(button: Button): void {
    }

    readDisplay(): string {
        return '';
    }
    isLocked(): boolean {
        return false;
    }
}

//Iteration 1 - make the test pass by Faking it!
export class SafeImpl2 implements Safe{
    enter(button: Button): void {
    }

    readDisplay(): string {
        return '      ';
    }
    isLocked(): boolean {
        return true;
    }
}

//Iteration 3 - make the test pass by Faking it!
export class SafeImpl3 implements Safe{

    private displayContents:string;

    constructor(){
        this.displayContents = '      '
    }

    enter(button: Button): void {
        this.displayContents = '123   '
    }

    readDisplay(): string {
        return this.displayContents;
    }
    isLocked(): boolean {
        return true;
    }
}

//Iteration 4 - make the test pass by Faking it!
export class SafeImpl4 implements Safe{

    private displayContents:string[];
    private index: number;
    private locked: boolean;
    private map:Map<Button, string>;

    constructor(){
        this.displayContents = [" ", " ", " ", " ", " ", " "];
        this.index = 0;
        this.locked = true;
        this.map = new Map<Button, string>();
        this.map.set(Button.D1, "1")
        this.map.set(Button.D2, "2")
        this.map.set(Button.D3, "3")
        this.map.set(Button.D4, "4")
        this.map.set(Button.D5, "5")
        this.map.set(Button.D6, "6")
        this.map.set(Button.D7, "7")
        this.map.set(Button.D9, "9")
    }

    enter(button: Button): void {
        var c = this.map.get(button)
        if ( c != null ) {
            this.displayContents[this.index] = c
            this.index = this.index+1
        }
        
        if (this.readDisplay() == "123456") {
            this.locked = false;
            this.displayContents[0] = "O";
            this.displayContents[1] = "P";
            this.displayContents[2] = "E";
            this.displayContents[3] = "N";
            this.displayContents[4] = " ";
            this.displayContents[5] = " ";
        }
    }

    readDisplay(): string {
        return this.displayContents.join("");
    }

    isLocked(): boolean {
        return this.locked;
    }
}

export class SafeImpl5 implements Safe{

    private displayContents:string[];
    private index: number;
    private locked: boolean;
    private map:Map<Button, string>;

    constructor(){
        this.displayContents = [" ", " ", " ", " ", " ", " "];
        this.index = 0;
        this.locked = true;
        this.map = new Map<Button, string>();
        this.map.set(Button.D1, "1")
        this.map.set(Button.D2, "2")
        this.map.set(Button.D3, "3")
        this.map.set(Button.D4, "4")
        this.map.set(Button.D5, "5")
        this.map.set(Button.D6, "6")
        this.map.set(Button.D7, "7")
        this.map.set(Button.D9, "9")
    }

    enter(button: Button): void {
        var c = this.map.get(button)
        if ( c != null ) {
            this.displayContents[this.index] = c
            this.index = this.index+1
        }
        
        if (this.readDisplay() == "123456") {
            this.locked = false;
            this.displayContents[0] = "O";
            this.displayContents[1] = "P";
            this.displayContents[2] = "E";
            this.displayContents[3] = "N";
            this.displayContents[4] = " ";
            this.displayContents[5] = " ";
        } else if(this.index == 6){
            this.displayContents[0] = "C";
            this.displayContents[1] = "L";
            this.displayContents[2] = "O";
            this.displayContents[3] = "S";
            this.displayContents[4] = "E";
            this.displayContents[5] = "D";
        }
    }

    readDisplay(): string {
        return this.displayContents.join("");
    }

    isLocked(): boolean {
        return this.locked;
    }
}

export class SafeImpl6 implements Safe{

    private displayContents:string[];
    private index: number;
    private locked: boolean;
    private map:Map<Button, string>;

    constructor(){
        this.displayContents = [" ", " ", " ", " ", " ", " "];
        this.index = 0;
        this.locked = true;
        this.map = new Map<Button, string>();
        this.map.set(Button.D0, "0")
        this.map.set(Button.D1, "1")
        this.map.set(Button.D2, "2")
        this.map.set(Button.D3, "3")
        this.map.set(Button.D4, "4")
        this.map.set(Button.D5, "5")
        this.map.set(Button.D6, "6")
        this.map.set(Button.D7, "7")
        this.map.set(Button.D8, "8")
        this.map.set(Button.D9, "9")
    }

    enter(button: Button): void {
        var c = this.map.get(button)
        if ( c != null ) {
            this.displayContents[this.index] = c
            this.index = this.index+1
        }
        
        if (this.readDisplay() == "123456") {
            this.locked = false;
            this.displayContents[0] = "O";
            this.displayContents[1] = "P";
            this.displayContents[2] = "E";
            this.displayContents[3] = "N";
            this.displayContents[4] = " ";
            this.displayContents[5] = " ";
        } else if(this.index == 6){
            this.displayContents[0] = "C";
            this.displayContents[1] = "L";
            this.displayContents[2] = "O";
            this.displayContents[3] = "S";
            this.displayContents[4] = "E";
            this.displayContents[5] = "D";
        }
    }

    readDisplay(): string {
        return this.displayContents.join("");
    }

    isLocked(): boolean {
        return this.locked;
    }
}


export class SafeImpl7 implements Safe{

    private displayContents:string[];
    private index: number;
    private locked: boolean;
    private map:Map<Button, string>;

    constructor(){
        this.displayContents = [" ", " ", " ", " ", " ", " "];
        this.index = 0;
        this.locked = true;
        this.map = new Map<Button, string>();
        this.map.set(Button.D0, "0")
        this.map.set(Button.D1, "1")
        this.map.set(Button.D2, "2")
        this.map.set(Button.D3, "3")
        this.map.set(Button.D4, "4")
        this.map.set(Button.D5, "5")
        this.map.set(Button.D6, "6")
        this.map.set(Button.D7, "7")
        this.map.set(Button.D8, "8")
        this.map.set(Button.D9, "9")
    }

    enter(button: Button): void {
        var c = this.map.get(button)
        if ( c != null ) {
            this.displayContents[this.index] = c
            this.index = this.index+1
        }
        
        if (this.readDisplay() == "123456") {
            this.locked = false;
            this.displayContents[0] = "O";
            this.displayContents[1] = "P";
            this.displayContents[2] = "E";
            this.displayContents[3] = "N";
            this.displayContents[4] = " ";
            this.displayContents[5] = " ";
        } else if(this.index == 6){
            this.displayContents[0] = "C";
            this.displayContents[1] = "L";
            this.displayContents[2] = "O";
            this.displayContents[3] = "S";
            this.displayContents[4] = "E";
            this.displayContents[5] = "D";
        }
    }

    readDisplay(): string {
        return this.displayContents.join("");
    }

    isLocked(): boolean {
        return this.locked;
    }
}

export class SafeImpl8 implements Safe{

    private displayContents:string;
    private locked: boolean;
    private input: Button[];
    private readonly BLANK:string = "      ";
    private code:string = "123456";

    constructor(){
        this.displayContents = this.BLANK;
        this.locked = true;
        this.input = []
    }

    enter(button: Button): void {
        if(button == Button.KEY){
            this.input = [Button.KEY]
        } else {
            this.input.push(button)
            if(this.input[0] != Button.KEY){
                this.displayContents = "ERROR "
                this.input = []
            } else {
                var output = this.input.slice(1).join("")
                output += this.BLANK.slice(output.length)
                this.displayContents = output


            }
        }
    }

    readDisplay(): string {
        return this.displayContents
    }

    isLocked(): boolean {
        return this.locked;
    }
}


export class SafeImpl9 implements Safe{

    private displayContents:string;
    private locked: boolean;
    private keyInput: Button[];
    private readonly BLANK:string = "      ";
    private code:string = "123456";

    constructor(){
        this.displayContents = this.BLANK;
        this.locked = true;
        this.keyInput = []
    }

    enter(button: Button): void {
        if(button == Button.LOCK){
            this.displayContents = "      ";
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
                var inputResult = this.keyInput.slice(1).join("");
                inputResult += this.BLANK.slice(inputResult.length);
                if(inputResult == this.code){
                    this.displayContents = "OPEN  ";
                    this.locked = false;
                    this.keyInput = [];
                } else if(inputResult.indexOf(" ") == -1) {
                    this.displayContents = "CLOSED";
                    this.keyInput = [];
                } else {
                    this.displayContents = inputResult;
                }   
            }
        }
    }

    readDisplay(): string {
        return this.displayContents
    }

    isLocked(): boolean {
        return this.locked;
    }
}


export class SafeImpl implements Safe{

    private displayContents:string;
    private locked: boolean;
    private keyInput: Button[];
    private readonly BLANK:string = "      ";
    private code:string = "123456";

    constructor(){
        this.displayContents = this.BLANK;
        this.locked = true;
        this.keyInput = []
    }

    enter(button: Button): void {
        // what about a solution with input states
        

        if(button == Button.LOCK){
            this.displayContents = this.BLANK;
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
                var inputResult = this.keyInput.slice(1).join("");
                inputResult += this.BLANK.slice(inputResult.length);
                if(inputResult == this.code){
                    this.displayContents = "OPEN  ";
                    this.locked = false;
                    this.keyInput = [];
                } else if(inputResult.indexOf(" ") == -1) {
                    this.displayContents = "CLOSED";
                    this.keyInput = [];
                } else {
                    this.displayContents = inputResult;
                }   
            }
        }
    }

    readDisplay(): string {
        return this.displayContents
    }

    isLocked(): boolean {
        return this.locked;
    }
}


