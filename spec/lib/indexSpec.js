var recumbent = require('../../lib');

describe("recumbent", function () {

  it('has a DB constructor', function () {
    expect(recumbent.DB).toBeDefined();
    expect(typeof recumbent.DB).toEqual('function');
  });

});
