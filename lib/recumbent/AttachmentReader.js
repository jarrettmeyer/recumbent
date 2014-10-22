var Server = require('./Server');

module.exports = (function () {

  /**
   * Get an attachment.
   * @constructor
   */
  function Attachment(options) {
    options = options || {};
    this._server = options.server || new Server(options);
    this._accept = '';
  }

  Attachment.prototype.accept = function (accept) {
    this._accept = accept;
    return this;
  };

  Attachment.prototype.exec = function (callback) {
    var path = '/' + this._id + '/' + this._name;
    this._server.request({
      method: 'GET',
      path: path,
      accept: this._accept,
      filter: function (response) {
        return response;
      },
      success: function (result) {
        callback(null, result);
      },
      error: function (error) {
        callback(error, null);
      }
    });
    return this;
  };

  Attachment.prototype.id = function (id) {
    this._id = id;
    return this;
  };

  Attachment.prototype.name = function (name) {
    this._name = name;
    return this;
  };

  return Attachment;

})();