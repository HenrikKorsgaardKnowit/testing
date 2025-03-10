
## Introduction: Case study in Test-Driven Development
This exercise goes through a case example from Henrik Bærbaks book on "Flexible, Reliable Software". The following attempts to follow the case of the Hotel Safe as close as possible. In the original case, the tests and implementation is done in Java. In this guide, it is done in TypeScript with Vitest.

The challenge and full discussion of the case is available in the above link. In this guide we focus mainly on implementing the different iterations of TDD. 

The following descriptions in _italics_ are quotes from the original case.

## Case: A Hotel safe
_The safe has a display consisting of six 7-segment elements1, see Figure 1.1. It has a numerical panel having buttons for the digits "0" to "9". Additionally it has three special buttons with a padlock symbol (marked "Lock"), a key symbol (marked "Open"), and a broken arrow symbol (marked "Set New PIN"). From the factory the safe is preprogrammed with the pin code "123456" as code to open the safe._ [1, p2]

_Users can program their own pin codes to open the safe, however, it must always be a 6 digit pin code._ [1, p2]

_The safe is provided with a very short guide for operating the safe intended for the hotel room visitor, as seen in Figure 1.2_

### User stories:

_The company defines a set of stories to drive the implementation effort. The following stories assume the safe has the factory default pin code "1234562 as the 6-digit proper pin code._

**Story 1: Unlock Safe:** _The user approaches the safe whose door is locked. The display is empty, which means it contains 6 spaces/blanks. The user hits the key-symbol button. The user enters his previously stored pin code by pressing the buttons one at the time: "1", "2", "3", "4", "5", "6". The display reacts by writing each digit as it is pressed. After the final "6" button press, the display clears and displays "OPEN  ". The safe door unlocks and can be opened._

**Story 2: Lock Safe:** _The safe door is unlocked. The display reads "OPEN  ". The user closes the door and presses the lock button. The door locks. The display reads "CLOSED"._

**Story 3: Forgetting key Button:** _The safe is locked. The user forgets to hit the key button first and hits "1". The display reads "ERROR ". All following button hits result in the display reading "ERROR ", unless the key botton is pressed._

**Story 4: Wrong Code:** _The safe is locked. The user hits key followed by 1 2 4 3 5 6. The display is cleared. The safe remains locked._ 

**Story 5: Set New Code:** _The safe is open/unlocked. The user hits the pin button, enters a new six digit pin code, "777333", and finally hits the pin again. The safe’s display reads "CODE  ". It remains unlocked. After locking, the safe can only be unlocked (see story 1) by entering the new pin code "777333"._

### Authors note
_Note: The scenarios above are not quite consistent: After locking the safe, the display reads "CLOSED" (and entering new pin "CODE  ") but then how does it get to the state where the display is cleared? In the real safe there will be a timer clearing the display after a short period but I will ignore this feature in the following discussion._

_Note also that story 2 is actually not complete as it only discusses the behavior of the lock button if the safe is unlocked, not what happens if it is pressed  while the safe is already locked. This, however, will be discovered in iteration 8._

Additional notes: We are not told why a blank display means that it contains 6 spaces/blanks instead of an empty string (""). This may be a hardware requirement that we are never told about. From the provided interface, we can see the comment informing us that the readDisplay always returns a non-null string of exactly 6 characters that is printed on the display.

### Given code 
The original case study provide the reader with an Safe interface and an enum representing the button input. We follow the same, because it provide us with a useful starting point and interesting constraints.

<details>
  <summary>Safe interface</summary>
  ```
    // saft.ts
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
  ```
</details>

<details>
  <summary>Button enum</summary>
  ```
    //safe.ts
    export enum Button {
        D0,D1,D2,D3,D4,D5,D6,D7,D8,D9,LOCK,KEY,PIN
    }
  ```
</details>

## TDD analysis
The first thing we want to do is to do an analysis of the user stories and provided code to establish some early test cases. We do not want to identify all test cases. We expect that the first few interations of the implementation will give us more insight and help us identify new test cases. We also want a few obvious test cases to get us started.

1. Initial state: Display reads 6 spaces. Safe is locked
2. Enter (key, 1,2,3) gives "123   "" as output. Safe is locked
3. Enter (key, 1,2,3,4,5,6) gives "OPEN  "". Safe is unlocked.
4. Enter (1) gives "ERROR ". Safe is locked.
5. Enter (key,1,2,3,4,5,6) gives "CLOSED". Safe is locked.
6. Unlocked safe: Enter (lock) gives empty display. Safe locked.

### TDD Principles
When we start implemting the code we will follow TDD rules consistently.

0. **If you cannot imagine a test for the implementation, then it is hard to do a good implementation.**
1. **Write your test before writing the implementation.** Quality and analysis should guide implementation
    a. Same goes for your assertions. Write them before you write the implementation.
