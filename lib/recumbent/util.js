module.exports = (function () {

  function invokeCallback(callback, error, result) {
    return (isFunction(callback)) ? callback(error, result) : null;
  }

  function isFunction(f) {
    return f && typeof f === 'function';
  }

  return {
    invokeCallback: invokeCallback,
    isFunction: isFunction
  }

})();
