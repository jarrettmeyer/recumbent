var http = require('http');
var url = require('url');

var Server = (function () {

  function Server(options) {
    options = options || {};
    this.url = url.parse(options.url || 'http://localhost:5984');
    this.database = options.database || 'test';
  }

  Server.prototype.getPath = function (args) {
    var path = '/';
    if (args.skipDatabase) {
      return path;
    }
    path += this.database + (args.path || '');
    return path;
  };

  Server.prototype.getInfo = function (callback) {
    this.request({
      skipDatabase: true,
      success: function (result) {
        if (result.error) {
          callback(result, null);
        } else {
          callback(null, result);
        }
      },
      error: function (error) {
        callback(error, null);
      }
    });
  };

  Server.prototype.request = function (args) {
    var opts = {
      method: (args.method || 'GET'),
      hostname: this.url.hostname,
      port: this.url.port,
      path: this.getPath(args),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };
    var req = http.request(opts, function (res) {
      var result = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', function () {
        args.success(JSON.parse(result));
      });
    });
    req.on('error', function (err) {
      args.error(err);
    });
    if (args.data) {
      req.write(data);
    }
    req.end();
    return req;
  };

  return Server;

})();

module.exports = Server;
