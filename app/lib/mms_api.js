/*
 * This library handles calls to the transformap MMS api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

const utils = require('./utils.js');
const RequestBody = require('maltypart').RequestBody;
const endpoint = utils.baseUrl + '/media/';

/* returns the API's endpoint */
function getMMSEndpoint () {
  return endpoint;
}

/*
 * Creates a new media file for a certain POI
 * Params:
 *  - data: the metadata to create the media file with
 *  - blob: the blob to upload along the metadata
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function createNewMediaFile (data, blob, callback) {

  if (!data) {
    console.error('createNewMediaFile: no data given');
    return false;
  }
  
  if (!blob) {
    console.error('createNewMediaFile: no blob given');
    return false;
  }
  
  var request = new RequestBody();
  
  if (data){
    request.append(data);
  }
  
  if (blob){
    request.append(blob.name, {
      contentType : blob.type,
      data : blob.contents
    });
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint());
  xhr.setRequestHeader('Content-Type', request.getContentType());
  xhr.withCredentials = true;
  xhr.send(request.getData());

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Retrieves the metadata of a particular media file
 * Params:
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMetadataForMediaFile (mediaId, callback) {
  if (!mediaId) {
    console.error('retrieveMetadataForMediaFile: no mediaId given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getMMSEndpoint() + mediaId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Creates a new media file for a certain POI
 * Params:
 *  - data: the metadata to create the media file with
 *  - blob: the blob to upload along the metadata
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function updateMediaFile (data, blob, callback) {
  
  if (!data) {
    console.error('updateMediaFile: no data given');
    return false;
  }
  
  var request = new RequestBody();
  
  if (data){
    request.append(data);
  }
  
  if (blob){
    request.append(blob.name, {
      contentType : blob.type,
      data : blob.content
    });
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint());
  xhr.setRequestHeader('Content-Type', request.getContentType());
  xhr.withCredentials = true;
  xhr.send(request.getData());

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Returns an array with all the versions of a certain media file
 * Params:
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMediaFileVersions (mediaId, callback) {
  if (!mediaId) {
    console.error('retrieveMediaFileVersions: no mediaId given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getMMSEndpoint() + mediaId + '/versions');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Sets a version as currently active
 * Params:
 *  - mediaId: Media file's uuid
 *  - versionId: The uuid of the version to set as currently active
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function setActiveMediaFileVersion (mediaId, versionId, callback) {
  if (!mediaId) {
    console.error('setActiveMediaFileVersion: no mediaId given');
    return false;
  }
  if (!versionId) {
    console.error('setActiveMediaFileVersion: no versionId given');
    return false;
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint() + mediaId + '/versions/' + versionId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  getMMSEndpoint: getMMSEndpoint,
  createNewMediaFile: createNewMediaFile,
  updateMediaFile: updateMediaFile,
  retrieveMetadataForMediaFile: retrieveMetadataForMediaFile,
  retrieveMediaFileVersions: retrieveMediaFileVersions,
  setActiveMediaFileVersion: setActiveMediaFileVersion
};
