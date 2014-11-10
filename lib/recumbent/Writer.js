var Server = require('./Server');
var _util = require('./util');

module.exports = (function () {

  function Writer(options) {
    options = options || {};
    this.server = options.server || new Server({ url: options.url, database: options.database });
    this._id = null;
    this._rev = null;
  }

  Writer.prototype.data = function (data) {
    this._data = data;
    this._id = data.id || data._id;
    this._rev = data._rev;
    return this;
  };

  Writer.prototype.exec = function (callback) {
    var deferred = _util.getDeferred();
    var method = this.isUpdate() ? 'PUT' : 'POST';
    var path = this.isUpdate() ? '/' + this._id : '';
    this.server.request({
      method: method,
      path: path,
      data: (this._data || {}),
      success: function (result) {
        handleWriterSuccess(callback, result, deferred);
      },
      error: function (err) {
        handleWriterError(callback, err, deferred);
      }
    });
    return deferred.promise;
  };

  Writer.prototype.isUpdate = function () {
    // If the data has a revision, then it is considered to be an update. If the
    // object being written does not have a revision, then it should be considered
    // an insert.
    return this._rev;
  };

  function handleWriterError(callback, error, deferred) {
    deferred.reject(new Error(error));
    _util.invokeCallback(callback, error, null);
  }

  function handleWriterSuccess(callback, result, deferred) {
    if (result.error) {
      handleWriterError(callback, result.error, deferred);
    } else {
      deferred.resolve(result);
      _util.invokeCallback(callback, null, result);
    }
  }

  return Writer;

})();
