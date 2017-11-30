![node-global-storage](http://jordiher.eu/images/node-global-storage-image2.png)

# Node.js Global Storage

[![npm version](https://badge.fury.io/js/node-global-storage.svg)](https://badge.fury.io/js/node-global-storage) [![Join the chat at https://gitter.im/node-global-storage/Lobby](https://badges.gitter.im/node-global-storage/Lobby.svg)](https://gitter.im/node-global-storage/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Node module for **global scope variable managing** and storing data making it accessible in multiple Javascript files. Using `node-global-storage`, there is no need to pass arguments forward and backward inside callbacks and lose track of your content through your Node application.

## Installation

```
npm install --save node-global-storage
```

## Initialization 

This module has to be loaded inside every Javascript file in which it's going to be used. It will store the same data even if it's required in different parts of your code. Initialization goes as follows:
```
var globals = require('node-global-storage');
```
Once `globals` is initialized, all API methods are available, even with the previously saved data in another file.

## API Methods

`node-global-storage` has embedded blueprints for saving and retrieving data from the global storage using international keywords such as `get`, `set` or `list`.

| Method | Output | Description | Example |
| ------------- | ------------- | ------------- | ------------- | 
| `.set(key, name)` | `undefined` | Stores data (value) with a given name (key).  | `globals.set('hello', 'Hey there!');` |
| `.get(key)` | `*`| Returns the value of the provided key name. Supports recursive search. | `globals.get('user.telephones.cell');` |
| `.list()` | `Object` | Returns the value of the provided key name.  | `globals.list();` |
| `.unset()` | `undefined` | Deletes the data stored with the given name (key). | `globals.unset('hello');` |
| `.isSet(key)` | `boolean` | Checks if a key was stored with some data and returns a predicate.  | `globals.isSet('hello');` |
| `.flush()` | `undefined` | Deletes all stored data. | `globals.flush();` |

## Extended usage

### Get/Set

```
globals = require('node-global-storage');

globals.set('hello', 'Greetings!');
var hello = globals.get('hello'); // => 'Greetings!'

var user = {
   telephones: {
      cell: '+1 123-123-45670',
      home: '+1 000-111-33333'
   }
};

globals.set('user', user);
var cell = globals.get('user.telephones.cell); // => '+1 123-123-45670'
```
### List

You can list all variables currently stored at `node-global-storage` with the method `.list()`.

```
globals = require('node-global-storage');

globals.set('one', 1);
globals.set('two', false);
globals.set('three', '33333');

var all = globals.list();  // => {one: 1, two: false, three: '33333'}
```

### isSet

Check if a variable is already stored inside your global storage. Returns a predicate.

```
globals = require('node-global-storage');

globals.set('respect', 'Have some, little boy!');

var hasRespect = globals.isSet('respect');    // => true
var hasMoney = globals.isSet('money');        // => false
```

### Unset

Deletes a variable from the global storage providing the name of it. `flush` has the same effect but with all stored variables.

```
globals = require('node-global-storage');

globals.set('OMG', 'Delete me, please!');

var omg = globals.get('OMG'); // => 'Delete me, please!'
globals.unset('OMG');
omg = globals.get('OMG');     // => undefined
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
