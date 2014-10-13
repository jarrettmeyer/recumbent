var Server = require('../../../lib/recumbent/Server');

describe('Server', function () {

  var server;

  it('can get server info', function (done) {
    server = new Server();
    server.getInfo(function (error, result) {
      expect(result.couchdb).toEqual('Welcome');
      done(error);
    })
  });

  it('has a database property', function () {
    server = new Server({ url: 'http://www.google.com:5984', database: 'junk' });
    expect(server.database).toEqual('junk');
  });

  it('has a url property', function () {
    server = new Server({ url: 'http://www.google.com:5984', database: 'junk' });
    expect(server.url.hostname).toEqual('www.google.com');
    expect(server.url.port).toEqual('5984');
  });

});
