// var CouchDB = require('../../../lib/data/CouchDB');
//
// describe('CouchDB', function () {
//
//   var db;
//
//   beforeEach(function () {
//     db = new CouchDB({
//       url: 'http://localhost:5984',
//       database: 'test'
//     });
//   });
//
//   afterEach(function () {
//     // db.destroyDB(function (error, result) {
//     //   if (error) {
//     //     console.error(error);
//     //   }
//     // });
//   })
//
//   it('should have a valid constructor', function () {
//     expect(CouchDB).toBeDefined();
//     expect(typeof CouchDB).toEqual('function');
//   });
//
//   it('has a connection URL attribute', function () {
//     expect(db.url.hostname).toEqual('localhost');
//     expect(db.url.port).toEqual('5984');
//   });
//
//   it('has a database attribute', function () {
//     expect(db.database).toEqual('test');
//   });
//
//   describe('addView', function () {
//
//     it('can add a view to an existing design document', function (done) {
//       db.database = 'view_testing';
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         }
//         db.addDesignDocument({ _id: 'test' }, function (error, result) {
//           if (error) {
//             done(error);
//           }
//           expect(result.ok).toEqual(true);
//           db.addView({
//             id: 'test',
//             name: 'adults',
//             map: function (doc) {
//               if (doc.age > 21) {
//                 emit(doc._id, doc.age);
//               }
//             },
//             reduce: function (keys, values) {
//               var sum = 0, count = 0;
//               values.forEach(function (value) {
//                 count += 1;
//                 sum += value;
//               });
//               if (count === 0) {
//                 return 0;
//               }
//               return sum / count;
//             }
//           }, function (error, result) {
//             if (error) {
//               done(error);
//             }
//             expect(result.ok).toEqual(true);
//             db.destroyDB(function (error, result) {
//               expect(result.ok).toEqual(true);
//               done(error);
//             });
//           });
//         });
//       });
//     });
//
//   });
//
//   describe('create', function () {
//
//     it('can create a new document', function (done) {
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         }
//         db.create({ _id: 'test', message: 'testing document creation'}, function (error, result) {
//           expect(result.ok).toEqual(true);
//           expect(result.id).toEqual('test');
//           db.destroyDB(function (error, result) {
//             done(error);
//           })
//         });
//       });
//     });
//
//     it('can create a new design document', function (done) {
//       db.createDB(function (error, result) {
//         db.create({ _id: '_design/demo', description: 'Testing design document creation.' }, function (error, result) {
//           expect(result.ok).toEqual(true);
//           expect(result.id).toEqual('_design/demo');
//           expect(result.rev).toMatch(/^1\-/);
//           db.destroyDB(function (error, result) {
//             done(error);
//           })
//         });
//       });
//     });
//
//   });
//
//   describe('createDB', function () {
//
//     it('can create a new database', function (done) {
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         } else {
//           expect(result.ok).toEqual(true);
//           db.destroyDB(function (error, result) {
//             if (error) {
//               done(error);
//             } else {
//               done();
//             }
//           })
//         }
//       });
//     });
//
//   });
//
//   describe('destroyDB', function () {
//
//     it('can delete a database', function (done) {
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         } else {
//           db.destroyDB(function (error, result) {
//             if (error) {
//               done(error);
//             } else {
//               expect(result.ok).toEqual(true);
//               done();
//             }
//           });
//         }
//       });
//     });
//
//   });
//
//   describe('exists', function () {
//
//     it('returns false when the database does not exist', function (done) {
//       db.database = 'this-is-junk-' + Math.random().toString().replace('.', '');
//       db.exists(function (result) {
//         expect(result).toBeFalsy();
//         done();
//       });
//     });
//
//     it('returns true when the database does exist', function (done) {
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         } else {
//           db.exists(function (result) {
//             expect(result).toBeTruthy();
//             db.destroyDB(function (error, result) {
//               if (error) {
//                 done(error);
//               } else {
//                 done();
//               }
//             });
//           });
//         }
//       });
//     });
//
//   });
//
//   describe('get', function () {
//
//     it('can return an existing document', function (done) {
//       db.createDB(function (error, result) {
//         if (error) {
//           done(error);
//         }
//         db.create({ _id: 'test', message: 'testing get existing document' }, function (error, result) {
//           if (error) {
//             done(error);
//           }
//           db.get('test', function (error, result) {
//             if (error) {
//               done(error);
//             }
//             expect(result._id).toEqual('test');
//             expect(result.message).toEqual('testing get existing document');
//             expect(result._rev).toMatch(/^1\-*/);
//             db.destroyDB(function (error, result) {
//               if (error) {
//                 done(error);
//               } else {
//                 done();
//               }
//             });
//           });
//         });
//       });
//     });
//
//     it('returns an error is a document does not exist', function (done) {
//       db.createDB(function (error, result) {
//         db.get('i-do-not-exist', function (error, result) {
//           expect(error.error).toEqual('not_found');
//           db.destroyDB(function (error, result) {
//             done(error);
//           });
//         });
//       });
//     });
//
//   });
//
//   describe('query', function () {
//
//     it('can query a view', function (done) {
//       db.database = 'query_test';
//       db.createDB(function (error, result) {
//         db.create({ _id: '1', message: "hello world" }, function (error, result) {
//           if (error) {
//             done(error);
//           }
//           expect(result.ok).toEqual(true);
//           expect(result.id).toEqual('1');
//           db.addDesignDocument({ _id: 'my_design_doc' }, function (error, result) {
//             if (error) {
//               done(error);
//             }
//             expect(result.ok).toEqual(true);
//             db.addView({
//               id: 'my_design_doc',
//               name: 'my_view',
//               map: function (doc) {
//                 emit(doc._id, doc);
//               }
//             }, function (error, result) {
//               if (error) {
//                 done(error);
//               }
//               expect(result.ok).toEqual(true);
//               db.query({
//                 id: 'my_design_doc',
//                 view: 'my_view'
//               }, function (error, result) {
//                 if (error) {
//                   done(error);
//                 }
//                 expect(result.total_rows).toEqual(1);
//                 expect(result.offset).toEqual(0);
//                 expect(result.rows[0].id).toEqual('1');
//                 db.destroyDB(function (error, result) {
//                    done(error);
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//
//   });
//
//   describe('update', function () {
//
//     it('can update an existing document', function (done) {
//       db.createDB(function (error, result) {
//         db.create({ _id: 'test', message: 'updating existing document' }, function (error, result) {
//           db.get('test', function (error, result) {
//             expect(result._rev).toMatch(/^1\-/);
//             result.message = "I have updated this message.";
//             db.update(result, function (error, result) {
//               expect(result.ok).toEqual(true);
//               expect(result.id).toEqual('test');
//               expect(result.rev).toMatch(/^2\-/);
//               db.destroyDB(function (error, result) {
//                 done(error);
//               });
//             });
//           });
//         });
//       });
//     });
//
//     it('returns an error if a document does not have a revision', function (done) {
//       db.createDB(function (error, result) {
//         db.update({ _id: 'junk', message: "I do not exist and cannot be updated" }, function (error, result) {
//           expect(error.message).toEqual('Cannot update a document without a revision (_rev).');
//           db.destroyDB(function (error, result) {
//             done(error);
//           });
//         });
//       });
//     });
//
//   });
//
// });
