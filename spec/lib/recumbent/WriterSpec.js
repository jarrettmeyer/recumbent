var Database = require('../../../lib/recumbent/Database');
var Server = require('../../../lib/recumbent/Server');
var Writer = require('../../../lib/recumbent/Writer');

describe('Writer', function () {

  var database, doc, server, writer;

  beforeEach(function (done) {
    server = new Server({ url: 'http://localhost:5984', database: 'writer_test' });
    database = new Database({ server: server });
    writer = new Writer({ server: server });
    doc = { _id: 'hello', to: 'world' };
    database.create(function (error, result) {
      if (error) {
        console.error(error);
        done(error);
      } else {
        done();
      }
    });
  });

  afterEach(function (done) {
    database.destroy(function (error, result) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });

  describe('insert', function () {

    it('can insert a new design document', function (done) {
      var doc = {
        _id: '_design/insert_design_test',
        description: 'this is a test',
        views: {
          all_ids: {
            map: function (doc) {
              emit(doc._id, null);
            }.toString()
          }
        }
      };
      writer.data(doc).exec(function (error, result) {
        if (error) {
          console.error(error);
          done(error);
        } else {
          expect(result.id).toEqual('_design/insert_design_test');
          expect(result.rev).toMatch(/^1\-/);
          done();
        }
      });
    });

    it('can insert a new record', function (done) {
      writer.data(doc).exec(function (error, result) {
        if (error) {
          console.error(error);
          done(error);
        } else {
          expect(result.id).toEqual('hello');
          expect(result.rev).toMatch(/^1\-/);
          done();
        }
      });
    });

  });

  describe('isUpdate', function () {

    it('is false by default', function () {
      expect(writer.isUpdate()).toBeFalsy();
    });

    it('is false when data does not have a _rev attribute', function () {
      expect(writer.data({ id: '1' }).isUpdate()).toBeFalsy();
    });

    it('is true when data has a _rev attribute', function () {
      expect(writer.data({ _rev: '1' }).isUpdate()).toBeTruthy();
    });

  });

  describe('update', function () {

    beforeEach(function (done) {
      writer.data(doc).exec(function (error, result) {
        if (error) {
          done(error);
        }
        doc._rev = result.rev;
        expect(result.rev).toMatch(/^1\-/);
        done();
      });
    });

    it('can update an existing record', function (done) {
      doc.sentAt = Date.now();
      writer.data(doc).exec(function (error, result) {
        if (error) {
          done(error);
        }
        expect(result.id).toMatch('hello');
        expect(result.rev).toMatch(/^2\-/);
        done();
      });
    });

  });

});
