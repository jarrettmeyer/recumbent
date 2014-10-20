var querystring = require('querystring');

module.exports = (function () {

  function QueryUtil(query) {
    this._query = query;
  }

  QueryUtil.prototype.addQueryOptionsToView = function () {
    var path = '';
    var queryString = querystring.stringify(this._query._queryOptions);
    if (queryString) {
      path += '?' + queryString;
    }
    return path;
  };

  return QueryUtil;

})();