2. **One step test.** Work with one test at a time and pick the one that will teach you the most about the implementation.
3. **Fake it, 'til you make it'** Start by returning a constant, then iterate from there until the test passes
4. **Triangulation** Use tests to guide abstraction. Only make abstractions when two or more test benefit from it
5. **Obvious implementation** Start with the most obvious implementation. When the test passes you can always refactor and optimize.
6. **Isolated test** Tests should have no sideffects and never affect other tests.
7. **Evident test** Tests should favor readability over everything else. If you cannot read or debug your tests, then you cannot read or debug your code.

### TDD Rythm

1. Quickly add a test
2. Run all tests and see the new one fail
3. Make a little change
4. Run all tests and see them all succeed
5. Refactor to remove dublication
6. Check that all tests succeed after refactoring

Step 3 and 4 is the central point of implementation. For some stories and test you will go through this once or twice. For other, you will do a lot of iterations. It is important to do small increments to ensure good progression. Skipping ahead will cost on quality, missed test and functionality, and ultimately lead to technical debt. 

## Iteration 1: Setting up

0. We assume that you have installed TypeScript and Vitest for your project.

1. Quickly add the first test case: Display reads 6 spaces and Safe is locked

```
//safe.test.ts
import {expect, test} from 'vitest'
import { Safe } from './safe.ts'

test('Initial state should be locked and returning a clean interface (6 spaces)', () => {
    var safe:Safe = new Safe();

    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})
```

Without an actual implementation of the interface, we will get a '.../safe.ts' is not an module error. We fix this by implementing a skeleton of the code:
<details>
  <summary>Safe skeleton implementation</summary>

  ```
    export class Safe implements ISafe{
        enter(button: Button): void {
        }
        
        readDisplay(): string {
            return '';
        }
        isLocked(): boolean {
            return false;
        }
    }
  ```
</details>

Next step is to implement our class so that it passes the tests by _Faking it_. Don't worry, while we fake it now, working through the test cases will help us get closer to the full implementation. Right now, we are in the `getting to know the use-case and implementation' phase. 

<details>
  <summary>Test case 1: Display reads 6 spaces and Safe is locked</summary>

  ```
    //safe.ts
    export class SafeImpl implements Safe{
        enter(button: Button): void {
        }
        
        readDisplay(): string {
            return '      ';
        }
        isLocked(): boolean {
            return true;
        }
    }
  ```
</details>

## Iteration 2: Half baked code
The next test will focus our attention on the readDisplay() feature. Implement test case 2. Remember, that if we import the Button enum from `safe.ts` then we can iniate our Safe object and enter keys by calling `enter(button:Button);`. 

<details>
  <summary>Test case 2: Enter (key,1,2,3) gives '123   ' as output. Safe is locked.</summary>

  ```
    import {expect, test} from 'vitest'
    import { SafeImpl, Button } from './safe.ts'
    //safe.test.ts
    test('Enter (key,1,2,3) gives "123   " as output. Safe is locked.', () => {
        var safe:Safe = new SafeImpl();
        safe.enter(Button.KEY)
        safe.enter(Button.D1)
        safe.enter(Button.D2)
        safe.enter(Button.D3)

        expect(safe.readDisplay()).toBe('123   ');
        expect(safe.isLocked()).toBe(true);
    })
  ```
</details>

Now we have two tests that needs to pass. And we need to do so with the smallest step possible. We need to create a releationship between our `enter(button:Button)` and `readDisplay():string` functions. Two hints: class properties and initial display state. 

<details>
  <summary>Getting test 1 and 2 to pass</summary>
  
  ```
    //safe.ts
    export class SafeImpl implements Safe{

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
  ```
</details>

