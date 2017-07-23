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

const utils = require('./utils.js')

const endpoint = ''

/* returns the API's endpoint */
function getMMSEndpoint () {
  return endpoint;
}

/* 
 * Retrieves the list of media files associated with a POI
 * Params: 
 *  - uuid: POI's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMediaFilesForPOI (uuid, callback) {
  
  if (!uuid) {
    console.error('retrieveMediaFilesForPOI: no uuid given')
    return false
  }
}

/* 
 * Creates a new media file for a certain POI
 * Params: 
 *  - uuid: POIs uuid
 *  - data: the metadata to create the media file with
 *  - assetUrl: the URL of the asset to create the media file with
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function createNewMEdiaFileForPOI (uuid, data, assetUrl, callback) {
  
  if (!uuid) {
    console.error('createNewMEdiaFileForPOI: no uuid given')
    return false
  }
  
  if (!data) {
    console.error('createNewMEdiaFileForPOI: no data given')
    return false
  }
  
  if (!assetUrl) {
    console.error('createNewMEdiaFileForPOI: no assetUrl given')
    return false
  }
  
}

/* 
 * Retrieves the metadata of a particular media file
 * Params: 
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMetadataForMediaFile (mediaUuid, callback) {
  
  if (!mediaUuid) {
    console.error('retrieveMetadataForMediaFile: no mediaUuid given')
    return false
  }
}

/* 
 * Updates the metadata of a particular media file
 * Params: 
 *  - mediaId: Media file's uuid
 *  - data: the metadata to update the media file with
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function updateMedataForMediaFile (mediaUuid, data, callback) {
  
  if (!mediaUuid) {
    console.error('retrieveMetadataForMediaFiles: no mediaUuid given')
    return false
  }
  
  if (!data) {
    console.error('retrieveMetadataForMediaFiles: no data given')
    return false
  }
  
}

/* 
 * Updates the URL of the asset of a particular media file
 * Params: 
 *  - mediaId: Media file's uuid
 *  - assetUrl: The URL of the asset to update the media file with
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function updateAssetForMediaFile (mediaUuid, assetUrl, callback) {
  
  if (!mediaUuid) {
    console.error('retrieveMetadataForMediaFiles: no mediaUuid given')
    return false
  }
  
  if (!assetUrl) {
    console.error('retrieveMetadataForMediaFiles: no assetUrl given')
    return false
  }
}

/* 
 * Deletes a media file moving it to a moderated trash
 * Params: 
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function deleteMediaFile (mediaUuid, callback) {
  
  if (!mediaUuid) {
    console.error('retrieveMetadataForMediaFiles: no mediaUuid given')
    return false
  }
  
}


module.exports = {
  getMMSEndpoint: getMMSEndpoint,
  retrieveMediaFilesForPOI: retrieveMediaFilesForPOI,
  createNewMEdiaFileForPOI: createNewMEdiaFileForPOI,
  retrieveMetadataForMediaFile: retrieveMetadataForMediaFile,
  updateMedataForMediaFile: updateMedataForMediaFile,
  updateAssetForMediaFile: updateAssetForMediaFile,
  deleteMediaFile: deleteMediaFile
}