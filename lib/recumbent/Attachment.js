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
    this._method = 'GET';
    this._filter = applyGetFilter;
    this._doc = null;
    this._name = null;
  }

  Attachment.prototype.accept = function (accept) {
    this._accept = accept;
    return this;
  };

  Attachment.prototype.data = function (value) {
    this._data = value;
    return this;
  };

  Attachment.prototype.contentType = function (value) {
    this._contentType = value;
    return this;
  };

  Attachment.prototype.doc = function (value) {
    this._doc = value;
    return this;
  };

  Attachment.prototype.exec = function (callback) {
    var path = '/' + this._doc + '/' + this._name;
    if (this._rev) {
      path += '?rev=' + this._rev;
    }
    var requestOpts = {
      method: this._method,
      path: path,
      accept: this._accept,
      contentType: this._contentType || 'text/plain',
      data: this._data,
      filter: this._filter,
      success: function (result) {
        callback(null, result);
      },
      error: function (error) {
        callback(error, null);
      }
    };
    this._server.request(requestOpts);
    return this;
  };

  Attachment.prototype.get = function () {
    this._method = 'GET';
    this._filter = applyGetFilter;
    return this;
  };

  Attachment.prototype.name = function (value) {
    this._name = value;
    return this;
  };

  Attachment.prototype.put = function () {
    this._method = 'PUT';
    this._filter = applyPutFilter;
    return this;
  };

  Attachment.prototype.rev = function (rev) {
    this._rev = rev;
    return this;
  };

  function applyGetFilter(s) {
    return s;
  }

  function applyPutFilter(s) {
    return JSON.parse(s);
  }

  return Attachment;

})();