# Node.js Global Storage

[![npm version](https://badge.fury.io/js/node-global-storage.svg)](https://badge.fury.io/js/node-global-storage)

Node module for **global scope variable managing** and storing data making it accessible in multiple Javascript files. Using `node-global-storage`, there is no need to pass arguments forward and backward inside callbacks and lose track of your content through your Node application.

## Installation

```
npm install --save node-global-storage
```

## API Methods



## Usage

### Get/Set

`node-global-storage` has embedded blueprints for saving and retrieving data from the global storage using the internationally extended methods `.set()` and `.get()`.

```
globals = require('node-global-storage');

globals.set('hello', 'Greetings!');
var hello = globals.get('hello');

console.log(hello); // => 'Greetings!'
```
### List

You can list all variables currently stored at `node-global-storage` with the method `.list()`.

```
globals = require('node-global-storage');

globals.set('one', 1);
globals.set('two', false);
globals.set('three', '33333');

var all = globals.list();

console.log(all);         // => {one: 1, two: false, three: '33333'}
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

Deletes a variable from the global storage providing the name of it.

```
globals = require('node-global-storage');

globals.set('OMG', 'Delete me, please!');

var omg = globals.get('OMG');
console.log(omg);               // => 'Delete me, please!'

globals.unset('OMG');
omg = globals.get('OMG');
console.log(omg);               // => null
```
