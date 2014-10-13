var url = require('url');

var DB = (function () {

  function DB(options) {
    options = options || {};
    this.url = url.parse(options.url || 'http://localhost:5984');
    this.database = options.database || 'test';
  }

  return DB;

})();

module.exports = DB;
