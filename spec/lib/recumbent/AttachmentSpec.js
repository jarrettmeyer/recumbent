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

  //it('can add an attachment to a document', function (done) {
  //  database = new recumbent.Database(options);
  //  database.create(function (error, result) {
  //    expect(result.ok).toEqual(true);
  //    writer = new recumbent.Writer(options);
  //    writer.data({ _id: docId, type: 'tester' }).exec(function (error, result) {
  //      if (error) {
  //        console.error(error);
  //        done(error);
  //      } else {
  //        expect(result.ok).toEqual(true);
  //        expect(result.id).toEqual(docId);
  //        expect(result.rev).toMatch(/^1\-/);
  //        var attachment = new recumbent.Attachment(options);
  //        expect(attachment).toBeDefined();
  //        var content = fs.readFileSync('./README.md', { encoding: 'base64' });
  //        expect(typeof content).toEqual('string');
  //        done();
  //      }

        //  console.log('here');
        //  console.error(error);
        //  console.log(result);
        //  database.destroy(function (error, result) {
        //    expect(result.ok).toEqual(true);
        //    done();
        //  });
        //});
  //    });
  //  });
  //});

  //it('can get an attachment', function (done) {
  //  var reader = new recumbent.Attachment(options);
  //  reader.docId(docId).name('README.md').exec(function (error, result) {
  //    if (error) {
  //      done(error);
  //    } else {
  //      expect(result).toMatch('^# recumbent');
  //      done();
  //    }
  //  });
  //});

  //function getDocument(content) {
  //  return {
  //    _id: docId,
  //    message: 'Hello, World!',
  //    timestamp: Date.now(),
  //    _attachments: {
  //      'README.md': {
  //        'content_type': 'text\/plain',
  //        'data': content
  //      }
  //    }
  //  };
  //}

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