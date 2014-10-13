var DB = require('../../../lib/recumbent/DB');

describe('DB', function () {

  var db;

  it('has a url property', function () {
    db = new DB({ url: 'http://www.google.com:5984', database: 'junk' });
    expect(db.url.hostname).toEqual('www.google.com');
    expect(db.url.port).toEqual('5984');
  });

});
