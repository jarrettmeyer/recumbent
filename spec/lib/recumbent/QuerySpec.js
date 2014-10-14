var Database = require('../../../lib/recumbent/Database');
var Query = require('../../../lib/recumbent/Query');
var Server = require('../../../lib/recumbent/Server');
var Writer = require('../../../lib/recumbent/Writer');

describe('Query', function () {

  var database, server;

  beforeEach(function (done) {
    server = new Server({ url: 'http://localhost:5984', database: 'query_testing' });
    database = new Database({ server: server });
    done();
  });

  afterEach(function (done) {
    database.destroy(function (error, result) {
      done();
    });
  });

  describe('Get document by ID', function () {

    beforeEach(function (done) {
      database.destroy(function (error, result) {
        database.create(function (error, result) {
          (new Writer({ server: server })).data({ _id: 'my-test', field: 'value' }).exec(function (error, result) {
            done(error);
          });
        });
      });
    });

    it('can fetch a document by id', function (done) {
      var query = new Query({ server: server });
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

  describe('Get documents by view', function () {

    var docCount = 0, doneFunc;

    beforeEach(function (done) {
      doneFunc = done;
      database.destroy(function (error, result) {
        database.create(function (error, result) {
          for (var i = 0; i < 10; i += 1) {
            var doc = {
              _id: i.toString(),
              value: i
            };
            (new Writer({ server: server })).data(doc).exec(onWrite);
          }
          var view = {
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
          (new Writer({ server: server })).data(view).exec(onWrite);
        });
      });
    });

    it('can get a view by id', function (done) {
      done();
      // query.id('_design/all_docs/_view/all_ids').exec(function (error, result) {
      //   if (error) {
      //     done(error);
      //   }
      //   expect(result.total_rows).toEqual(10);
      //   done();
      // });
    });

    xit('can get documents by view', function (done) {
      done();
      // (new Query({ server: server }))
      //     .designDocument('all_docs')
      //     .view('all_values')
      //     .exec(function (error, result) {
      //   if (error) {
      //     console.error(error);
      //     done(error);
      //   }
      //   expect(result.total_rows).toEqual(10);
      //   done();
      // });
    });

    function onWrite(error, result) {
      if (error) {
        doneFunc(error);
      }
      docCount += 1;
      if (docCount === 11) {
        doneFunc();
      }
    }

  });

});
