# recumbent [![Build Status](https://travis-ci.org/jarrettmeyer/recumbent.svg?branch=master)](https://travis-ci.org/jarrettmeyer/recumbent)

**recumbent** is a [Couch DB](http://couchdb.apache.org/) client for [Node.js](http://nodejs.org/).

## Usage

To use **recumbent**, install the library for your application.

```
$ npm install recumbent
```

### Connecting to a server

``` javascript
var recumbent = require('recumbent');
var server = new recumbent.Server({ url: 'http://localhost: 5984', database: 'my_stuff' });
server.getInfo(function (error, result) {
  /* Put your code here. */
});
```

In all classes, you may either pass a `Server` object or `url` and `database` attributes.

### Creating a new database

``` javascript
var recumbent = require('recumbent');
var database = new recumbent.Database({ url: 'http://localhost:5984', database: 'my_stuff' });
database.create(function (error, result) {
  /* Put your code here. Result = { ok: true } */
});
```

### Destroying a database

``` javascript
var recumbent = require('recumbent');
var database = new recumbent.Database({ url: 'http://localhost:5984', database: 'my_stuff' });
database.destroy(function (error, result) {
  /* Put your code here. Result = { ok: true } */
});
```
