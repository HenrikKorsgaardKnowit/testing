
## Introduction: Case study in Test-Driven Development
This exercise goes through a case example from [Henrik Bærbaks book on "Flexible, Reliable Software"](https://www.baerbak.com/index.html). 

In the [supplementary material](https://www.baerbak.com/safe.pdf), Henrik walks through the case of the Hotel Safe. The following use the same case and follow the test-cases and approach as close as possible. In the original case, the tests and implementation is done in Java. This guide use TypeScript and Vitest.

The challenge and full discussion of the case is available in the above link. In this guide we focus mainly on implementing the different iterations of TDD. 

The reference implementation is in the `solutions` branch. 

The following descriptions in _italics_ are quotes from the original case.

## Case: A Hotel safe
_The safe has a display consisting of six 7-segment elements1, see Figure 1.1. It has a numerical panel having buttons for the digits "0" to "9". Additionally it has three special buttons with a padlock symbol (marked "Lock"), a key symbol (marked "Open"), and a broken arrow symbol (marked "Set New PIN"). From the factory the safe is preprogrammed with the pin code "123456" as code to open the safe._ [1, p2]

_Users can program their own pin codes to open the safe, however, it must always be a 6 digit pin code._ [1, p2]

_The safe is provided with a very short guide for operating the safe intended for the hotel room visitor, as seen in Figure 1.2_

### User stories:

_The company defines a set of stories to drive the implementation effort. The following stories assume the safe has the factory default pin code "1234562 as the 6-digit proper pin code._

**Story 1: Unlock Safe:** _The user approaches the safe whose door is locked. The display is empty, which means it contains 6 spaces/blanks. The user hits the key-symbol button. The user enters his previously stored pin code by pressing the buttons one at the time: "1", "2", "3", "4", "5", "6". The display reacts by writing each digit as it is pressed. After the final "6" button press, the display clears and displays "OPEN  ". The safe door unlocks and can be opened._

**Story 2: Lock Safe:** _The safe door is unlocked. The display reads "OPEN  ". The user closes the door and presses the lock button. The door locks. The display reads "CLOSED"._

**Story 3: Forgetting key Button:** _The safe is locked. The user forgets to hit the key button first and hits "1". The display reads "ERROR ". All following button hits result in the display reading "ERROR ", unless the key button is pressed._

**Story 4: Wrong Code:** _The safe is locked. The user hits key followed by 1 2 4 3 5 6. The display is cleared. The safe remains locked._ 

**Story 5: Set New Code:** _The safe is open/unlocked. The user hits the pin button, enters a new six digit pin code, "777333", and finally hits the pin again. The safe’s display reads "CODE  ". It remains unlocked. After locking, the safe can only be unlocked (see story 1) by entering the new pin code "777333"._

### Authors note
_Note: The scenarios above are not quite consistent: After locking the safe, the display reads "CLOSED" (and entering new pin "CODE  ") but then how does it get to the state where the display is cleared? In the real safe there will be a timer clearing the display after a short period but I will ignore this feature in the following discussion._

_Note also that story 2 is actually not complete as it only discusses the behavior of the lock button if the safe is unlocked, not what happens if it is pressed  while the safe is already locked. This, however, will be discovered in iteration 8._

Additional notes: We are not told why a blank display means that it contains 6 spaces/blanks instead of an empty string. This may be a hardware requirement that we are never informed about. From the provided interface, we can see the comment informing us that the readDisplay always returns a non-null string of exactly 6 characters that is printed on the display.

### Given code 
The original case study provide the reader with an Safe interface and an enum representing the button input. We follow the same, because it provide us with a useful starting point and interesting constraints.

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

```
    //safe.ts
    export enum Button {
        D0,D1,D2,D3,D4,D5,D6,D7,D8,D9,LOCK,KEY,PIN
    }
```

## TDD analysis
The first thing we want to do is to do an analysis of the user stories and provided code to establish some early test cases. We do not want to identify all test cases. We expect that the first few iterations of the implementation will give us more insight and help us identify new test cases. We also want a few obvious test cases to get us started. To do this we _review_ the user stories and write down a short list of test candidates to begin with. 

Before you proceed, try to identify 5 test cases for the above user stories.

<details>
  <summary>Hotel Safe test candidates</summary>

1. Initial state: Display reads 6 spaces. Safe is locked
2. Enter (key, 1,2,3) gives "123   "" as output. Safe is locked
3. Enter (key, 1,2,3,4,5,6) gives "OPEN  "". Safe is unlocked.
4. Enter (1) gives "ERROR ". Safe is locked.
5. Enter (key,1,2,3,4,5,6) gives "CLOSED". Safe is locked.
6. Unlocked safe: Enter (lock) gives empty display. Safe locked.
 
</details>

### TDD Principles
When we start implementing the code we will follow TDD rules consistently.

0. **If you cannot imagine a test for the implementation, then it is hard to do a good implementation.**
1. **Write your test before writing the implementation.** Quality and analysis should guide implementation
    a. Same goes for your assertions. Write them before you write the implementation.
2. **One step test.** Work with one test at a time and pick the one that will teach you the most about the implementation.
3. **Fake it, 'til you make it'** Start by returning a constant, then iterate from there until the test passes
4. **Triangulation** Use tests to guide abstraction. Only make abstractions when two or more test benefit from it
5. **Obvious implementation** Start with the most obvious implementation. When the test passes you can always refactor and optimize.
6. **Isolated test** Tests should have no sid-effects and never affect other tests.
7. **Evident test** Tests should favor readability over everything else. If you cannot read or debug your tests, then you cannot read or debug your code.

### TDD Rythm

1. Quickly add a test
2. Run all tests and see the new one fail
3. Make a little change
4. Run all tests and see them all succeed
5. Refactor to remove duplication
6. Check that all tests succeed after refactoring

Step 3 and 4 is the central point of implementation. For some stories and test you will go through this once or twice. For other, you will do a lot of iterations. It is important to do small increments to ensure good progression. Skipping ahead will cost on quality, missed test and functionality, and ultimately lead to technical debt. 

## Iteration 0: Setting up

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
  <summary>Hint: Safe skeleton implementation</summary>

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
  <summary>Hint: Test case 1: Display reads 6 spaces and Safe is locked</summary>

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

## Iteration 1: Half baked code
The next test will focus our attention on the readDisplay() feature. Implement test case 2. Remember, that if we import the Button enum from `safe.ts` then we can initialise our Safe object and enter keys by calling `enter(button:Button);`. 

<details>
  <summary>Hint: Test case 2: Enter (KEY,1,2,3) gives "123   " as output. Safe is locked. </summary>

  ```
    import {expect, test} from 'vitest'
    import { SafeImpl, Button } from './safe.ts'
    //safe.test.ts
    test('Enter (KEY,1,2,3) gives "123   " as output. Safe is locked.', () => {
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

Now we have two tests that needs to pass. And we need to do so with the smallest step possible. We need to create a relationship between our `enter(button:Button)` and `readDisplay():string` functions. Two hints: class properties and initial display state. 

<details>
  <summary>Hint: Getting test 1 and 2 to pass</summary>
  
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
Remember the TDD rule: 4. Triangulation Use tests to guide abstraction. Only make abstractions when two or more test benefit from it

And remember step 5 of the TDD rythm: Refactor to remove duplication.

Now we have 2 tests both using the SafeImpl. We can assume that the rest of the tests also need to instantiate SafeImpl. Instead of doing this in each test, we can utilize a `beforeEach()` feature that is available in the most common unit test libraries. Calling `beforeEach()` will give us an option to do some setting up before each test. See the [Vitest:beforeEach documentation](https://vitest.dev/api/#beforeeach) for more.

```
//safe.test.ts
beforeEach(async () => {
  // Do something before each test
})
```

If we want to make the Safe instantiation available to each test, we need to add a TestContext type interface and attach that to the call to `beforeEach()` and each individual `test()`:

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

## Iteration 2: Discovering tests as we go
A common experience when writing tests alongside coding, is that you start becoming familiar with the feature and spot additional tests. The previous test: _Enter (key,1,2,3) gives "123   " as output. Safe is locked._ test if the code returns what we have provided as input. However, it does not test the _behaviour_ of the input. When we enter a key, the state of the Safe should change immediately. We need to test that each input is added to the previous inputs. How would you write a new test that checks each input before progressing?

<details>
  <summary>Hint: Test case 3: Enter (KEY,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". Safe is locked.</summary>
  
  ```
  test<TestContext>('Enter (KEY,1) gives "1     ". Enter (7) gives "17    ". Enter (9) Gives "179   ". Safe is locked.',  ({safe}) => {
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

This is the first test where we cannot fake it. We need to add behaviour to our code instead of returning hardcoded values (`"123   "`).

We need to deal with 3 changes: 

1. Store the button inputs
2. Handle the 6 character return requirement.
3. Ignore KEY and LOCK

The last one is a matter of discipline. It is tempting to _code ahead_, but the case do not test KEY or LOCK, so any code we add to handle this could challenge our test isolation. 

If you cannot imagine refactoring to pass the test and/or think handling the KEY and LOCK cases are more important, then just write tests for and implement that. Remember TDD principles 2 and 5: _pick the test that will teach you the most about the implementation and start with the most obvious implementation_.

## Iteration 3: KEY input resets input
Ok, now we know a bit more about the implementation and can start tackling one of the state-related requirements. According to user story 1 and 2, the user need to initiate code entry with the KEY key. If the user forgets this, they get an error. 

The user story does not say anything about what happens if the user press KEY multiple times or press KEY, a digit, and then a KEY. Intuitively, we start by assuming that code entry is _initiated_ and _reset_ every time the user press KEY.

This leads to at least 2 test cases:

- Enter (KEY, 1, KEY, 3) gives “3     ”. Safe locked.
- Enter (1) gives “ERROR ”. Safe locked.

Lets begin with the first one:

<details>
  <summary>Hint: Enter (KEY, 1, KEY, 3) gives “3     ”. Safe locked.</summary>
  
  ```
  test<TestContext>('Enter (KEY, 1, KEY, 3) gives “3     ”. Safe locked.', ({safe}) => {
      safe.enter(Button.KEY)
      safe.enter(Button.D1)
      safe.enter(Button.KEY)
      safe.enter(Button.D3)
      expect(safe.readDisplay()).toBe('3     ');
  })
  ```
</details>

_Why don't we go back and implement the KEY behaviour for the two previous tests?_ We use the first two test to support this test. If we solve this test, then the previous should pass as well. 

## Iteration 4: Forgetting KEY gives error
Now we implement the second part of the KEY behaviour test. 

<details>
  <summary>Hint: Enter (1) gives “ERROR ”. Safe locked.</summary>
  
  ```
  test<TestContext>('Enter (1) gives “ERROR ”. Safe locked.', ({safe}) => {
      safe.enter(Button.D1)
      expect(safe.readDisplay()).toBe('ERROR ');
  })
  ```
</details>

## Iteration 5: Unlock safe
The next step is to implement opening the safe. This will start adding some real logic to the Safe class. Start by implementing the test case.

<details>
  <summary>Hint: Enter (KEY,1,2,3,4,5,6) gives "OPEN "".</summary>

  ```
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
  ```
</details>

## Iteration 6: Entering the wrong code
If the user enters the wrong code, then the display will be reset ("      ") and the safe will remain locked. Let us add a test for entering the wrong code:

<details>
  <summary>Hint: Enter (KEY,1,2,4,3,5,6) gives "CLOSED".</summary>

  ```
    test<TestContext>('Enter (KEY,1,2,4,3,5,6) gives "CLOSED".', ({safe}) => {
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
  ```
</details>

## Iteration 7: Locking the safe
In this case we get everything from user story 2:

**Lock Safe:** _The safe door is unlocked. The display reads "OPEN  ". The user closes the door and presses the lock button. The door locks. The display reads "CLOSED"._

Lets make a test that checks all those stages. 

<details>
  <summary>Hint: Unlock safe: Enter (KEY,1,2,3,4,5,6) gives "OPEN ". Safe unlocked. Enter (LOCK) gives "CLOSED". Safe locked.</summary>

  ```
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
  ```
</details>

## Iteration 8: Additional tests
Once again, working with the code have provided some inspiration for additional tests. We want to make sure that some of the states work as expected when happening after each other:

- Entering the wrong code followed by a digit should give "ERROR "
- Locking safe followed by a digit should give "ERROR "
- Unlock safe followed by a digit should give "ERROR "

The last one is a bit unclear from the requirements. Should the "ERROR " state lock the safe when it is unlocked? We assume it should, just to be _safe_.

## Summary: what testing gives us
Now we have an adequate set of unit tests for our Hotel Safe. The full lists of tests and the reference implementation is in the `solutions` branch. With out tests we get the following benefits.

### Tests to guide future implementations
We did not implement test or code for user story 5 on setting a new code for the safe. Now we have a good foundation for continuing the implementation and making sure that the extension do not break the existing code. That is an important feature of TDD and unit tests.

Depending on the current implementation, we may also want to refactor our code. Perhaps our solution is spaghetti code that defies all best-practices and style guides. This is something we can fix and use the tests to guide us. The current implementation also suggest a state-based implementation (KEY, LOCK, PIN), so if there is a more elegant and readable implementation, we can try that out with the tests as a safety blanket. The same goes for optimization ideas etc.

The process of working with TDD also facilitate additional knowledge about the features and implementation. Tests not only invite us to think about a solution, but also analyse and review edge-cases and states where the code might break or behave unexpectedly. That is not something coding without tests provide.

Finally, with tests we get a robust tool for debugging and do quality assurance as the codebase grows. With TDD we invest time up front to mitigate having to invest significant more time debugging and maintaining the code based at a later point.
