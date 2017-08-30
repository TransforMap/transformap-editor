var assert = require('assert');
var dataApi = require('../lib/data_api.js')
var utils = require('../lib/utils.js')

describe('UTILS', function() {

  describe('getUrlPath', function() {

    it('should return expected path', function() {
      var url = "https://data.transformap.co/place/"
      var path = utils.getUrlPath(url)
      assert.equal(path, "/place/");
    });

    it('should return expected multi-valued path', function() {
      var url = "https://data.transformap.co/place/1234/media"
      var path = utils.getUrlPath(url)
      assert.equal(path, "/place/1234/media");
    });

  });

});
