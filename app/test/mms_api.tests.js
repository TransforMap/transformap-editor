var assert = require('assert');
var mmsApi = require('../lib/mms_api.js')

describe('MMS API', function() {

  describe('getMMSEndpoint', function() {

    it('should return https://data.transformap.co/media/', function() {
      var endpoint = mmsApi.getMMSEndpoint();
      assert.equal(endpoint, "https://data.transformap.co/media/");
    });

  });

  describe('createNewMediaFileForPOI', function() {

    it('should return false if no uuid is provided', function() {
      var result = mmsApi.createNewMediaFileForPOI(undefined,{"name": "test"},function(){});
      assert.equal(result, false);
    });

    it('should return false if no data is provided', function() {
      var result = mmsApi.createNewMediaFileForPOI('some_uuid',undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('retrieveMetadataForMediaFile', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.retrieveMetadataForMediaFile(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('updateMedataForMediaFile', function() {

    it('should return false if no uuid is provided', function() {
      var result = mmsApi.updateMedataForMediaFile(undefined,{"name": "test"},function(){});
      assert.equal(result, false);
    });

    it('should return false if no data is provided', function() {
      var result = mmsApi.updateMedataForMediaFile('some_uuid',undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('retrieveMediaFileVersions', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.retrieveMediaFileVersions(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('addMediaFileVersion', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.addMediaFileVersion(undefined,{"name": "test"},function(){});
      assert.equal(result, false);
    });

    it('should return false if no data is provided', function() {
      var result = mmsApi.addMediaFileVersion('some_media_id',undefined,function(){});
      assert.equal(result, false);
    });

  });

});
