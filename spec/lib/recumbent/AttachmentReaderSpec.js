var fs = require('fs');
var recumbent = require('../../..');

describe('AttachmentReader', function () {

  var database, docId, options, server;

  beforeEach(function (done) {
    setOptions();
    database = new recumbent.Database({ server: server });
    database.create(function (error, result) {
      expect(result.ok).toEqual(true);
      var writer = new recumbent.Writer({ server: server });
      var content = fs.readFileSync('README.md', 'base64');
      var doc = getDocument(content);
      writer.data(doc).exec(function (error, result) {
        expect(result.ok).toEqual(true);
        done(error);
      });
    });
  });

  afterEach(function (done) {
    database.destroy(function (error, result) {
      if (error) {
        done(error);
      }
      expect(result.ok).toEqual(true);
      done();
    });
  });

  it('can get an attachment', function (done) {
    var reader = new recumbent.AttachmentReader(options);
    reader.id(docId).name('README.md').exec(function (error, result) {
      if (error) {
        done(error);
      } else {
        expect(result).toMatch('^# recumbent');
        done();
      }
    });
  });

  function getDocument(content) {
    return {
      _id: docId,
      message: 'Hello, World!',
      timestamp: Date.now(),
      _attachments: {
        'README.md': {
          'content_type': 'text\/plain',
          'data': content
        }
      }
    };
  }

  function setOptions() {
    docId = '12345';
    options = {
      database: 'recumbent_attachment_tests',
      url: 'http://localhost:5984',
      server: null
    };
    server = new recumbent.Server(options);
    options.server = server;
    return options;
  }

});