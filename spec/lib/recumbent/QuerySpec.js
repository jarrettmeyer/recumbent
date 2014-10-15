var Database = require('../../../lib/recumbent/Database');
var Query = require('../../../lib/recumbent/Query');
var Server = require('../../../lib/recumbent/Server');
var Writer = require('../../../lib/recumbent/Writer');

describe('Query', function () {

  var database, docCount = 0, doneFunc, options, writeCount = 0;

  describe('Get document by ID', function () {

    beforeEach(function (done) {
      docCount = 1;
      writeCount = 0;
      doneFunc = done;
      createDatabase(function (error, result) {
        insertDocument({ _id: 'my-test', field: 'value' }, onWrite);
      });
    });

    afterEach(function (done) {
      destroyDatabase(function (error, result) {
        done();
      });
    });

    it('can fetch a document by id', function (done) {
      var query = new Query(options);
      query.id('my-test').exec(function (error, result) {
        if (error) {
          done(error);
        }
        expect(result._id).toEqual('my-test');
        expect(result._rev).toMatch(/^1\-/);
        expect(result.field).toEqual('value');
        done();
      });
    });

  });

  describe('Get documents by key', function () {

    beforeEach(function (done) {
      doneFunc = done;
      docCount = 11;
      writeCount = 0;
      createDatabase(function (error, result) {
        for (var i = 0; i < 10; i += 1) {
          insertDocument({ value: i }, onWrite);
        }
        insertDocument(getView(), onWrite);
      });
    });

    afterEach(function (done) {
      destroyDatabase(function (error, result) {
        done();
      });
    });

    it('can get documents by view', function (done) {
      var query = new Query(options);
      query.designDocument('all_docs').view('all_values').key(2).exec(function (error, result) {
        if (error) {
          console.error(error);
          done(error);
        }
        expect(result.total_rows).toEqual(10);
        expect(result.rows.length).toEqual(1);
        expect(result.rows[0].key).toEqual(2);
        done();
      });
    });

  });

  describe('Get documents by view', function () {

    beforeEach(function (done) {
      doneFunc = done;
      docCount = 11;
      writeCount = 0;
      createDatabase(function (error, result) {
        for (var i = 0; i < 10; i += 1) {
          insertDocument({ value: i }, onWrite);
        }
        insertDocument(getView(), onWrite);
      });
    });

    afterEach(function (done) {
      destroyDatabase(function (error, result) {
        done();
      });
    });

    it('can get documents by view', function (done) {
      var query = new Query(options);
      query.designDocument('all_docs').view('all_values').exec(function (error, result) {
        if (error) {
          console.error(error);
          done(error);
        }
        expect(result.total_rows).toEqual(10);
        expect(result.rows.length).toEqual(10);
        done();
      });
    });

  });

  function createDatabase(callback) {
    setTimeout(function () {
      options = { url: 'http://localhost:5984', database: 'query_testing' };
      database = new Database(options);
      database.create(callback);
    }, 1);
  }

  function destroyDatabase(callback) {
    setTimeout(function () {
      database.destroy(callback);
    }, 1);
  }

  function getView() {
    return {
      _id: '_design/all_docs',
      views: {
        all_ids: {
          map: function (doc) {
            emit(doc._id, null);
          }.toString()
        },
        all_values: {
          map: function (doc) {
            emit(doc.value, null);
          }.toString()
        }
      }
    };
  }

  function insertDocument(doc, callback) {
    setTimeout(function () {
      var writer = new Writer(options);
      writer.data(doc).exec(callback);
    }, 1);
  }

  function onWrite(error, result) {
    if (error) {
      doneFunc(error);
    }
    writeCount += 1;
    if (writeCount === docCount) {
      doneFunc();
    }
  }

});
