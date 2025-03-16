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

//First iteration of the SafeImpl
export class SafeImpl implements Safe {
    enter(button: Button): void {
    }

    readDisplay(): string {
        return '';
    }
    isLocked(): boolean {
        return false;
    }
}





