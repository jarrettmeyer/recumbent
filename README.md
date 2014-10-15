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

### Inserting a document

To insert a document, create an instance of a `Writer`.

``` javascript
var writer = new recumbent.Writer({ server: server });
var obj = {
  message: "Hello, World!"
};
writer.data(obj).exec(function (error, result) {
  if (error) {
    throw error;
  }
  console.log("Success! ID: " + result.id);
  console.log("   Revision: " + result.rev);
});
```

### Updating a document

Updating a document is identical to inserting a document. The only difference is that
updated documents must have `_rev` attribute. Use the `data()` function to set the
data to be sent to the server.

``` javascript
var writer = new recumbent.Writer({ server: server });
var obj = {
  _id: '04bb33dc698297b4806062feae00cb93',
  _rev: '1-4439af2c7634656dc6f6397eb4c2259b',
  message: "Déjà vu"
};
writer.data(obj).exec(function (error, result) {
  if (error) {
    throw error;
  }
  console.log("Success! ID: " + result.id);
  console.log("   Revision: " + result.rev);
});
```

### Querying for a document by ID

To query for documents, create a new instance of the `Query` object. Use the `id()`
function to set the ID to fetch.

``` javascript
var query = new recumbent.Query({ server: server });
query.id('04bb33dc698297b4806062feae00cb93').exec(function (error, result) {
  if (error) {
    throw error;
  }
  console.log("      ID: " + result._id);
  console.log("Revision: " + result._rev);
});
```

### Creating a design document

Design documents are not different from any other type of document in Couch. Therefore,
creating design documents is the same as creating any other document.

``` javascript
var designDocument = {
  _id: '_design/employees',
  description: 'All views and filters related to employee data.'
  views: {
    all: function (doc) {
      if (doc.type === 'employee') {
        emit(doc._id, doc);
      }
    }.toString()
  },
  language: 'javascript'
};
var writer = new recumbent.Writer(options);
writer.data(designDocument).exec(function (error, result) {
  console.log("      OK: ", result.ok);
  console.log("Revision: ", result.rev);
});
```

Once created, you may query a view with `key`, `startkey`, `endkey`, `skip`, and
`limit` options.

``` javascript
var query = new recumbent.Query(options);

// query a view
query.designDocument('employees').view('all').exec(callback);

// query a view by key
query.designDocument('employees').view('all').key('123-45-6789').exec(callback);

// query a view by startkey and endkey
query.designDocument('employees').view('all').startkey('200-00-0000').endkey('299-99-9999').exec(callback);

// query a view by skip and limit
query.designDocument('employees').view('all').skip(100).limit(20).exec(callback);
```

## Features Coming "Soon"

+ Add attachments to documents.
