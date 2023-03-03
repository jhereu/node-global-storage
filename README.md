![node-global-storage](http://jordiher.eu/images/node-global-storage-image2.png)

# Node.js Global Storage

[![NPM](https://nodei.co/npm/node-global-storage.png)](https://nodei.co/npm/node-global-storage/)

[![npm version](https://badge.fury.io/js/node-global-storage.svg)](https://badge.fury.io/js/node-global-storage) [![Join the chat at https://gitter.im/node-global-storage/Lobby](https://badges.gitter.im/node-global-storage/Lobby.svg)](https://gitter.im/node-global-storage/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Node module for **global scope variable managing** and storing data making it accessible in multiple Javascript files. Using `node-global-storage`, there is no need to pass arguments forward and backward inside callbacks and lose track of your content through your Node application.

![global-variables-meme](http://jordiher.eu/images/global_variables_meme1.jpg)

## Installation

```bash
npm install --save node-global-storage
```

## Initialization 

This module has to be loaded inside every Javascript file in which it's going to be used. It will store the same data even if it's required in different parts of your code. Initialization goes as follows:
```javascript
var globals = require('node-global-storage');
```
Once `globals` is initialized, all API methods are available, even with the previously saved data in another file.

## API Methods

`node-global-storage` has embedded blueprints for saving and retrieving data from the global storage using international keywords such as `get`, `set` or `list`.

| Method | Output | Description |
| ------------- | ------------- | ------------- |
| `.default(key, value)` | `undefined` | Override default behavioural option for all transactions without specific options. |
| `.set(key, value, options)` | `undefined` | Stores data with a given key name.  |
| `.get(key)` | `*`| Returns the value of the provided key name. |
| `.list(detailed)` | `Object` | Returns all stored data so far. If passed `true`, returns also specific options for the given key  |
| `.flush(options)` | `undefined` | Deletes all stored data. |
| `.isSet(key)` | `boolean` | Checks if a key exists. If existed but already deleted, returns `false`. |
| `.isProtected(key)` | `boolean` | Checks if a key was stored with protection (cannot delete except if `force:true` is specified). |
| `.unset(key, options)` | `undefined` | Deletes the data stored with the given name (key). |

## Parameters

There are some methods that admit an optional `options` parameter. **This parameter is always an Object**. If a certain parameter is not specified inside the method, then the default behaviour of the module is taken. To change the default behaviour of a parameter, use `globals.default(parameter, value)`.

| Parameter | Default | Description |
| ------------- | ------------- | ------------- |
| `verbose` | `false` | Defines whether or not the module should print information through the console. |
| `protection` | `false` | If a key is protected, it won't be overriden unless `force: true` is specified. |
| `force` | `false` | If a transaction is forced, it will ignore the `protection` parameter. |
| `onUpdate` | `undefined` | If a callback function is specified, then it's triggered when the value of a give key changes. The provided function always has two arguments: `function (key, value)`. |
| `onDelete` | `undefined` | If a callback function is specified, then it's triggered when the given key is deleted. The provided function always has two arguments: `function (key, value)`. |
| `silent` | `false` | If a transaction is silent, then no callback is triggered (`onUpdate`, `onDelete`). |

## Examples of use

### Get / Set
Examples of `get` and `set` usage, using `protection`, `force` and the `onUpdate` callback.
```javascript
globals = require('node-global-storage');

let hello;

globals.set('hello', 'Greetings!', {protection: true});
hello = globals.get('hello'); // => 'Greetings!'

const updateCallback = function (key, value) {
   console.log("Oh my, '%s' is not '%s' anymoar...", key, value);
};

globals.set('hello', "What's up, bro!", {onUpdate: updateCallback});
hello = globals.get('hello'); // => 'Greetings!'

globals.set('hello', "BOOM! It seems like you got FORCED.", {force: true});
// => "Oh my, 'Greetings!' is not 'What's up, bro!' anymoar..."

hello = globals.get('hello'); // => 'You got forced!'
```
### List
Examples on how to list stored data with or without details.
```javascript
globals = require('node-global-storage');

globals.set('one', 1, {protection: true});
globals.set('two', false, {forced: true});
globals.set('three', '33333', onUpdate: doSomeCrazyThing});

const all = globals.list(); 
// => {
//      one: 1,
//      two: false,
//      three: '33333'
//    }

const allWithDetails = globals.list(true);
// => {
//      one: {value: 1, protection: true, forced: false, onUpdate: null, onDelete: null},
//      two: {value: false, protection: false, forced: true, onUpdate: null, onDelete: null},
//      three: {value: '33333', protection: false, forced: false, onUpdate: doSomeCrazyThing, onDelete: null}
//    }
```
### isSet / isProtected
Check if a variable is already stored inside your global storage and is protected.
```javascript
globals = require('node-global-storage');

globals.set('respect', 'Have some, little boy!', {protection: true});

const hasRespect = globals.isSet('respect');              // => true
const hasMoney = globals.isSet('money');                  // => false
const protectedRespect = globals.isProtected('respect');  // => true
const protectedMoney = globals.isProtected('money');      // => false
```

### Unset / flush
The method `unset` deletes a variable from the global storage providing the name of it. `flush` has the same effect but with all stored variables. 
```javascript
globals = require('node-global-storage');

const deleteCallback = function (key, value) {
   return console.log('At last I am complete.');
};

globals.set('OMG', 'Delete me, please!', {onDelete: deleteCallback});
globals.set('PLS', 'Not today...', {protection: true});

let omg = globals.get('OMG');   // => 'Delete me, please!'
// => 'At last I am complete.'

globals.unset('OMG');
omg = globals.get('OMG');       // => undefined
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
