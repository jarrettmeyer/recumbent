var QueryUtil = require('./QueryUtil');
var Server = require('./Server');
var _util = require('./util');

module.exports = (function () {

  function Query(options) {
    options = options || {};
    this.server = options.server || new Server(options);
    this._queryOptions = {};
    this._queryUtil = new QueryUtil(this);
  }

  Query.prototype.clearQueryTerms = function () {
    this._doc = null;
    this._ddoc = null;
    this._view = null;
    this._queryOptions = {};
  };

  Query.prototype.ddoc = function (value) {
    this._ddoc = value;
    return this;
  };

  Query.prototype.doc = function(value) {
    this._doc = value;
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
          _util.invokeCallback(callback, result, null);
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
    if (this._doc) {
      path += this._doc;
      return path;
    }
    if (this._ddoc) {
      path += '_design/' + this._ddoc;
      if (this._view) {
        path += '/_view/' + this._view;
        path += this._queryUtil.addQueryOptionsToView();
      }
      return path;
    }
    return path;
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

  return Query;

})();
