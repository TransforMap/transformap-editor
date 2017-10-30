global.$ENVSTATIC_BASE_URL = "https://domain";

var assert = require('assert');
var mmsApi = require('../lib/mms_api.js');

describe('MMS API', function() {

  describe('getMMSEndpoint', function() {

    it('should return https://data.transformap.co/media/', function() {
      var endpoint = mmsApi.getMMSEndpoint();
      assert.equal(endpoint, "https://domain/media/");
    });

  });

  describe('createNewMediaFile', function() {

    it('should return false if no data is provided', function() {
      var result = mmsApi.createNewMediaFile(undefined,'some blob',function(){});
      assert.equal(result, false);
    });
    
    it('should return false if no blob is provided', function() {
      var result = mmsApi.createNewMediaFile({},undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('retrieveMetadataForMediaFile', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.retrieveMetadataForMediaFile(undefined,function(){});
      assert.equal(result, false);
    });

  });
  
  describe('updateMediaFile', function() {

    it('should return false if no data is provided', function() {
      var result = mmsApi.updateMediaFile(undefined,'some blob',function(){});
      assert.equal(result, false);
    });

  });

  describe('retrieveMediaFileVersions', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.retrieveMediaFileVersions(undefined,function(){});
      assert.equal(result, false);
    });

  });

  describe('setActiveMediaFileVersion', function() {

    it('should return false if no mediaId is provided', function() {
      var result = mmsApi.setActiveMediaFileVersion(undefined,{"name": "test"},function(){});
      assert.equal(result, false);
    });

    it('should return false if no versionId is provided', function() {
      var result = mmsApi.setActiveMediaFileVersion('some_media_id',undefined,function(){});
      assert.equal(result, false);
    });

  });


});
