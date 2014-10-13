var Server = require('./Server');

module.exports = (function () {

  function Database(options) {
    options = options || {};
    this.server = options.server || new Server({ url: options.url, database: options.database });
    this.name = this.server.database;
  }

  Database.prototype.create = function (callback) {
    this.server.request(getRequestOptions('PUT', callback));
  };

  Database.prototype.destroy = function (callback) {
    this.server.request(getRequestOptions('DELETE', callback));
  };

  Database.prototype.getInfo = function (callback) {
    this.server.request(getRequestOptions('GET', callback));
  };

  function getRequestOptions(method, callback) {
    return {
      method: method,
      success: function (result) {
        if (result.error) {
          callback(result, null);
        } else {
          callback(null, result);
        }
      },
      error: function (error) {
        callback(error, null);
      }
    };
  }

  return Database;

})();