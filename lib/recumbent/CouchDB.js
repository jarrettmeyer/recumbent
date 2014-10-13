// var http = require('http');
// var url = require('url');
//
// var CouchDB = (function () {
//
//   function CouchDB(options) {
//     options = options || {};
//     this.url = url.parse(options.url || 'http://localhost:5984');
//     this.database = options.database || 'test';
//   }
//
//   CouchDB.prototype.addDesignDocument = function (doc, callback) {
//     doc._id = '_design/' + (doc.id || doc._id);
//     return this.create(doc, callback);
//   };
//
//   CouchDB.prototype.addView = function (options, callback) {
//     var id = options.id || options._id;
//     if (!id.match(/^_design/)) {
//       id = '_design/' + id;
//     }
//     return this.get(id, function (error, result) {
//       if (error) {
//         return callback(error, null);
//       }
//       if (!result.views) {
//         result.views = {};
//       }
//       result.views[options.name] = {};
//       if (options.map) {
//         result.views[options.name]['map'] = options.map.toString();
//       }
//       if (options.reduce) {
//         result.views[options.name]['reduce'] = options.reduce.toString();
//       }
//       return this.update(result, callback);
//     }.bind(this));
//   };
//
//   CouchDB.prototype.create = function (doc, callback) {
//     return save({
//       db: this,
//       method: 'POST',
//       data: doc,
//       callback: callback
//     });
//   };
//
//   CouchDB.prototype.createDB = function (callback) {
//     return request({
//       db: this,
//       method: 'PUT',
//       success: function (result) {
//         //console.log("Successfully created database '" + this.database + "'.");
//         callback(null, result);
//       }.bind(this),
//       error: function (error) {
//         callback(error, null);
//       }
//     });
//   };
//
//   CouchDB.prototype.destroy = function (id, callback) {
//     return request({
//
//     });
//   };
//
//   CouchDB.prototype.destroyDB = function (callback) {
//     return request({
//       db: this,
//       method: 'DELETE',
//       success: function (result) {
//         //console.log("Successfully deleted database '" + this.database + "'.");
//         callback(null, result);
//       }.bind(this),
//       error: function (error) {
//         callback(error, null);
//       }
//     });
//   };
//
//   CouchDB.prototype.exists = function (callback) {
//     return request({
//       db: this,
//       method: 'GET',
//       success: function (result) {
//         if (result.error) {
//           callback(false);
//         } else {
//           callback(result);
//         }
//       },
//       error: function (error) {
//         callback(false);
//       }
//     });
//   };
//
//   CouchDB.prototype.get = function (id, callback) {
//     return request({
//       db: this,
//       method: 'GET',
//       path: '/' + id,
//       success: function (result) {
//         if (result.error) {
//           callback(result, null);
//         } else {
//           callback(null, result);
//         }
//       },
//       error: function (error) {
//         callback(error, null);
//       }
//     })
//   };
//
//   CouchDB.prototype.query = function (options, callback) {
//     return request({
//       db: this,
//       path: getQueryPath(options),
//       method: 'GET',
//       success: function (result) {
//         if (result.error) {
//           callback(result, null);
//         } else {
//           callback(null, result);
//         }
//       },
//       error: function (error) {
//         callback(error, null);
//       }
//     });
//   };
//
//   CouchDB.prototype.update = function (doc, callback) {
//     if (!doc._id) {
//       return callback(new Error("Cannot update a document with an ID (_id)."))
//     }
//     if (!doc._rev) {
//       return callback(new Error("Cannot update a document without a revision (_rev)."), null);
//     }
//     return save({
//       db: this,
//       path: '/' + doc._id,
//       method: 'PUT',
//       data: doc,
//       callback: callback
//     });
//   };
//
//   function getQueryPath(options) {
//     var path = '/_design/' + (options.id || options._id);
//     if (options.view) {
//       path += '/_view/' + options.view;
//     }
//     var queryOpts = ['key', 'startkey', 'endkey', 'limit', 'skip'];
//     var hasQuery = false;
//     queryOpts.forEach(function (queryOpt) {
//       if (options[queryOpt]) {
//         if (!hasQuery) {
//           path += '?';
//           hasQuery = true;
//         } else {
//           path += '&';
//         }
//         var value = options[queryOpt];
//         if (typeof value === 'string') {
//           value = '"' + value + '"';
//         }
//         path += queryOpt + '=' + value;
//       }
//     });
//     return path;
//   }
//
//   function request(args) {
//     var opts = {
//       hostname: args.db.url.hostname,
//       port: args.db.url.port,
//       path: '/' + args.db.database + (args.path || ''),
//       method: (args.method || 'GET'),
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json"
//       }
//     };
//     if (args.debug) {
//       console.log(opts);
//     }
//     var result = '';
//     var req = http.request(opts, function (res) {
//       res.on('data', function (chunk) {
//         result += chunk;
//       });
//       res.on('end', function () {
//         if (args.debug) {
//           console.log(result);
//         }
//         args.success(JSON.parse(result));
//       })
//     });
//     req.on('error', function (error) {
//       console.error(error);
//       args.error(error);
//     });
//     if (args.data) {
//       req.write(JSON.stringify(args.data));
//     }
//     req.end();
//     return req;
//   }
//
//   function save(args) {
//     args.success = function (result) {
//       if (result.error) {
//         args.callback(result, null);
//       } else {
//         args.callback(null, result);
//       }
//     };
//     args.error = function (error) {
//       args.callback(error, null);
//     };
//     return request(args);
//   }
//
//   return CouchDB;
//
// })();
//
// module.exports = CouchDB;
