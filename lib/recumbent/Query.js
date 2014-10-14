var Server = require('./Server');

module.exports = (function () {

  function Query(options) {
    options = options || {};
    this.server = options.server || new Server(options);
  }

  Query.prototype.clearQueryTerms = function () {
    this._id = null;
    this._designDocument = null;
    this._view = null;
  };

  Query.prototype.designDocument = function (designDocument) {
    this._designDocument = designDocument;
    return this;
  };

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
    this.clearQueryTerms();
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
    if (this._designDocument) {
      path += '_design/' + this._designDocument;
      if (this._view) {
        path += '/_view/' + this._view;
      }
      return path;
    }
    return path;
  };

  Query.prototype.view = function (view) {
    this._view = view;
    return this;
  };

  return Query;

})();
