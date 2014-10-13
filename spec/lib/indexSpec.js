var recumbent = require('../../lib');

describe("recumbent", function () {

  it('has a Server constructor', function () {
    expect(recumbent.Server).toBeDefined();
    expect(typeof recumbent.Server).toEqual('function');
  });

});
