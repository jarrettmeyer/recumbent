var Server = require("./Server");

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
    var method = this.isUpdate() ? 'PUT' : 'POST';
    var path = this.isUpdate() ? '/' + this._id : '';
    this.server.request({
      method: method,
      path: path,
      data: (this._data || {}),
      success: function (result) {
        if (result.error) {
          callback(result, null);
        } else {
          callback(null, result);
        }
      },
      error: function (err) {
        callback(err, null);
      }
    });
    return this;
  };

  Writer.prototype.isUpdate = function () {
    /* If the data has a revision, then it is considered to be an update. If the
     * object being written does not have a revision, then it should be considered
     * an insert. */
    return this._rev;
  };

  return Writer;

})();
