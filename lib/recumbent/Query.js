var Server = require('./Server');

module.exports = (function () {

  function Query(options) {
    options = options || {};
    this.server = options.server || new Server(options);
    this._queryOptions = {};
  }

  Query.prototype.clearQueryTerms = function () {
    this._id = null;
    this._designDocument = null;
    this._view = null;
    this._queryOptions = {};
  };

  Query.prototype.designDocument = function (designDocument) {
    this._designDocument = designDocument;
    return this;
  };

  Query.prototype.endkey = function (value) {
    this._queryOptions.endkey = value;
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
        var keys = Object.keys(this._queryOptions);
        if (keys.length > 0) {
          var queries = [];
          keys.forEach(function (key) {
            queries.push(key + '=' + this._queryOptions[key]);
          }, this);
          var queryString = queries.join('&');
          path += '?' + queryString;
        }
      }
      return path;
    }
    return path;
  };

  Query.prototype.id = function(id) {
    this._id = id;
    return this;
  };

  Query.prototype.key = function (value) {
    this._queryOptions.key = value;
    return this;
  };

  Query.prototype.startkey = function (value) {
    this._queryOptions.startkey = value;
    return this;
  };

  Query.prototype.view = function (view) {
    this._view = view;
    return this;
  };

  return Query;

})();
