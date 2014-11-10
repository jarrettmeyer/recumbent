var q = require('q');

module.exports = {

  getDeferred: function () {
    return q.defer();
  },

  invokeCallback: function (callback, error, result) {
    return (this.isFunction(callback)) ? callback(error, result) : null;
  },

  isFunction: function (f) {
    return f && typeof f === 'function';
  }

};
