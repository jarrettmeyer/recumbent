var Database = require('../../../lib/recumbent/Database');

describe('Database', function () {

  var database;

  beforeEach(function () {
    database = new Database({ url: 'http://localhost:5984', database: 'recumbent_test' });
  });

  afterEach(function (done) {
    database.destroy(function (error, result) {
      done();
    });
  });

  it('can create a database', function (done) {
    database.create(function (error, result) {
      if (error) {
        done(error);
      }
      expect(result.ok).toEqual(true);
      done();
    });
  });

  it('can destroy a database', function (done) {
    database.create(function (error, result) {
      if (error) {
        done(error);
      }
      database.destroy(function (error, result) {
        if (error) {
          done(error);
        }
        expect(result.ok).toEqual(true);
        done();
      });
    });
  });

  it('can get database info', function (done) {
    database.create(function (error, result) {
      database.getInfo(function (error, result) {
        if (error) {
          done(error);
        }
        expect(result.db_name).toEqual('recumbent_test');
        done();
      })
    });
  })

  it('has a name attribute', function () {
    expect(database.name).toEqual('recumbent_test');
  })

});
