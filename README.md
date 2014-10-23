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
  // result = { couchdb: "welcome", version: "1.6.1", ... }
});
```

In all classes, you may either pass a `Server` object or `url` and `database`
attributes.

### Creating a new database

``` javascript
var recumbent = require('recumbent');
var database = new recumbent.Database({ url: 'http://localhost:5984', database: 'my_stuff' });
database.create(function (error, result) {
  // result = { ok: true }
});
```

### Destroying a database

``` javascript
var recumbent = require('recumbent');
var database = new recumbent.Database({ url: 'http://localhost:5984', database: 'my_stuff' });
database.destroy(function (error, result) {
  // result = { ok: true }
});
```

### Inserting a document

To insert a document, create an instance of a `Writer`.

``` javascript
var recumbent = require("recumbent");
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

Updating a document is identical to inserting a document. The only difference
is that updated documents must have a `_rev` attribute. Use the `data()` function
to set the data to be sent to the server.

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

Attempting to write a document with a duplicate ID but without giving a revision
will result in an error.

### Querying for a document by ID

To query for documents, create a new instance of the `Query` object. Use the `doc()`
function to set the document ID to fetch.

``` javascript
var query = new recumbent.Query({ server: server });
query.doc('04bb33dc698297b4806062feae00cb93').exec(function (error, result) {
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

Once the document has been created, you can query with the `ddoc()` and `view()`
functions. Queries may be augmented with  `key`, `startkey`, `endkey`, `skip`, and
`limit` options.

``` javascript
var query = new recumbent.Query(options);

// query a view
query.ddoc('employees').view('all').exec(callback);

// query a view by key
query.ddoc('employees').view('all').key('123-45-6789').exec(callback);

// query a view by startkey and endkey
query.ddoc('employees').view('all').startkey('200-00-0000').endkey('299-99-9999').exec(callback);

// query a view by skip and limit
query.ddoc('employees').view('all').skip(100).limit(20).exec(callback);
```

### Adding an attachment to a document

Attachments can be added to existing documents in two ways.

First, add the `_attachments` attribute to an existing document and write the document
as described above.

``` javascript
var recumbent = require("recumbent");

var docWithAttachment = {
  description: "This document has an attachment.",
  _attachments: {
    "test.txt": {
      content_type: "text/plain",
      data: "VGhpcyBpcyBteSB0ZXh0IGRvY3VtZW50"
    }
  }
};

var writer = new recumbent.Writer(options);
writer.data(docWithAttachment).exec(callback);
```

As with other updates, if the document is existing, then it must have a `_rev` attribute.

Second, use the `Attachment` object to put a new attachment on an existing document.

``` javascript
var recumbent = require("recumbent");

var att = new recumbent.Attachment(options);
att.doc(someDocId).name(someAttachmentName).rev(revision);
att.contentType("text/plain").content(attachmentContent).put();
att.exec(callback);
```

### Getting an attachment

``` javascript
var recumbent = require("recumbent");

var att = new recumbent.Attachment(options);
att.doc(someDocId).name(someAttachmentName).exec(function (error, result) {
  // result = your document content
});
```

## Development

### Running Tests

```
$ npm test
```
