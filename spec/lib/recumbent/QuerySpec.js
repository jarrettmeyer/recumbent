var Database = require('../../../lib/recumbent/Database');
var Query = require('../../../lib/recumbent/Query');
var Writer = require('../../../lib/recumbent/Writer');

describe('Query', function () {

  var database, query, server;

  beforeEach(function (done) {
    database = new Database({ url: 'http://localhost:5984', database: 'query_testing' });
    server = database.server;
    database.create(function (error, result) {
      done(error);
    });
    query = new Query({ server: server });
  });

  afterEach(function (done) {
    database.destroy(function (error, result) {
      done(error);
    });
  });

  describe('Get document by ID', function () {

    beforeEach(function (done) {
      var writer = new Writer({ server: server });
      writer.data({ _id: 'my-test', field: 'value' }).exec(function (error, result) {
        done(error);
      });
    });

    it('can fetch a document by id', function (done) {
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

});
