var assert = require('assert');
var mmsApi = require('../lib/mms_api.js')

describe('MMS API', function() {

  describe('getMMSEndpoint', function() {

    it('should return https://data.transformap.co/media/', function() {
      var endpoint = mmsApi.getMMSEndpoint();
      assert.equal(endpoint, "https://data.transformap.co/media/");
    });

  });

});
