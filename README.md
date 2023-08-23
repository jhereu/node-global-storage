# Node.js Global Storage 2

[![npm version](https://badge.fury.io/js/node-global-storage.svg)](https://badge.fury.io/js/node-global-storage)

**Global data storage manager for Node.js**. It generates getters and setters and makes data accessible across multiple Javascript and TypeScript files.

## What's new in 2.x? 🚀

This package was entirely rewritten for a new major release after 6 years. The exposed API is _almost_ the same as 1.x but adapted to modern times and modern Javascript.

- Native TypeScript support! 💙
- ESModules support (`import` syntax)
- Zero dependencies! - More lightweight than ever: **23 kB**
- No need to `require` the module in _every_ single file where it is used
- Refactored `default(key, value)` to `defaultOption(key, value)`
- Refactored `list(extended)` to `list(options)`
- Tests 🤖

## Installation

```bash
# NPM
npm install --save node-global-storage

# Yarn
yarn add node-global-storage
```

## Importation

This package can be imported both as Commonjs and ESModules:

```typescript
// All methods in a single object- The most retrocompatible option
const globals = require("node-global-storage"); // Commonjs
import globals from "node-global-storage"; // ESModule

// Only used methods - The most optimal option
const { get, set } = require("node-global-storage");
import { get, set } from "node-global-storage";
```

## API Methods

| Method                       | Return type    | Description                                                                                                   |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `.defaultOption(key, value)` | `undefined`    | Override default specific options for all transactions.                                                       |
| `.set(key, value, options)`  | `typeof value` | Stores data with a given key name and returns the stored value.                                               |
| `.get(key)`                  | `any`          | Returns the value of the provided key name.                                                                   |
| `.list(options)`             | `Object`       | Returns all stored data so far. If passed `{extended: true}`, returns also specific options for the given key |
| `.isSet(key)`                | `boolean`      | Checks if a key exists. If existed but already deleted, returns `false`.                                      |
| `.isProtected(key)`          | `boolean`      | Checks if a key was stored with protection (cannot delete except if `force:true` is specified).               |
| `.flush(options)`            | `undefined`    | Deletes all stored data.                                                                                      |
| `.unset(key, options)`       | `undefined`    | Deletes the data stored with the given name (key).                                                            |

## Parameters

There are some methods that admit an optional `options` parameter. **This parameter is always an Object**. If a certain parameter is not specified inside the method, then the default behaviour of the module is taken. To change the default behaviour of a parameter, use `default(parameter, value)`.

| Parameter   | Default     | Description                                                                                                                                                                        |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `protected` | `false`     | If a key is protected, it won't be overriden unless `force: true` is specified.                                                                                                    |
| `force`     | `false`     | If a transaction is forced, it will ignore the `protected` parameter.                                                                                                              |
| `onUpdate`  | `undefined` | If a callback function is specified, then it's triggered when the value of a give key changes. The provided function always has two arguments: `function (key, value, oldValue?)`. |
| `onDelete`  | `undefined` | If a callback function is specified, then it's triggered when the given key is deleted. The provided function always has two arguments: `function (key, value)`.                   |
| `silent`    | `false`     | If a transaction is silent, then no callback is triggered (`onUpdate`, `onDelete`).                                                                                                |

## Usage Examples

### Get / Set

```typescript
import { get, set } from "node-global-storage";

set("hello", "Greetings!", { protected: true });
let hello = get("hello"); // => 'Greetings!'

const updateCallback = (key, value) =>
  console.log(`${key} was updated to ${value}`);

// Protected values cannot be overwritten...
set("hello", "What's up!", { onUpdate: updateCallback });
hello = get("hello"); // => "Greetings!"

// ...unless `force` is set to `true`
set("hello", "This is a forced value", { force: true });
// => "This is a forced value"

hello = get("hello"); // => "This is a forced value"
```

### List

⚠️ List with `extended: true` returns the core package object reference. Do not edit it directly if you dont want to break anything.

```TypeScript
import { list, set } from 'node-global-storage';

set('one', 1, { protected: true });
set('two', false, { forced: true });
set('three', '33333', { onUpdate: someCallbackFunction });

const all = list();
// => {
//      one: 1,
//      two: false,
//      three: '33333'
//    }

var allWithDetails = list({ extended: true });
// => {
//      one: {value: 1, protected: true, forced: false, onUpdate: null, onDelete: null, createdAt: Date, updatedAt: Date },
//      two: {value: false, protected: false, forced: true, onUpdate: null, onDelete: null, createdAt: Date, updatedAt: Date },
//      three: {value: '33333', protected: false, forced: false, onUpdate: doSomeCrazyThing, onDelete: null, createdAt: Date, updatedAt: Date }
//    }
```

### isSet / isProtected

```typescript
import { isSet, isProtected } from "node-global-storage";

set("key1", "This is a protected key", { protected: true });

const isKey1Set = isSet("key1"); // => true
const isKey2Set = isSet("key2"); // => false
const isKey1Protected = isProtected("key1"); // => true
const isKey2Protected = isProtected("key2"); // => false
```

### Unset / flush

```typescript
import { set, get, unset, flush } from "node-global-storage";

const deleteCallback = (key, value) => console.log(`Key ${key} was deleted`);

set("key1", "This is a value");

let value = get("key1"); // => "This is a value"

unset("key1");

value = get("key1"); // => undefined
```

## MIT License

Copyright (c) 2017 Jordi Hereu Mayo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
