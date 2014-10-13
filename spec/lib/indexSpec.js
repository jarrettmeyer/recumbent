var recumbent = require('../../lib');

describe("recumbent", function () {

  it('has a Database constructor', function () {
    expect(recumbent.Database).toBeDefined();
    expect(typeof recumbent.Database).toEqual('function');
  });

  it('has a Query constructor', function () {
    expect(recumbent.Query).toBeDefined();
    expect(typeof recumbent.Query).toEqual('function');
  });

  it('has a Server constructor', function () {
    expect(recumbent.Server).toBeDefined();
    expect(typeof recumbent.Server).toEqual('function');
  });

  it('has a Writer constructor', function () {
    expect(recumbent.Writer).toBeDefined();
    expect(typeof recumbent.Writer).toEqual('function');
  });

});
