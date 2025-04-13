# Contract testing with Vitest

In this short tutorial, we will go through a practical example of _contract testing_ with Vitest.

_Contract testing_ is a testing methodology used to verify the interfaces between one or more systems. It can be considered integration testing. The focus is on testing the API _contract_ agreed upon in the specification of an API. Contract testing can be useful in the following cases:

- **Dependency:** When there is a close coupling and dependency between one or more systems on the data structure and/or data types exposed by the API
- **Versioning:** When an API has multiple versions and/or changes significantly between releases
- **Test-driven Development:** When an API has not yet been developed fully, but there is an agreed upon specification that act as a contract between development teams. 
- **Migration:** If an API is being changed and/or migrated, contract testing helps ensure consistency
- **Risk management:** When a API dependency is considered a significant risk in a project and the developers need the capability to rapidly test if the API is broken

Contract testing is very useful as a quick point-of-testing prior to implementing a feature that depends on an API and/or as a first test to run when bugs are reported. 

In the following we will setup a Vitest project for contract testing up agains an existing API. We assume that you have some familiarity with unit testing, TDD, Vitest and TypeScript. If not, consult some of the other guides before proceeding.

## Setting up
The code for the first part of this is accessible in the basic project in this folder. 

We will be using Vitest to setup contract tests. Follow the installation guide at [Vitest](https://vitest.dev/guide/) to setup Vitest as a dependency:

```
    npm install -D vitest
```

## Creating the first test
The Vitest documentation show how to create a function (sum(a,b)) and then creating a test that verifies there result. When we do contract testing, we use external services as our 'function' and it makes sense to create our test contracts under a name that reflects the API we are testing. So if we are testing [Fake rest Users](https://fakerestapi.azurewebsites.net/api/v1/Users/1'), then lets create a `user.test.ts` file:

```
//basic/user.test.ts
import { expect, test} from 'vitest'

test('Test user is null', () => {
    const user = null;
    expect(user).toBeNull()
})

```

No surprises in the above. 

Now we need to fetch some data for our test. Let us imagine that we are testing if we can get data from the [Fake Rest API](https://fakerestapi.azurewebsites.net/index.html). We need to call the API and transform the result into json:

```
    fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    .then(res => res.json())
    .then(console.log);
```

When we write tests that call async functionality, we need to wrap everything in async/await calls. A test for fetching data looks like this:

```
//basic/user.test.ts
import { expect, test } from 'vitest'

test('Dummy User API accessible', async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data = await res.json()

    expect(data).toBeDefined()
})

```

Now we have the first test that check that the User API is accessible. 

## Testing data structure contract
When doing contract testing, we want to make sure that the data we get follow the specification. Using APIs and JSON often introduce `unknown` and `any` types into our code. Then it is our task to check the individual types and structure of the data with _type guards_. (If only Typescript had a stronger type safe system at runtime, then we would unmarshall the `any` data into our type structs like in Go, Java and C#). 

We will use the library [zod](https://zod.dev/) to validate and parse the JSON representation of the User from the API. Zod allow us to write our own type guard for the User type:

```
//basic/src/types/user.ts
import { z } from "zod";

export interface User {
    id?:number;
    userName?:string;
    password?:string;
}

const zUser = z.object({
  id: z.number().int().optional(),
  userName: z.union([
        z.string(),
        z.null()
  ]).optional(),
  password: z.union([
      z.string(),
      z.null()
  ]).optional()
});
```

We create a Zod schema of our object with restrictions that are evaluated when we try to parse data into the `zUser`. For example, from the [User schema](https://fakerestapi.azurewebsites.net/index.html), we know that `User.id` is a number (int) and optional. We also know that `User.userName` is a string OR null.

This allow us to add a small function that effectively check if the data fit the specification. If not, the `zUser.parse(data)` function will throw an error.

```
//basic/src/types/user.ts
...

export const parseUser = (data:any):User => {
  const user = zUser.parse(data);
  return user as User;
}
```

Let us put this to test:

```
//basic/user.test.ts

test('Check User return type', async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data:object = await res.json();
    expect(() => parseUser(data)).toBeDefined();
})

```

We can also check how this behaves by adding a test that try to parse incompatible data into a User:

```
//basic/user.test.ts

test('Check User return type - fail example', () => {
    const data:object = {id:"1"}
    expect(() => parseUser(data)).toThrowError(ZodError);
})

```

## Contract testing with generated types and validators
Writing Zod schemas for validating out code quickly become tedious. If an API exposes OpenAPI definitions as a OpenAPI schema, we can use [Hey API](https://heyapi.dev/) to generate a lot of utilities that can help us:

- Types
- JSON schema
- SDK Fetch client (and Nuxt/Next/Axios clients)
- Zod schemas

We start by downloading the OpenAPI schema from out [Fake Rest API](https://fakerestapi.azurewebsites.net/swagger/v1/swagger.json) and save the file as schema in the schema folder. 

In the generated project in this folder, we install `npm -i @hey-api/client-fetch @hey-api/openapi-ts zod` and then create a `openapi-ts.config.ts` file to help us generate the stuff we need:

```
//generated/openapi-ts.config.ts

/** @type {import('@hey-api/openapi-ts').UserConfig} */
module.exports = {
  input: 'schema/schema.json',
  output: 'src/client.gen',
  plugins: ['@hey-api/typescript', 'zod', '@hey-api/client-fetch', {
    name: '@hey-api/sdk',
    validator: true,
  },],
};
```

The config file tells `openapi-ts` to take the schema from `schema/schema.json` and generate a fetch client file, Typescript types, and Zod schema. It will also add Zod validation to the Fetch client. The output is placed in `src/client.gen` (.gen to indicate it is generated code) with the following files: 

- client.gen.ts: Exporting the SDK client
- sdk.gen.ts: API specifications as a SDK
- types.gen.ts: All the API types
- zod.gen.ts: All the Zod schemas for validation
- index.ts: A `client.gen` folder export file.

Before we can use the zod.gen.ts in our tests, we need to add the Zod schemas to `client.gen/index.ts` file (the default exports are only types and sdk):

```
// This file is auto-generated by @hey-api/openapi-ts
export * from './types.gen';
export * from './sdk.gen';
export * from './zod.gen';
export * from './client.gen';
```

Finally, we need to add the generation script to out `package.json`:
```
//generated/package.json

"scripts": {
    "test": "vitest",
    "generate": "openapi-ts"
}
```

Now we can generate all out models with `npm run generate`.

This allow us to use the types, client and zod schema in our tests:

```
//generated/user.test.ts
import { expect, test, beforeAll } from 'vitest'
import {zUser, getApiV1Users, getApiV1UsersById} from "./client.gen";
import { ZodError } from 'zod';

import { client } from './client.gen';

beforeAll(async () => {
    client.setConfig({
        baseUrl: 'https://fakerestapi.azurewebsites.net',
    });
})

test('Test user is null', () => {
    const user = null;
    expect(user).toBeNull()
})

test('Dummy User API accessible', async () => {
    const { data, error } = await getApiV1Users({});

    expect(error).toBeUndefined()
    expect(data).toBeDefined();
})
```

Notice, that we use `beforeAll` to setup the client with the `baseUrl` for each test. The test above will fetch all users and check if we get data without errors. 

```
//generated/user.test.ts
test('Check User return type', async () => {
    const { data, error } = await getApiV1UsersById({
        path: {
            id:1
        }
    });

    expect(error).toBeUndefined()
    expect(data).toBeDefined();
    expect(() => zUser.parse(data)).toBeDefined();
})
```

This test will fetch a user with id=1 and check that we can parse it into the zUser type guard.

There are cases where generated types and type guards are ideal, but if we have more strict needs than what is defined by the API, then we need to write our own type guards. E.g. if we depend on a property that is optional and want to reject data if that is not fulfilled. 

## Benchmarking
Performance is also an important part of the contract. If we need to render data in components somewhere, then the [Doherty Threshold](https://lawsofux.com/doherty-threshold/) give us a total budget around **400 ms**. A lot can be managed by utilizing _caching_ and improved rendering techniques in the frontend. However, if specific data is required to be updated within a specified threshold, it is nice to be able to check that the API adheres to the contract. Benchmarking can also be a great debugging tool to identify perfomance issues, cold starts, peak etc.

Let's say that we split the 400ms budget into 200ms for fetching and 200ms for rendering. Then we can add that threshold as an option to our tests:

```
//basic/user.test.ts

test('Check user within allotted time',{timeout:200}, async () => {
    const res = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users/1')
    const data:object = await res.json();
    expect(() => parseUser(data)).toBeDefined();
})

```
If the test do not complete within 200ms it will fail. 

However, this test only runs once and is a poor benchmark for the performance of the API. Instead of adding additional runs to the test, we can use the built in [benchmark features of Vitest](https://vitest.dev/api/#bench). Benchmarking is not testing. In Vitest it is a separate feature. We need to add a script to `package.json`:

```
//benchmark/package.json

"scripts": {
    "bench": "vitest bench"
},
```

Vitest will look for files with `*.bench.ts` and run these as part of the benchmark. Now we can add our first benchmark. 

```
//benchmark/user.bench.ts
import { bench } from 'vitest'

bench('Dummy User API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Users')
})

bench('Dummy Author API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Authors')
})

bench('Dummy Book API benchmark', async () => {
    await fetch('https://fakerestapi.azurewebsites.net/api/v1/Books')
})

```

The above will benchmark the three endpoints for Users, Authors, and Books from the Fake Rest API. It will run each benchmark 10 times (default) and provide performance statistics for min, max, mean and percentiles.



