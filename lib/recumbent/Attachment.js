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
  }

  Attachment.prototype.accept = function (accept) {
    this._accept = accept;
    return this;
  };

  Attachment.prototype.contentType = function (value) {
    this._contentType = value;
    return this;
  };

  Attachment.prototype.docId = function (docId) {
    this._docId = docId;
    return this;
  };

  Attachment.prototype.exec = function (callback) {
    var path = '/' + this._docId + '/' + this._name;
    var requestOpts = {
      method: this._method,
      path: path,
      accept: this._accept,
      contentType: this._contentType || 'text/plain',
      ifMatch: this._rev,
      filter: function (r) {
        return r;
      },
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

  Attachment.prototype.name = function (name) {
    this._name = name;
    return this;
  };

  Attachment.prototype.put = function () {
    this._method = 'PUT';
    return this;
  };

  Attachment.prototype.rev = function (rev) {
    this._rev = rev;
    return this;
  };

  return Attachment;

})();