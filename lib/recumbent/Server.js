var http = require('http');
var url = require('url');
var _util = require('./util');

var Server = (function () {

  function Server(options) {
    options = options || {};
    this.url = url.parse(options.url || 'http://localhost:5984');
    this.database = options.database || 'test';
  }

  /**
   * Get server info.
   * @param callback - Callback to invoke upon completion of the request.
   */
  Server.prototype.getInfo = function (callback) {
    this.request({
      skipDatabase: true,
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
  };

  /**
   * Send a request to the server.
   * @param args - Arguments that define the request.
   * @returns {*}
   */
  Server.prototype.request = function (args) {
    var opts = getRequestOptions.call(this, args);
    var request = http.request(opts, function (response) {
      handleResponse(response, args);
    });
    request.on('error', function (err) {
      args.error(err);
    });
    if (args.data && typeof args.data === 'object') {
      request.write(JSON.stringify(args.data));
    }
    request.end();
    return request;
  };

  function getPath(args) {
    var path = '/';
    if (args.skipDatabase) {
      return path;
    }
    path += this.database + (args.path || '');
    return path;
  }

  function getRequestOptions(args) {
    var opts = {
      method: (args.method || 'GET'),
      hostname: this.url.hostname,
      port: this.url.port,
      path: getPath.call(this, args),
      headers: { }
    };
    if (args.method === 'POST' || args.method === 'PUT') {
      opts.headers['Content-Type'] = 'application/json';
    }
    if (args.accept) {
      opts.headers.Accept = args.accept;
    }
    return opts;
  }

  function handleResponse(response, args) {
    var filter = args.filter || function (o) {
      return JSON.parse(o);
    };
    var result = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      result += chunk;
    });
    response.on('end', function () {
      args.success(filter(result));
    });
  }

  return Server;

})();

module.exports = Server;
