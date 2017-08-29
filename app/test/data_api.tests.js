var assert = require('assert');
var dataApi = require('../lib/data_api.js')

describe('DATA API', function() {

  describe('getDataEndpoint', function() {

    it('should return https://data.transformap.co/place/', function() {
      var endpoint = dataApi.getDataEndpoint();
      assert.equal(endpoint, "https://data.transformap.co/place/");
    });

  });

});
