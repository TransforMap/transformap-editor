var assert = require('assert');
var dataApi = require('../lib/data_api.js')

describe('DATA API', function() {

  describe('getDataEndpoint', function() {

    it('should return https://data.transformap.co/place/', function() {
      var endpoint = dataApi.getDataEndpoint();
      assert.equal(endpoint, "https://data.transformap.co/place/");
    });

  });

  describe('createOrUpdatePOI', function() {

    it('should return false if no data is provided', function() {
      var result = dataApi.createOrUpdatePOI('some_uuid',undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('getPOI', function() {

    it('should return false if no uuid is provided', function() {
      var result = dataApi.getPOI(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('deletePOI', function() {

    it('should return false if no uuid is provided', function() {
      var result = dataApi.deletePOI(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('retrieveMediaFilesForPOI', function() {

    it('should return false if no uuid is provided', function() {
      var result = dataApi.retrieveMediaFilesForPOI(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('removeMediaFileFromPOI', function() {

    it('should return false if no uuid is provided', function() {
      var result = dataApi.removeMediaFileFromPOI(undefined,'some_media_id',function(){});
      assert.equal(result, false);
    });

    it('should return false if no mediaId is provided', function() {
      var result = dataApi.removeMediaFileFromPOI('some_uuid',undefined,function(){});
      assert.equal(result, false);
    });

  });

});
