var recumbent = require('..');

describe('recumbent', function() {

  it('has a Database', function () {
    expect(recumbent.Database).toBeDefined();
  });

  it('has a Query', function () {
    expect(recumbent.Query).toBeDefined();
  });

  it('has a Server', function () {
    expect(recumbent.Server).toBeDefined();
  });

  it('has a Writer', function () {
    expect(recumbent.Writer).toBeDefined();
  });

});