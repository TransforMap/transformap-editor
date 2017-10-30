/*
 * This library handles calls to the transformap data api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

const utils = require('./utils.js');

const endpoint = utils.baseUrl + '/place/';

/* returns the API's endpoint */
function getDataEndpoint () {
  return endpoint;
}

/*
 * Creates (if uuid is not set) or updates (if it is) a POI with the data passed as parameter
 * Params:
 *  - uuid: POI's uuid, null if does not exist
 *  - data: to create or update POI
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function createOrUpdatePOI (uuid, data, callback) {
  if (!data) {
    console.error('updateOrCreatePOI: no data given');
    return false;
  }

  var xhr = utils.createCORSRequest(uuid ? 'PUT' : 'POST', endpoint + uuid);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var retJson = JSON.parse(xhr.responseText);
        console.log(retJson);
        if (retJson.id) {
          callback(retJson.id);
          alert('Save successful');
        } else {
          alert('Error: something wrent wrong on saving: ' + JSON.stringify(retJson));
        }
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Gets the metadata of a certain POI
 * Params:
 *  - uuid: POI's uuid
 *  - data: to create or update POI
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function getPOI (uuid, callback) {
  if (!uuid) {
    console.error('getPOI: no uuid given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getDataEndpoint() + uuid);
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
 * Deletes the POI corresponding to the uuid passed as parameter
 * Params:
 *  - uuid: POI's uuid, null if does not exist
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function deletePOI (uuid, callback) {
  if (!uuid) {
    console.error('deletePOI: no uuid given');
    return false;
  }

  var xhr = utils.createCORSRequest('DELETE', endpoint + uuid);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(uuid);
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  getDataEndpoint: getDataEndpoint,
  createOrUpdatePOI: createOrUpdatePOI,
  getPOI: getPOI,
  deletePOI: deletePOI
};
