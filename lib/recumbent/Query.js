var Server = require('./Server');
var _util = require('./util');

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
          _util.invokeCallback(callback, result.error, null);
        } else {
          _util.invokeCallback(callback, null, result);
        }
      },
      error: function (error) {
        _util.invokeCallback(callback, error, null);
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
        path = addQueryOptionsToView.call(this, path);
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

  Query.prototype.limit = function (value) {
    this._queryOptions.limit = value;
    return this;
  };

  Query.prototype.skip = function (value) {
    this._queryOptions.skip = value;
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

  function addQueryOptionsToView(path) {
    var keys = Object.keys(this._queryOptions);
    if (keys.length > 0) {
      var queryString = buildQueryString.call(this, keys);
      path += '?' + queryString;
    }
    return path;
  }

  function buildQueryString(keys) {
    var queries = [];
    keys.forEach(function (key) {
      queries.push(key + '=' + this._queryOptions[key]);
    }, this);
    var queryString = queries.join('&');
    return queryString;
  }

  return Query;

})();