### TDD 5: Refactoring
Now we have 2 tests both using the SafeImpl. We can assume that the rest of the tests also need to instantiate SafeImpl. Instead of doing this in each test, we can utilize a `beforeEach()` feature that is available in the most common unit test libraries. Calling `beforeEach()` will give us an option to do some setting up before each test. See the [Vitest:beforeEach documentation](https://vitest.dev/api/#beforeeach) for more.

```
//safe.test.ts
beforeEach(async () => {
  // Do something before each test
})
```

If we want to make the Safe initation available to each test, we need to add a TestContext type interface and attach that to the call to `beforeEach()` and each individual `test()`:

```
interface TestContext {
    safe: Safe
}

beforeEach<TestContext>(async (ctx) => {
    // Clear mocks and add some testing data after before each test run
    ctx.safe = new Safe();
})

test<TestContext>('Display reads 6 spaces and Safe is locked', ({safe}) => {
    expect(safe.readDisplay()).toBe('      ');
    expect(safe.isLocked()).toBe(true);
})
```

1. We declare a TestContext interface that contains a reference to a safe.
2. We add attach the TextContext to `beforeEach` and `test` as a [TypeScript generic](https://www.typescriptlang.org/docs/handbook/2/generics.html).
3. This allow us to instantiate the Safe and attach this to the TestContext in `BeforeEach` and pass it to each `test` in the same way as an object variable `{safe}`.


## Iteration 3: Unlock safe
The next step is the 3rd test case: Enter (key,1,2,3,4,5,6) gives 'OPEN ', safe unlocked. Implementing the test and getting it to pass will start adding some real logic to the Safe class. Start by implementing the test case.

<details>
  <summary>Enter (key,1,2,3,4,5,6) gives 'OPEN '.</summary>

  ```
    test('Enter (key,1,2,3,4,5,6) gives "OPEN ".', ({safe}) => {
        safe.enter(Button.KEY)
        safe.enter(Button.D2)
        safe.enter(Button.D3)
        safe.enter(Button.D4)
        safe.enter(Button.D5)
        safe.enter(Button.D6)

        expect(safe.readDisplay()).toBe('OPEN ');
        expect(safe.isLocked()).toBe(false);
    })
  ```
</details>

When we examine the test, it is hard to identify a _make a small change_ step. The test case both require unlocking and comparing the code. That is hard to fake without messing with the previous tests _and_ it suggest two avenues of implementation. We will need to implement something that accummulates the input and triggers the unlock. When there are multiple behaviours, then we know that the implementation is involved and cannot be done as a small change. This suggest that the test is too big as well. We need to split it into multiple _child tests_. 

## Iteration 4: Handlning Accumulating digits

<details>
  <summary>Enter (key,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". The safe is locked'.</summary>

  ```
    test(''Enter (key,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". Safe is locked.', ({Safe}) => {
        safe.enter(Button.KEY)
        safe.enter(Button.D1)
        expect(safe.readDisplay()).toBe('1     ');
        safe.enter(Button.D7)
        expect(safe.readDisplay()).toBe('17    ');
        safe.enter(Button.D9)
        expect(safe.readDisplay()).toBe('179   ');
    
        expect(safe.isLocked()).toBe(true);
    })
  ```
</details>

Remember, when we change the implementation all the other test should pass. Here is two hints for the implementation: We can store the button input in an array or or map. We need to store an index as well.

## Iteraction 5: Unlock the safe

## Iteration 6: Wrong code


## Iteration 3: Testing input and display behaviour
This test forces us to look at handling the input. We need to starting thinking about how the input behaves. Lets reexamine key information from stories for this feature:

**Story 1: Unlock safe**: _The user approaches the safe whose door is locked. The display is empty, which means it contains 6 spaces/blanks. The user hits the key-symbol button. The user enters his previously stored pin code by pressing the buttons one at the time: "1", "2", "3", "4", "5", "6". The display reacts by writing each digit as it is pressed. After the final "6" button press, the display clears and displays "OPEN ". The safe door unlocks and can be opened._  

**Story 3: Forgetting key**: _Button The safe is locked. The user forgets to hit the key button first and hits "1". The display reads "ERROR "". All following button hits result in the display reading "ERROR ", unless the key botton is pressed._

**Story 4: Wrong Code**: _The safe is locked. The user hits key followed by 1 2 4 3 5 6. The display is cleared. The safe remains locked._

From this we can assume that when entering a code to unlock the safe, the user should always start with KEY. Failing to start with KEY button results in an ERROR. Because there is not RETURN key or similar trigger unlock (or key validation), the KEY plus 6 digits either terminates into clearing the display and remaining locked or showing "OPEN " and unlocking the safe. As noted below the stories, we cannot directly assume that entering KEY resets the option for entering the key.


<details>
  <summary>Test case 2.5: Accumulated input. Enter (key, 7,3) gives '73 ', enter (4) gives '734 '. Safe is locked.</summary>

  ```
    import {expect, test} from 'vitest'
    import { Safe, Button } from './safe.ts'
    //safe.test.ts
    test('Enter (key,1,2,3) gives "123 " as output. Safe is locked.', () => {
        var safe:Safe = new Safe();
        safe.enter(Button.KEY)
        safe.enter(Button.D1)
        safe.enter(Button.D2)
        safe.enter(Button.D3)

        expect(safe.readDisplay()).toBe('123 ');
        expect(safe.isLocked()).toBe(true);
    })
  ```
</details>

This test forces us to look at handling the input. We need to starting thinking about how the input behaves. Lets reexamine the stories for this feature:




## Iteration 3: Unlock safe
The next step is the 3rd test case: Enter (key,1,2,3,4,5,6) gives 'OPEN ', safe unlocked. Implementing the test and getting it to pass will start adding some real logic to the Safe class. Start by implementing the test case.

<details>
  <summary>Test case 3: Enter (key,1,2,3,4,5,6) gives 'OPEN '.</summary>

  ```
    test('Test case 3: Enter (key,1,2,3,4,5,6) gives "OPEN ".', () => {
        var safe:Safe = new Safe();
        safe.enter(Button.KEY)
        safe.enter(Button.D2)
        safe.enter(Button.D3)
        safe.enter(Button.D4)
        safe.enter(Button.D5)
        safe.enter(Button.D6)

        expect(safe.readDisplay()).toBe('OPEN ');
        expect(safe.isLocked()).toBe(false);
    })
  ```
</details>

This test require us to consider two behaviours in the code. Checking 