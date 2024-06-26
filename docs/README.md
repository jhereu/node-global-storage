# Node Global Storage 💾

![NPM Version](https://img.shields.io/npm/v/node-global-storage)
[![Test Workflow](https://github.com/jhereu/node-global-storage/actions/workflows/Test.yml/badge.svg)](https://github.com/jhereu/node-global-storage/actions/workflows/Test.yml)
[![Publish Workflow](https://github.com/jhereu/node-global-storage/actions/workflows/Publish.yml/badge.svg)](https://github.com/jhereu/node-global-storage/actions/workflows/Publish.yml)


**Global data storage manager for Node.js**. Make data accessible across your JavaScript and TypeScript files without worrying about multiple imports.

## What's new in version 3.x? 🚀

This package was rewritten again from scratch. The exposed API is _almost_ the same as 2.x but further improved for clarity and performance.

- Extended TypeScript types 💙
- ESModules support (`import` syntax)
- Zero dependencies
- Full JSDoc documentation for all methods with examples for inline editor docs!
- More exhaustive testing with 100% coverage!
- Refactor of some methods from 2.0

## Install

<!-- tabs:start -->
#### **NPM**
```bash
npm install --save node-global-storage
```

#### **Yarn**
```bash
yarn add node-global-storage
```

#### **PNPM**
```bash
pnpm add node-global-storage
```
<!-- tabs:end -->

## Import

This package can be imported both as CommonJS or ESModule:

<!-- tabs:start -->
#### **ESModule (Import)**
```typescript
import { getValue, setValue } from "node-global-storage";
```

#### **CommonJS (require)**
```typescript
const { getValue, setValue } = require("node-global-storage");
```

<!-- tabs:end -->


## API Methods

| Method                                                                                         | Options type                           | Return type                            | Description                                                  |
| ---------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| [`setValue<T>(key: string, value: T, options?: SetOptions)`](?id=get-and-set-values)           | [`SetOptions`](?id=setoptions)         | `T`                                    | Sets the value for a given key in the global storage         |
| [`getValue<T>(key: string)`](?id=get-and-set-values)                                           |                                        | `T`                                    | Returns the value for the given key name                     |
| [`getAllValues()`](?id=list-values-and-metadata)                                               |                                        | `Record<string, unknown>`              | Returns all stored values                                    |
| [`getMetadata<T>(key: string)`](?id=get-and-set-values)                                        |                                        | [`StorageItem<T>`](?id=storageitem)    | Returns the full StorageItem object of the provided key name |
| [`getAllMetadata()`](?id=list-values-and-metadata)                                             |                                        | `Record<string, StorageItem<T>>`       | Returns all stored metadata                                  |
| [`isSet(key: string)`](?id=isset-isprotected)                                                  |                                        | `boolean`                              | Checks if a key has been set                                 |
| [`isProtected(key: string)`](?id=isset-isprotected)                                            |                                        | `boolean`                              | Checks if a key is protected                                 |
| [`unsetValue(key: string, options?: UnsetOptions)`](?id=unset-flush)                           | [`UnsetOptions`](?id=unsetoptions)     | `void`                                 | Removes the value for a given key in the global storage      |
| [`flush(options?: FlushOptions)`](?id=unset-flush)                                             | [`FlushOptions`](?id=flushoptions)     | `void`                                 | Removes all stored values                                    |
| [`setDefaultOption(key: keyof DefaultOptions, value: DefaultOptions[T])`](?id=default-options) | [`DefaultOptions`](?id=defaultoptions) | `void`                                 | Sets the default option for all transactions                 |
| [`getDefaultOptions()`](?id=default-options)                                                   |                                        | [`DefaultOptions`](?id=defaultoptions) | Returns the default options                                  |
| [`resetDefaultOptions()`](?id=default-options)                                                 |                                        | `void`                                 | Resets the default options to the initial default values     |

## Interfaces

### StorageItem<T>

Internal data structure for stored data. It is returned by `getMetadata(key: string)` and `getAllMetadata()`.

| Key         | Type                                                  | Description                                       |
| ----------- | ----------------------------------------------------- | ------------------------------------------------- |
| `value`     | `T`                                                   | Stored value                                      |
| `protected` | `boolean`                                             | Protect the value from being deleted if set again |
| `createdAt` | `Date`                                                | Date of creation of the key/value pair            |
| `updatedAt` | `Date`                                                | Date of the last update of the key/value pair     |
| `onUpdate?` | `<T>(key: string, newValue: T, oldValue?: T) => void` | Callback to execute when the value is updated     |
| `onDelete?` | `<T>(key: string, value: T) => void`                  | Callback to execute when the value is deleted     |

### DefaultOptions

Default options for all transactions. They can be modified by `setDefaultOption(key: keyofDefaultOptions, value: DefaultOptions[T])`.

| Key                                  | Type                                                  | Description                                                              |
| ------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `silent`                             | `boolean`                                             | Do not execute the onUpdate or onDelete callback of previous data if set |
| `force`                              | `boolean`                                             | Force the update of the value even if it is protected                    |
| `protected`                          | `boolean`                                             | Protect the value from being deleted if set again                        |
| `onUpdate?: StorageItem["onUpdate"]` | `<T>(key: string, newValue: T, oldValue?: T) => void` | Callback to execute when the value is updated                            |
| `onDelete?: StorageItem["onDelete"]` | `<T>(key: string, value: T) => void`                  | Callback to execute when the value is deleted                            |

### SetOptions

Available options when calling `setValue<T>(key: string, value: T, options?: SetOptions)`.

| Key         | Type                                                  | Description                                                              |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `value`     | `T`                                                   | Stored value                                                             |
| `protected` | `boolean`                                             | Protect the value from being deleted if set again                        |
| `silent`    | `boolean`                                             | Do not execute the onUpdate or onDelete callback of previous data if set |
| `force`     | `boolean`                                             | Force the update of the value even if it is protected                    |
| `onUpdate?` | `<T>(key: string, newValue: T, oldValue?: T) => void` | Callback to execute when the value is updated                            |
| `onDelete?` | `<T>(key: string, value: T) => void`                  | Callback to execute when the value is deleted                            |

### UnsetOptions

Available options when calling `unsetValue(key: string, options?: UnsetOptions)`.


| Key      | Type      | Description                                                              |
| -------- | --------- | ------------------------------------------------------------------------ |
| `silent` | `boolean` | Do not execute the onUpdate or onDelete callback of previous data if set |

### FlushOptions

Available options when calling `flush()`.


| Key      | Type      | Description                                                              |
| -------- | --------- | ------------------------------------------------------------------------ |
| `silent` | `boolean` | Do not execute the onUpdate or onDelete callback of previous data if set |

## Usage Examples

> ⚠️ `getMetadata` and `getAllMetadata` both return the core package object reference. Don't edit it directly if you don't want to break anything!

### Get and set values

```typescript
import { getValue, setValue, getMetadata } from "node-global-storage";

setValue("hello", "Greetings!", { protected: true });
let hello = getValue("hello"); // => 'Greetings!'

const updateCallback = (key, value) =>
  console.log(`${key} was updated to ${value}`);

// Protected values cannot be overwritten...
setValue("hello", "What's up!", { onUpdate: updateCallback });
hello = getValue("hello"); // => "Greetings!"

// ...unless `options.force` is set to `true`
setValue("hello", "This is a forced value", { force: true });
// => "This is a forced value"

hello = getValue("hello"); // => "This is a forced value"

const metadata = getMetadata("hello"); // { value: "This is a forced value", createdAt: Date, updatedAt: Date, protected: false, onUpdate: updateCallback, onDelete: undefined }
```

### List values and metadata

```typescript
import { getAllValues, getMetadata, setValue } from 'node-global-storage';

setValue('one', 1, { protected: true });
setValue('two', false, { forced: true });
setValue('three', '33333', { onUpdate: someCallbackFunction });

const allValues = getAllValues();
// => {
//      one: 1,
//      two: false,
//      three: '33333'
//    }

var allMetadata = getAllMetadata();
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
import { setValue, getValue, unsetValue, flush } from "node-global-storage";

const deleteCallback = (key, value) => console.log(`Key ${key} was deleted`);

setValue("key1", "This is a value");

let value = getValue("key1"); // => "This is a value"

unsetValue("key1");

value = getValue("key1"); // => undefined
```

### Default options

```typescript
getDefaultOptions(); // { protected: false, force: false, onUpdate: undefined, onDelete: undefined, silent: false }

setDefaultOption("protected", true);

getDefaultOptions(); // { protected: true, force: false, onUpdate: undefined, onDelete: undefined, silent: false }

const key1 = "myKey1";
const value1 = "myValue1";

setValue(key1, value1);

const isKey1Protected = isProtected(key1); // true

resetDefaultOptions();

const key2 = "myKey2";
const value2 = "myValue2";

setValue(key2, value2);

const isKey2Protected = isProtected(key2); // false

const defaultOptions =

resetDefaultOptions();

getDefaultOptions(); // { protected: false, force: false, onUpdate: undefined, onDelete: undefined, silent: false }
```

