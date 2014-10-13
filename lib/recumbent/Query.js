var Server = require('./Server');

module.exports = (function () {

  function Query(options) {
    options = options || {};
    this.server = options.server || new Server(options);
  }

  Query.prototype.exec = function (callback) {
    this.server.request({
      method: 'GET',
      path: this.getPath(),
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
    });
    return this;
  };

  Query.prototype.id = function(id) {
    this._id = id;
    return this;
  };

  Query.prototype.getPath = function () {
    var path = '/';
    if (this._id) {
      path += this._id;
      return path;
    }
    return path;
  };

  return Query;

})();
