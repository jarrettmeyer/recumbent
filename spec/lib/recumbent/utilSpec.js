var _util = require('../../../lib/recumbent/util');

describe('util', function () {

  describe('invokeCallback', function () {

    it('invokes a callback when a function is given', function (done) {
      function myFunc() {
        expect(true).toEqual(true);
        done();
      }
      _util.invokeCallback(myFunc, null, null);
    });

    it('returns null when no function is passed', function () {
      var result = _util.invokeCallback(null);
      expect(result).toEqual(null);
    });

  });

  describe('isFunction', function () {

    it('returns false when given null', function () {
      expect(_util.isFunction(null)).toBeFalsy();
    });

    it('returns true when given a function', function () {
      var myFunc = function () { return true; };
      expect(_util.isFunction(myFunc)).toBeTruthy();
    });

  });

});
