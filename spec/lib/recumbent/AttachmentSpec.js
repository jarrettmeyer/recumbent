var fs = require('fs');
var recumbent = require('../../..');

describe('Attachment', function () {

  var database, docId, options, server, writer;

  beforeEach(function () {
    setOptions();
    database = new recumbent.Database(options);
  });

  afterEach(function (done) {
    database.destroy(function () {
      done();
    })
  });

  it('can add an attachment to a document', function (done) {
    database = new recumbent.Database(options);
    database.create(function (error, result) {
      expect(result.ok).toEqual(true);
      writer = new recumbent.Writer(options);
      writer.data({ description: 'test adding an attachment to a document' }).exec(function (error, result) {
        if (error) {
          console.error(error);
          done(error);
        } else {
          docId = result.id;
          expect(result.ok).toEqual(true);
          expect(result.id).toEqual(docId);
          expect(result.rev).toMatch(/^1\-/);
          var attachment = new recumbent.Attachment(options);
          expect(attachment).toBeDefined();
          var content = fs.readFileSync('./README.md', { encoding: 'utf8' });
          expect(typeof content).toEqual('string');
          attachment.doc(docId).name('README.md').rev(result.rev).contentType('text/plain').data(content).put();
          attachment.exec(function (error, result) {
            if (error) {
              done(error);
            } else {
              expect(result.ok).toEqual(true);
              expect(result.id).toEqual(docId);
              expect(result.rev).toMatch(/^2\-/);
              done();
            }
          });
        }
      });
    });
  });

  it('can get an existing attachment', function (done) {
    database.create(function (error, result) {
      expect(result.ok).toEqual(true);
      writer = new recumbent.Writer(options);
      var doc = { _id: docId, description: 'test get attachment' };
      writer.data(doc).exec(function (error, result) {
        expect(result.ok).toEqual(true);
        var revision = result.rev;
        var att = new recumbent.Attachment(options);
        var content = fs.readFileSync('./README.md', { encoding: 'utf8' });
        expect(content.length > 0).toEqual(true);
        att.doc(docId).name('README.md').rev(revision).contentType('text/plain').data(content).put();
        att.exec(function (error, result) {
          if (error) {
            done(error);
          } else {
            expect(result.ok).toEqual(true);
            expect(result.id).toEqual(docId);
            var getAtt = new recumbent.Attachment(options);
            getAtt.doc(docId).name('README.md');
            getAtt.exec(function (error, result) {
              expect(result).toMatch(/^# recumbent/);
              done();
            });
          }
        });
      });
    });
  });

  function setOptions() {
    docId = '12345';
    options = {
      database: 'recumbent_attachment_tests',
      url: 'http://localhost:5984'
    };
    server = new recumbent.Server(options);
    options.server = server;
    return options;
  }

});